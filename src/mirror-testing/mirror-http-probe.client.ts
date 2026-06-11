import { Inject, Injectable, Optional } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as dns from 'node:dns';
import * as http from 'node:http';
import * as https from 'node:https';
import * as net from 'node:net';
import type { LookupFunction } from 'node:net';
import { performance } from 'node:perf_hooks';
import { HttpProbeResult } from './interfaces/http-probe-result.interface';
import {
  DEFAULT_MIRROR_TESTING_OPTIONS,
  MIRROR_TESTING_OPTIONS,
  MirrorTestingOptions,
} from './mirror-testing.constants';
import { ProbeTimingsTracker } from './probe-timings.tracker';

function attachConnectTiming(socket: net.Socket, tracker: ProbeTimingsTracker): void {
  if (!socket.connecting) {
    tracker.recordConnection(0);
    return;
  }

  const connectStart = performance.now();
  socket.once('connect', () => {
    tracker.recordConnection(Math.round(performance.now() - connectStart));
  });
}

function createDnsLookupFn(tracker: ProbeTimingsTracker): LookupFunction {
  return (hostname, options, callback) => {
    const start = performance.now();
    dns.lookup(hostname, options, (err, address, family) => {
      tracker.recordDnsLookup(Math.round(performance.now() - start));
      callback(err, address, family);
    });
  };
}

function createHttpAgent(tracker: ProbeTimingsTracker, lookupFn: LookupFunction): http.Agent {
  class HttpTimedAgent extends http.Agent {
    constructor() {
      super({ keepAlive: false, lookup: lookupFn });
    }

    createConnection(
      options: net.SocketConnectOpts,
      callback?: (err: Error, socket: net.Socket) => void,
    ): net.Socket {
      const socket = super.createConnection(options, callback) as net.Socket;
      attachConnectTiming(socket, tracker);
      return socket;
    }
  }

  return new HttpTimedAgent();
}

function createHttpsAgent(tracker: ProbeTimingsTracker, lookupFn: LookupFunction): https.Agent {
  class HttpsTimedAgent extends https.Agent {
    constructor() {
      super({ keepAlive: false, lookup: lookupFn });
    }

    createConnection(
      options: net.SocketConnectOpts,
      callback?: (err: Error, socket: net.Socket) => void,
    ): net.Socket {
      const socket = super.createConnection(options, callback) as net.Socket;
      attachConnectTiming(socket, tracker);
      return socket;
    }
  }

  return new HttpsTimedAgent();
}

@Injectable()
export class MirrorHttpProbeClient {
  constructor(
    @Optional()
    @Inject(MIRROR_TESTING_OPTIONS)
    private readonly options: MirrorTestingOptions = DEFAULT_MIRROR_TESTING_OPTIONS,
  ) {}

  async probe(testFileUrl: string): Promise<HttpProbeResult> {
    const tracker = new ProbeTimingsTracker();
    const client = this.createClient(tracker);
    const totalStart = performance.now();

    try {
      const response = await client.get<ArrayBuffer>(testFileUrl);
      tracker.recordTotal(Math.round(performance.now() - totalStart));
      return this.toProbeResult(response, tracker);
    } catch (error) {
      tracker.recordTotal(Math.round(performance.now() - totalStart));
      return this.toProbeError(error, tracker);
    }
  }

  private createClient(tracker: ProbeTimingsTracker): AxiosInstance {
    const lookupFn = createDnsLookupFn(tracker);

    return axios.create({
      timeout: this.options.timeoutMs,
      responseType: 'arraybuffer',
      validateStatus: () => true,
      maxRedirects: this.options.maxRedirects,
      httpAgent: createHttpAgent(tracker, lookupFn),
      httpsAgent: createHttpsAgent(tracker, lookupFn),
      maxContentLength: 10 * 1024 * 1024,
    });
  }

  private toProbeResult(
    response: AxiosResponse<ArrayBuffer>,
    tracker: ProbeTimingsTracker,
  ): HttpProbeResult {
    const statusCode = response.status;
    const packageSizeBytes = response.data?.byteLength ?? 0;
    const isAvailable = statusCode >= 200 && statusCode < 400;

    return {
      statusCode,
      isAvailable,
      packageSizeBytes,
      dnsLookupMs: tracker.dnsLookupMs,
      connectionMs: tracker.connectionMs,
      totalResponseMs: tracker.totalResponseMs,
    };
  }

  private toProbeError(error: unknown, tracker: ProbeTimingsTracker): HttpProbeResult {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ArrayBuffer>;
      if (axiosError.response) {
        return {
          statusCode: axiosError.response.status,
          isAvailable: false,
          packageSizeBytes: axiosError.response.data?.byteLength ?? 0,
          dnsLookupMs: tracker.dnsLookupMs,
          connectionMs: tracker.connectionMs,
          totalResponseMs: tracker.totalResponseMs,
        };
      }
    }

    return {
      statusCode: 0,
      isAvailable: false,
      packageSizeBytes: 0,
      dnsLookupMs: tracker.dnsLookupMs,
      connectionMs: tracker.connectionMs,
      totalResponseMs: tracker.totalResponseMs,
    };
  }
}
