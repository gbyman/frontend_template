/**
 * 비밀번호 강도 검사
 * 8~16자, 공백 없음, 영문/숫자/특수문자 각 1개 이상 포함
 */
export const isStrongPassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\-/])[^\s]{8,16}$/;
  return regex.test(password);
};

import { VALIDATION } from "@/constants/constants";

/**
 * 사용자명 유효성 검사
 * 1~10자, 공백 없음
 */
export const isValidUsername = (name: string): boolean => {
  return (
    name.length >= VALIDATION.USERNAME_MIN_LENGTH &&
    name.length <= VALIDATION.USERNAME_MAX_LENGTH &&
    !/\s/.test(name)
  );
};

/**
 * 이메일 유효성 검사
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * 전화번호 유효성 검사 (한국 형식: 010-0000-0000 또는 01000000000)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const regex = /^(01[016789])[-]?(\d{3,4})[-]?(\d{4})$/;
  return regex.test(phone);
};

/**
 * URL 유효성 검사
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
