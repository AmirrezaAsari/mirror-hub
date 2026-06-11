export class ProbeTimingsTracker {
  dnsLookupMs = 0;
  connectionMs = 0;
  totalResponseMs = 0;

  recordDnsLookup(ms: number): void {
    this.dnsLookupMs = ms;
  }

  recordConnection(ms: number): void {
    this.connectionMs = ms;
  }

  recordTotal(ms: number): void {
    this.totalResponseMs = ms;
  }
}
