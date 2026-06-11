export function resolveTestFileUrl(baseUrl: string, testFilePath: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = testFilePath.startsWith('/') ? testFilePath.slice(1) : testFilePath;

  return new URL(normalizedPath, normalizedBase).href;
}
