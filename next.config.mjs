/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/ims',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/ims',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
