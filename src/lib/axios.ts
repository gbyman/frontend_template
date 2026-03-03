import axios from "axios";
import config from "@/config";
import { HTTP, ROUTES, STORAGE_KEYS } from "@/constants/constants";
import { getLocale } from "@/utils/locale";

const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": HTTP.CONTENT_TYPE_JSON,
  },
  withCredentials: true, // Refresh Token 쿠키 전송
});

// 요청 인터셉터: Access Token 헤더 주입
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = getLocale();

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리 / 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === HTTP.STATUS_UNAUTHORIZED) {
      // TODO: POST /api/v1/auth/refresh 로 토큰 재발급 시도 (백엔드 구현 후 추가)
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
