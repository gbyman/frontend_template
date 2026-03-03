/**
 * 애플리케이션 전역 상수 파일
 *
 * 파일이 커질 경우 아래 구조로 분리를 권장합니다:
 *
 * src/constants/
 *   routes.ts      → ROUTES
 *   storage.ts     → STORAGE_KEYS
 *   http.ts        → HTTP
 *   date.ts        → DATE_FORMAT
 *   validation.ts  → VALIDATION
 *   number.ts      → NUMBER, FILE_SIZE
 *   zIndex.ts      → Z_INDEX
 *   locale.ts      → LOCALE
 *   query.ts       → QUERY
 *
 * 분리 후 각 파일을 index.ts에서 re-export하면 import 경로를 유지할 수 있습니다:
 *   export * from "./routes";
 *   export * from "./storage";
 *   ...
 */

// ---------------------------------------------------------------------------
// 라우트
// ---------------------------------------------------------------------------
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const;

// ---------------------------------------------------------------------------
// 로컬 스토리지 키
// ---------------------------------------------------------------------------
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
} as const;

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------
export const HTTP = {
  STATUS_UNAUTHORIZED: 401,
  CONTENT_TYPE_JSON: "application/json",
} as const;

// ---------------------------------------------------------------------------
// API 설정
// ---------------------------------------------------------------------------
export const API = {
  TIMEOUT_MS: 10000,
  DEFAULT_BASE_URL: "http://localhost:8080",
  RUNTIME_ENV_CONFIG_PATH: "/env-config.js",
} as const;

// ---------------------------------------------------------------------------
// React Query 설정
// ---------------------------------------------------------------------------
export const QUERY = {
  STALE_TIME_MS: 1000 * 60 * 5, // 5분
  GC_TIME_MS: 1000 * 60 * 10, // 10분
  RETRY_COUNT: 1,
} as const;

// ---------------------------------------------------------------------------
// 날짜 포맷
// ---------------------------------------------------------------------------
export const DATE_FORMAT = {
  DATE: "YYYY-MM-DD",
  DATETIME: "YYYY-MM-DD HH:mm",
  TIME: "HH:mm",
} as const;

// ---------------------------------------------------------------------------
// 유효성 검사
// ---------------------------------------------------------------------------
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 16,
  USERNAME_MIN_LENGTH: 1,
  USERNAME_MAX_LENGTH: 10,
} as const;

// ---------------------------------------------------------------------------
// 숫자 / 파일 크기
// ---------------------------------------------------------------------------
export const NUMBER = {
  DEFAULT_DECIMAL_PLACES: 2,
} as const;

export const FILE_SIZE = {
  BYTES_PER_UNIT: 1024,
  UNITS: ["Bytes", "KB", "MB", "GB", "TB"] as const,
  ZERO_LABEL: "0 Bytes",
  DECIMAL_PLACES: 2,
} as const;

// ---------------------------------------------------------------------------
// z-index
// ---------------------------------------------------------------------------
export const Z_INDEX = {
  GLOBAL_SPINNER: 999999,
} as const;

// ---------------------------------------------------------------------------
// 로케일 (locale.ts에서 이전)
// ---------------------------------------------------------------------------
export const LOCALE = {
  DEFAULT: "ko-KR",
  KO: "ko-KR",
  EN: "en-US",
} as const;

// ---------------------------------------------------------------------------
// 스토리지 키 (로케일)
// ---------------------------------------------------------------------------
export const LOCALE_STORAGE_KEY = "I18N_LANGUAGE" as const;
