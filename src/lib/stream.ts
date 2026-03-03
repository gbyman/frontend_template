import config from "@/config";
import { HTTP, ROUTES, STORAGE_KEYS } from "@/constants/constants";
import { getLocale } from "@/utils/locale";

// ---------------------------------------------------------------------------
// Types
// stream.ts 내부에서만 사용하는 옵션 타입으로, co-location 원칙에 따라
// types/api.ts(백엔드 DTO)와 분리하여 사용처에 함께 정의합니다.
// 여러 모듈에서 공유가 필요해지면 그때 types/로 분리를 검토합니다.
// ---------------------------------------------------------------------------

/** 스트림 요청 공통 옵션 */
export type StreamOptions = {
  /** 요청 취소용 AbortSignal */
  signal?: AbortSignal;
  /** 추가 헤더 */
  headers?: Record<string, string>;
  /** SSE 형식(data: prefix) 파싱 여부 (기본값: true) */
  parseSSE?: boolean;
};

/** POST 스트림 요청 옵션 */
export type PostStreamOptions = StreamOptions & {
  /** Content-Type 오버라이드 (FormData 사용 시 자동 설정됨) */
  contentType?: string;
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** 인증 헤더를 포함한 공통 헤더 생성 */
function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Accept-Language": getLocale(),
    ...extra,
  };

  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/** 401 Unauthorized 처리 */
function handleUnauthorized(): never {
  // TODO: POST /api/v1/auth/refresh 로 토큰 재발급 시도 (백엔드 구현 후 추가)
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  window.location.href = ROUTES.LOGIN;
  throw new Error("Unauthorized");
}

/** Response 검증 후 ReadableStream Reader 반환 */
async function getStreamReader(
  response: Response
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  if (response.status === HTTP.STATUS_UNAUTHORIZED) {
    handleUnauthorized();
  }

  if (!response.ok) {
    throw new Error(`Stream request failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("ReadableStream not supported");
  }

  return response.body.getReader();
}

/**
 * ReadableStream에서 데이터를 읽어 SSE 형식으로 파싱
 *
 * SSE 형식 예시:
 *   data: {"content": "Hello"}
 *   data: {"content": " World"}
 *   data: [DONE]
 */
async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onData: (chunk: unknown) => void,
  options: { signal?: AbortSignal; parseSSE?: boolean } = {}
): Promise<void> {
  const { signal, parseSSE = true } = options;
  const decoder = new TextDecoder();
  let buffer = "";

  while (!signal?.aborted) {
    const { done, value } = await reader.read();
    if (done || signal?.aborted) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      if (parseSSE && line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;

        try {
          onData(JSON.parse(data));
        } catch {
          onData(data);
        }
      } else if (!parseSSE) {
        onData(line);
      }
    }
  }

  if (buffer.trim()) onData(buffer.trim());

  if (signal?.aborted) {
    await reader.cancel();
    throw new DOMException("Aborted", "AbortError");
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * POST 스트림 요청
 *
 * fetch + ReadableStream 기반으로 SSE 형식의 스트림 데이터를 수신합니다.
 * JSON, FormData 모두 지원하며 AbortController로 요청 취소가 가능합니다.
 *
 * @example
 * const controller = new AbortController();
 *
 * await postStream(
 *   "/api/v1/chat",
 *   { message: "hello" },
 *   (chunk) => console.log(chunk),
 *   { signal: controller.signal },
 * );
 *
 * // 취소 시
 * controller.abort();
 */
export async function postStream(
  url: string,
  body: unknown,
  onData: (chunk: unknown) => void,
  options: PostStreamOptions = {}
): Promise<void> {
  const { signal, contentType, parseSSE = true, headers: extraHeaders } = options;

  const isFormData = body instanceof FormData;
  const headers = buildHeaders({
    ...(!isFormData && {
      "Content-Type": contentType ?? "application/json",
    }),
    ...extraHeaders,
  });

  const response = await fetch(`${config.api.baseUrl}${url}`, {
    method: "POST",
    headers,
    body: isFormData ? (body as FormData) : JSON.stringify(body),
    signal,
  });

  const reader = await getStreamReader(response);
  await processStream(reader, onData, { signal, parseSSE });
}

/**
 * GET 스트림 요청
 *
 * @example
 * await getStream(
 *   "/api/v1/events",
 *   { type: "notification" },
 *   (chunk) => console.log(chunk),
 * );
 */
export async function getStream(
  url: string,
  params: Record<string, string> | undefined,
  onData: (chunk: unknown) => void,
  options: StreamOptions = {}
): Promise<void> {
  const { signal, parseSSE = true, headers: extraHeaders } = options;

  let fullUrl = `${config.api.baseUrl}${url}`;
  if (params) {
    fullUrl += `?${new URLSearchParams(params).toString()}`;
  }

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: buildHeaders(extraHeaders),
    signal,
  });

  const reader = await getStreamReader(response);
  await processStream(reader, onData, { signal, parseSSE });
}
