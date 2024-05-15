/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.206.238.83/api/:path*', // Replace with your backend server URL
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          // Add other CORS headers if necessary
        ],
      },
    ];
  },
    images: {
        domains: [
          "images.unsplash.com",
          "example.com",
          "172.206.238.83" ,
         "https://encrypted-tbn0.gstatic.com",
         "cover.png"
        ],
      },
};

export default nextConfig;
