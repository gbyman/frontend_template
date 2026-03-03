/** 백엔드 공통 응답 래퍼 (BizRespVo<T>) */
export interface BizRespVo<T = unknown> {
  statusCode: string;
  resultCode: number;
  message: string;
  body: T;
  requestId: string;
  timestamp: string;
}

/** 백엔드 에러 응답 body (BizErrorVo) */
export interface BizErrorVo {
  errorCode: string;
  mlgCode: string;
  path: string;
  trace: string | null;
}

/** 리스트 응답 body 래퍼 (GenericListVo<T>) */
export interface GenericListVo<T> {
  list: T[];
}

/** 페이지네이션 응답 body (Spring Page<T>) */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/** 페이지네이션 요청 파라미터 */
export interface PageRequest {
  page: number;
  size: number;
  sort?: SortOrder[];
}

/** 정렬 조건 */
export interface SortOrder {
  column: string;
  direction: "asc" | "desc";
}

/** 등록/수정 공통 메타 정보 */
export interface AuditInfo {
  regUserId: string;
  regDatetime: string;
  updaterId: string;
  updateDatetime: string;
}

/** 파일 정보 */
export interface FileInfo extends AuditInfo {
  fileSeq?: number;
  fileDetailSeq?: number;
  originalFileName?: string;
  savedFileName?: string;
  fileSize?: number;
  filePath?: string;
  fileExtension?: string;
}
