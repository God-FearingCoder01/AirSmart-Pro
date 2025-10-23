const API_URL = process.env.API_URL || 'http://localhost:8000/api';

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Proxy API calls to configured backend URL in both dev and prod
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.69:3000'],
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  env: {
    API_URL,
  },
};