import type { AuditInfo, PageRequest } from "@/types/api";

// ---------------------------------------------------------------------------
// 요청 타입
// ---------------------------------------------------------------------------

/** 다국어 상세 요청 */
export interface MlgDetailReqDto {
  /** 언어 구분값 (ISO 639-1, 예: ko, en) */
  langDivVal: string;
  /** 언어 내용 (최대 500자) */
  langContent: string;
  /** 비고 (최대 500자) */
  remarkContent?: string | null;
}

/** 다국어 그룹 등록 요청 */
export interface MlgGroupCreateReqDto {
  /** 사용 여부 */
  useYn: boolean;
  /** 비고 (최대 500자) */
  remarkContent?: string | null;
  /** 다국어 상세 목록 (1개 이상 필수) */
  details: MlgDetailReqDto[];
}

/** 다국어 그룹 수정 요청 */
export interface MlgGroupUpdateReqDto {
  /** 사용 여부 */
  useYn: boolean;
  /** 비고 (최대 500자) */
  remarkContent?: string | null;
  /** 다국어 상세 목록 (1개 이상 필수) */
  details: MlgDetailReqDto[];
}

/** 다국어 그룹 목록 검색 조건 */
export interface MlgGroupSearchCond extends PageRequest {
  /** 다국어 코드값 (부분 검색) */
  mlgCodeVal?: string;
  /** 언어 구분값 (예: ko, en) */
  langDivVal?: string;
  /** 언어 내용 (부분 검색) */
  langContent?: string;
  /** 사용 여부 */
  useYn?: boolean;
  /** 페이징 여부 (false 시 전체 조회) */
  pagingYn?: boolean;
}

// ---------------------------------------------------------------------------
// 응답 타입
// ---------------------------------------------------------------------------

/** 다국어 상세 응답 */
export interface MlgDetailRespDto extends AuditInfo {
  /** 다국어 상세 ID */
  mlgDetailId: number;
  /** 다국어 코드값 */
  mlgCodeVal: string;
  /** 언어 구분값 */
  langDivVal: string;
  /** 언어 내용 */
  langContent: string;
  /** 비고 */
  remarkContent: string | null;
}

/** 다국어 그룹 상세 응답 */
export interface MlgGroupRespDto extends AuditInfo {
  /** 다국어 코드값 */
  mlgCodeVal: string;
  /** 사용 여부 */
  useYn: boolean;
  /** 비고 */
  remarkContent: string | null;
  /** 다국어 상세 목록 */
  details: MlgDetailRespDto[];
}

/** 다국어 목록 페이징 응답 (그룹+상세 flatten) */
export interface MlgPagingRespDto extends AuditInfo {
  /** 다국어 상세 ID */
  mlgDetailId: number;
  /** 다국어 코드값 */
  mlgCodeVal: string;
  /** 언어 구분값 */
  langDivVal: string;
  /** 언어 내용 */
  langContent: string;
  /** 사용 여부 */
  useYn: boolean;
  /** 비고 (그룹) */
  groupRemarkContent: string | null;
  /** 비고 (상세) */
  detailRemarkContent: string | null;
}

/** 다국어 번들 응답 (code → 번역 텍스트 맵) */
export type MlgBundleRespDto = Record<string, string>;
