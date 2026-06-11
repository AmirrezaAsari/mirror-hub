import { Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { MirrorRepository } from '../mirror/mirror.repository';
import { MirrorTestResultDto } from './dto/mirror-test-result.dto';
import { MirrorHttpProbeClient } from './mirror-http-probe.client';
import {
  DEFAULT_MIRROR_TESTING_OPTIONS,
  MIRROR_TESTING_OPTIONS,
  MirrorTestingOptions,
} from './mirror-testing.constants';
import { ScanResultRepository } from './scan-result.repository';
import { resolveTestFileUrl } from './utils/resolve-test-file-url';

@Injectable()
export class MirrorTestingService {
  constructor(
    private readonly mirrorRepository: MirrorRepository,
    private readonly scanResultRepository: ScanResultRepository,
    private readonly httpProbeClient: MirrorHttpProbeClient,
    @Optional()
    @Inject(MIRROR_TESTING_OPTIONS)
    private readonly options: MirrorTestingOptions = DEFAULT_MIRROR_TESTING_OPTIONS,
  ) {}

  async testMirror(mirrorId: string): Promise<MirrorTestResultDto> {
    const mirror = await this.mirrorRepository.findById(mirrorId);
    if (!mirror) {
      throw new NotFoundException(`Mirror with id "${mirrorId}" not found`);
    }

    const testFileUrl = resolveTestFileUrl(mirror.baseUrl, this.options.testFilePath);
    return this.runTest(mirrorId, testFileUrl);
  }

  async testMirrorUrl(mirrorId: string, mirrorUrl: string): Promise<MirrorTestResultDto> {
    await this.ensureMirrorExists(mirrorId);
    return this.runTest(mirrorId, mirrorUrl);
  }

  private async runTest(mirrorId: string, mirrorUrl: string): Promise<MirrorTestResultDto> {
    const probeResult = await this.httpProbeClient.probe(mirrorUrl);

    await this.scanResultRepository.create({
      mirrorId,
      responseTimeMs: probeResult.totalResponseMs,
      statusCode: probeResult.statusCode,
      isAvailable: probeResult.isAvailable,
      packageSizeBytes: probeResult.packageSizeBytes,
    });

    return {
      mirrorId,
      responseTimeMs: probeResult.totalResponseMs,
      statusCode: probeResult.statusCode,
      isAvailable: probeResult.isAvailable,
    };
  }

  private async ensureMirrorExists(mirrorId: string): Promise<void> {
    const mirror = await this.mirrorRepository.findById(mirrorId);
    if (!mirror) {
      throw new NotFoundException(`Mirror with id "${mirrorId}" not found`);
    }
  }
}
