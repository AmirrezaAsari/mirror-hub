import { resolveTestFileUrl } from './resolve-test-file-url';

describe('resolveTestFileUrl', () => {
  it('joins base URL and test file path', () => {
    expect(resolveTestFileUrl('https://pypi.example.com', 'simple/')).toBe(
      'https://pypi.example.com/simple/',
    );
  });

  it('handles trailing slash on base URL', () => {
    expect(resolveTestFileUrl('https://pypi.example.com/', 'simple/')).toBe(
      'https://pypi.example.com/simple/',
    );
  });

  it('handles leading slash on test file path', () => {
    expect(resolveTestFileUrl('https://pypi.example.com', '/simple/')).toBe(
      'https://pypi.example.com/simple/',
    );
  });
});
