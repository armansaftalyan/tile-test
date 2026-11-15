import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  agentRules: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  trailingSlash: true,
  devIndicators: false,
  poweredByHeader: false,
};
export default config;
