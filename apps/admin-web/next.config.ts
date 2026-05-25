import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages so their TypeScript source
  // (with .js extension imports for NodeNext) works correctly
  transpilePackages: ["@campusos/shared-types", "@campusos/constants"],
};

export default nextConfig;
