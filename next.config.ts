import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ['192.168.1.146'],
	turbopack: {
		root: path.resolve(__dirname),
	},
};

export default nextConfig;
