import dayjs from "dayjs";
import { DATE_FORMAT } from "@/constants/constants";

/**
 * Date 객체 또는 문자열을 'YYYY-MM-DD' 형식으로 반환
 */
export const formatDate = (date: Date | string | dayjs.Dayjs): string => {
  return dayjs(date).format(DATE_FORMAT.DATE);
};

/**
 * Date 객체 또는 문자열을 'YYYY-MM-DD HH:mm' 형식으로 반환
 */
export const formatDateTime = (date: Date | string | dayjs.Dayjs): string => {
  return dayjs(date).format(DATE_FORMAT.DATETIME);
};

/**
 * Date 객체 배열에서 첫 번째 날짜를 'YYYY-MM-DD' 형식으로 반환
 */
export const dateArrayToString = (dates: Date[]): string => {
  return formatDate(dates[0]);
};

/**
 * 현재 시간을 'HH:mm' 형식으로 반환
 */
export const getCurrentTime = (): string => {
  return dayjs().format(DATE_FORMAT.TIME);
};

/**
 * 두 날짜 사이의 일수 차이 반환
 */
export const getDaysDiff = (start: Date | string, end: Date | string): number => {
  return dayjs(end).diff(dayjs(start), "day");
};

/**
 * 날짜가 유효한지 확인
 */
export const isValidDate = (date: unknown): boolean => {
  return dayjs(date as string).isValid();
};
