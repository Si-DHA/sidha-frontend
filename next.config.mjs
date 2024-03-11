/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://34.66.116.60:10001/api/:path*', // Ganti dengan URL API Anda
      },
    ];
  },
};

export default nextConfig;
