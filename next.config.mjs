/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        canvas: "commonjs canvas",
      });
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  swcMinify: false,
  experimental: {
    swcLoader: false,
  },
};

export default nextConfig;
