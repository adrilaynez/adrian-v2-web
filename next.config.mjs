/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: isProd
                    ? 'https://lm-lab.onrender.com/api/v1/:path*'
                    : 'http://localhost:8000/api/v1/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;
