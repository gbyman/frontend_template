import type { MlgGroupSearchCond } from "./mlg.types";

/**
 * 다국어 query key 팩토리
 *
 * 모든 mlg 관련 useQuery / useMutation에서 이 상수를 import해서 사용합니다.
 * key를 한 곳에서 관리하면 invalidate 시 다른 feature에서도 동일하게 참조할 수 있습니다.
 *
 * 계층 구조:
 *   all                        → mlg 전체 (invalidate all 시 사용)
 *   all > list                 → 목록 전체
 *   all > list > params        → 특정 검색 조건의 목록
 *   all > detail               → 상세 전체
 *   all > detail > mlgCodeVal  → 특정 코드의 상세
 *   all > bundle               → 번들 전체
 *   all > bundle > lang        → 특정 언어의 번들
 */
export const mlgQueryKeys = {
  all: ["mlg"] as const,
  list: (params?: MlgGroupSearchCond) => ["mlg", "list", params] as const,
  detail: (mlgCodeVal: string) => ["mlg", "detail", mlgCodeVal] as const,
  bundle: (lang?: string) => ["mlg", "bundle", lang] as const,
} as const;
