import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true, // Enable the React compiler to optimize React component rendering
	cacheComponents: false, // Enable component caching
	experimental: {
		turbopackFileSystemCacheForDev: true, // Enable Turbopack file system cache for development
	},
};

export default nextConfig;
