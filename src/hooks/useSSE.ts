"use client";

import { useEffect, useRef, useState } from "react";

interface SSEOptions {
  onMessage?: (data: string) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  withCredentials?: boolean;
}

interface SSEState<T> {
  data: T | null;
  error: Event | null;
  isConnected: boolean;
}

/**
 * SSE(Server-Sent Events) 커스텀 훅
 *
 * @param url SSE 엔드포인트 URL (null이면 연결 안 함)
 * @param options 이벤트 핸들러 및 옵션
 *
 * @example
 * const { data, isConnected } = useSSE<NotificationEvent>(
 *   "/api/v1/notifications/stream",
 *   { onMessage: (raw) => console.log(raw) }
 * );
 */
export function useSSE<T = unknown>(url: string | null, options: SSEOptions = {}): SSEState<T> {
  const [state, setState] = useState<SSEState<T>>({
    data: null,
    error: null,
    isConnected: false,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!url) return;

    const es = new EventSource(url, {
      withCredentials: optionsRef.current.withCredentials ?? true,
    });
    eventSourceRef.current = es;

    es.onopen = () => {
      setState((prev) => ({ ...prev, isConnected: true, error: null }));
      optionsRef.current.onOpen?.();
    };

    es.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data) as T;
        setState((prev) => ({ ...prev, data: parsed }));
      } catch {
        setState((prev) => ({ ...prev, data: event.data as unknown as T }));
      }
      optionsRef.current.onMessage?.(event.data);
    };

    es.onerror = (error) => {
      setState((prev) => ({ ...prev, isConnected: false, error }));
      optionsRef.current.onError?.(error);
      es.close();
    };

    return () => {
      es.close();
      setState({ data: null, error: null, isConnected: false });
    };
  }, [url]);

  return state;
}
