/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/live-stock',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/live-stock',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
