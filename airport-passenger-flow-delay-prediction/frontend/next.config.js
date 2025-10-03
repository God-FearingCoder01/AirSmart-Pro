module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend "/api/..."
        destination: "http://localhost:8000/api/:path*", // backend Django
      },
    ]
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.69:3000'],
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000/api', // Set your API URL here
  },
};