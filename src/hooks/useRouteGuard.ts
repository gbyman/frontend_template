"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES, STORAGE_KEYS } from "@/constants/constants";

const PUBLIC_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD];

/**
 * 인증 가드 훅
 * - 로그인 상태가 아니면 /login으로 리다이렉트
 * - 이미 로그인 상태에서 공개 페이지 접근 시 /으로 리다이렉트
 *
 * @param options.redirectTo 미인증 시 이동할 경로 (기본값: "/login")
 * @param options.redirectIfAuthenticated 인증 상태에서 공개 페이지 접근 시 이동할 경로
 */
const useRouteGuard = (options: { redirectTo?: string; redirectIfAuthenticated?: string } = {}) => {
  const { redirectTo = ROUTES.LOGIN, redirectIfAuthenticated = ROUTES.HOME } = options;
  const pathname = usePathname();
  const router = useRouter();

  // 현재는 useEffect 안에서만 localStorage에 접근하므로 실질적 의미는 없음.
  // 추후 useEffect 밖에서 localStorage나 window에 접근하는 코드가 생길 경우를 대비해 남겨둠.
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    const accessToken = isBrowser ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;

    const isPublicPath = (PUBLIC_PATHS as readonly string[]).includes(pathname);

    if (!accessToken && !isPublicPath) {
      router.replace(redirectTo);
      return;
    }

    if (accessToken && isPublicPath) {
      router.replace(redirectIfAuthenticated);
    }
  }, [pathname, redirectTo, redirectIfAuthenticated, router]);
};

export default useRouteGuard;
