import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The marketing site at the repo root has its own lockfile; pin the app root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
