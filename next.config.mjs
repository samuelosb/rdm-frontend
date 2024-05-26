/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_URL: 'http://localhost:3001',
    },
    productionBrowserSourceMaps: false, // This disables source maps in production (avoid console errors). You can also delete this line.
};

export default nextConfig;

