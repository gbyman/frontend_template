import apiClient from "@/lib/axios";
import type { BizRespVo, PageResponse } from "@/types/api";
import type {
  MlgBundleRespDto,
  MlgGroupCreateReqDto,
  MlgGroupRespDto,
  MlgGroupSearchCond,
  MlgGroupUpdateReqDto,
  MlgPagingRespDto,
} from "./mlg.types";

const BASE_URL = "/api/v1/system/mlg";
const BUNDLE_URL = "/api/v1/i18n/messages";

export const mlgApi = {
  /**
   * 다국어 그룹 목록 페이징 조회
   * GET /api/v1/system/mlg
   */
  getList: (params?: MlgGroupSearchCond) =>
    apiClient.get<BizRespVo<PageResponse<MlgPagingRespDto>>>(BASE_URL, { params }),

  /**
   * 다국어 그룹 상세 조회
   * GET /api/v1/system/mlg/{mlgCodeVal}
   */
  getOne: (mlgCodeVal: string) =>
    apiClient.get<BizRespVo<MlgGroupRespDto>>(`${BASE_URL}/${mlgCodeVal}`),

  /**
   * 다국어 그룹 등록
   * POST /api/v1/system/mlg
   */
  create: (data: MlgGroupCreateReqDto) =>
    apiClient.post<BizRespVo<MlgGroupRespDto>>(BASE_URL, data),

  /**
   * 다국어 그룹 수정
   * PUT /api/v1/system/mlg/{mlgCodeVal}
   */
  update: (mlgCodeVal: string, data: MlgGroupUpdateReqDto) =>
    apiClient.put<BizRespVo<MlgGroupRespDto>>(`${BASE_URL}/${mlgCodeVal}`, data),

  /**
   * 다국어 그룹 삭제
   * DELETE /api/v1/system/mlg/{mlgCodeVal}
   */
  delete: (mlgCodeVal: string) => apiClient.delete<BizRespVo<void>>(`${BASE_URL}/${mlgCodeVal}`),

  /**
   * 다국어 번들 조회 (F/E 언어 전환용)
   * GET /api/v1/i18n/messages
   * @param lang ISO 639-1 언어 코드 (미지정 시 서버에서 Accept-Language 헤더 기반 결정)
   */
  getBundle: (lang?: string) =>
    apiClient.get<BizRespVo<MlgBundleRespDto>>(BUNDLE_URL, {
      params: lang ? { lang } : undefined,
    }),
};
