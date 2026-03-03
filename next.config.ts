import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "standalone", // 파일 전달 및 Docker 배포용 최적화 빌드
  turbopack: {
    root: __dirname, // workspace 루트 경고 제거
  },
  compiler: {
    // production 빌드 시 console.log 제거 (console.error는 유지)
    removeConsole: isProd ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
