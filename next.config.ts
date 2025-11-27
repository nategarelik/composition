import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Properly handle three.js packages
  transpilePackages: ['three', '@react-three/fiber'],

  // Configure webpack to handle canvas
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]
    return config
  },

  // Suppress hydration warnings from Three.js
  reactStrictMode: false,
}

export default nextConfig
