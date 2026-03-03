import { FILE_SIZE, LOCALE } from "@/constants/constants";

/**
 * 숫자를 천 단위 콤마가 포함된 정수 문자열로 반환
 * ex) 1234567 → "1,234,567"
 */
export const toCommaNumber = (num: number): string => {
  return Math.round(num).toLocaleString(LOCALE.DEFAULT);
};

/**
 * 숫자를 소수점 자릿수와 천 단위 콤마가 포함된 문자열로 반환
 * ex) 1234567.891 → "1,234,567.89"
 */
export const toCommaFloat = (num: number, decimalPlaces = 2): string => {
  if (num === null || num === undefined) return "";
  if (num === 0) return "0";

  const fixed = num.toFixed(decimalPlaces);
  const [intPart, decPart] = fixed.split(".");

  const formattedInt = Number(intPart).toLocaleString(LOCALE.DEFAULT);

  if (!decPart || Number(decPart) === 0) return formattedInt;

  return `${formattedInt}.${decPart}`;
};

/**
 * 숫자를 소수점 n자리에서 반올림하여 반환
 * ex) 3.14159, 2 → 3.14
 */
export const roundTo = (num: number, decimalPlaces = 2): number => {
  const factor = 10 ** decimalPlaces;
  return Math.round(num * factor) / factor;
};

/**
 * 파일 크기를 읽기 좋은 단위 문자열로 반환
 * ex) 1048576 → "1.00 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return FILE_SIZE.ZERO_LABEL;

  const i = Math.floor(Math.log(bytes) / Math.log(FILE_SIZE.BYTES_PER_UNIT));

  return `${parseFloat((bytes / FILE_SIZE.BYTES_PER_UNIT ** i).toFixed(FILE_SIZE.DECIMAL_PLACES))} ${FILE_SIZE.UNITS[i]}`;
};
