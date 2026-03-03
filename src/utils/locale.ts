import { LOCALE, LOCALE_STORAGE_KEY } from "@/constants/constants";

/** LOCALE 값 목록 (예: ["ko-KR", "en-US"]) */
const SUPPORTED_LOCALES: string[] = Object.values(LOCALE).filter((v) => v !== LOCALE.DEFAULT);
// DEFAULT가 KO와 동일하므로 중복 제거 후 다시 추가
const SUPPORTED_SET = new Set([LOCALE.DEFAULT, ...SUPPORTED_LOCALES]);

/**
 * 브라우저 언어 설정을 감지하여 지원하는 로케일을 반환합니다.
 *
 * 1. navigator.language ("ko-KR", "en-US" 등)를 먼저 확인
 * 2. navigator.languages 목록을 순회하며 매칭
 * 3. 매칭되는 언어가 없으면 LOCALE.DEFAULT ("ko-KR") 반환
 */
function detectBrowserLocale(): string {
  const candidates = [navigator.language, ...(navigator.languages ?? [])];

  for (const lang of candidates) {
    if (!lang) continue;

    // 정확히 일치 (예: "ko-KR")
    if (SUPPORTED_SET.has(lang)) return lang;

    // 2글자 코드로 매칭 (예: "ko" → "ko-KR")
    const prefix = lang.split("-")[0]?.toLowerCase();
    for (const supported of SUPPORTED_SET) {
      if (supported.split("-")[0]?.toLowerCase() === prefix) {
        return supported;
      }
    }
  }

  return LOCALE.DEFAULT;
}

/**
 * 현재 로케일을 반환합니다.
 * localStorage에 저장된 값이 있으면 우선 사용, 없으면 브라우저 감지 후 저장합니다.
 */
export function getLocale(): string {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && SUPPORTED_SET.has(stored)) return stored;

  const detected = detectBrowserLocale();
  localStorage.setItem(LOCALE_STORAGE_KEY, detected);
  return detected;
}

/**
 * 로케일을 변경하고 localStorage에 저장합니다.
 */
export function setLocale(locale: string): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
