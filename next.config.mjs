/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'csc309-scriptorium-kevin-le.s3.us-east-2.amazonaws.com',
                port: '',
                pathname: '/avatars/**',
            }]
    },
};

export default nextConfig;
