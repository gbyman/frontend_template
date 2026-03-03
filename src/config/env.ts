import { API } from "@/constants/constants";

/**
 * 환경변수 접근 유틸리티
 *
 * 우선순위:
 *   1. window.__ENV__ (Docker 런타임 주입 - docker-entrypoint.sh)
 *   2. process.env.NEXT_PUBLIC_* (빌드타임 임베드 - 로컬/일반 배포)
 *
 * Docker 단일 이미지 배포 시:
 *   - 빌드 시 process.env 값이 번들에 포함되지만
 *   - 컨테이너 시작 시 window.__ENV__가 덮어씌워 실제 환경값 사용
 */

declare global {
  interface Window {
    __ENV__?: {
      NEXT_PUBLIC_API_BASE_URL?: string;
    };
  }
}

const getRuntimeEnv = (
  key: keyof NonNullable<Window["__ENV__"]>,
  buildTimeValue: string | undefined
): string => {
  if (typeof window !== "undefined") {
    const runtimeValue = window.__ENV__?.[key];
    // {{ }} 형태는 nginx 미치환 템플릿 문자열 → 빌드타임 값 사용
    if (runtimeValue && !runtimeValue.startsWith("{{")) {
      return runtimeValue;
    }
  }
  return buildTimeValue ?? "";
};

export const ENV = {
  get API_BASE_URL() {
    return (
      getRuntimeEnv("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL) ||
      API.DEFAULT_BASE_URL
    );
  },
  get isDev() {
    return process.env.NODE_ENV === "development";
  },
  get isProd() {
    return process.env.NODE_ENV === "production";
  },
};
