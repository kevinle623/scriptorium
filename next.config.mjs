/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_URL,
    },
    images: {
        domains: ['csc309-scriptorium-kevin-le.s3.us-east-2.amazonaws.com', 'example.com'],
    },
};

export default nextConfig;
