import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    typedRoutes: false,
  },
  // Exclude backend directory from Next.js compilation
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Since you're using Neon database directly, no need for backend proxy
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude backend directory from webpack compilation
    config.externals = config.externals || [];
    config.externals.push({
      './backend': 'commonjs ./backend',
    });
    
    return config;
  },
};

export default nextConfig;
