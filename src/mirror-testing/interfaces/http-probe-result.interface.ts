export interface HttpProbeResult {
  statusCode: number;
  isAvailable: boolean;
  packageSizeBytes: number;
  dnsLookupMs: number;
  connectionMs: number;
  totalResponseMs: number;
}
