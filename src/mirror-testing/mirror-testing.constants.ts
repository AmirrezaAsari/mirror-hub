export const MIRROR_TESTING_OPTIONS = Symbol('MIRROR_TESTING_OPTIONS');

export interface MirrorTestingOptions {
  timeoutMs: number;
  maxRedirects: number;
  testFilePath: string;
}

export const DEFAULT_MIRROR_TESTING_OPTIONS: MirrorTestingOptions = {
  timeoutMs: 15_000,
  maxRedirects: 5,
  testFilePath: 'simple/',
};
