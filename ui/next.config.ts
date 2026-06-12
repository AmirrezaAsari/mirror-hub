import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // Keep tracing scoped to ui/ so standalone output is at .next/standalone/server.js
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
