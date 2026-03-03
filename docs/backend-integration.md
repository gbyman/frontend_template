# 백엔드 연동 가이드

`backend_template` 기준으로 `frontend_template`과의 연동 방법을 정리한 문서입니다.

---

## 1. 인증 방식

### JWT Bearer Token (Stateless)

| 항목 | 내용 |
|---|---|
| Access Token | `Authorization: Bearer {token}` 헤더로 전송, 만료 30분 |
| Refresh Token | HttpOnly 쿠키 (`templateRefresh`)로 자동 전송, 만료 7일 |
| withCredentials | `true` 필수 (쿠키 포함 요청) |

### 토큰 흐름

```
1. POST /api/v1/auth/login → Access Token 수신 → localStorage 저장
2. 이후 모든 요청: Authorization: Bearer {accessToken} 헤더 자동 주입 (axios 인터셉터)
3. 401 응답 시: POST /api/v1/auth/refresh (Refresh Token 쿠키 자동 포함) → 새 Access Token 수신
4. Refresh 실패 시: /login 리다이렉트
```

---

## 2. 공통 응답 포맷

백엔드는 모든 응답을 `BizRespVo<T>` 구조로 반환합니다.

### 성공 응답

```json
{
  "statusCode": "OK",
  "resultCode": 200,
  "message": "OK",
  "body": { },
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-01 12:34:56"
}
```

| resultCode | statusCode | 의미 |
|---|---|---|
| 200 | `OK` | 조회/수정/삭제 성공 |
| 201 | `CREATED` | 등록 성공 |
| 400 | `BAD_REQUEST` | 요청 데이터 오류 |
| 401 | `UNAUTHORIZED` | 인증 만료 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 오류 |

### 에러 응답

```json
{
  "statusCode": "BAD_REQUEST",
  "resultCode": 400,
  "message": "details: 다국어 상세 목록은 필수입니다",
  "body": {
    "errorCode": "ERROR_02",
    "mlgCode": "MLG_ERR02",
    "path": "/api/v1/system/mlg",
    "trace": null
  },
  "requestId": "...",
  "timestamp": "..."
}
```

### 리스트 응답 (`body` 구조)

```json
{ "list": [ ... ] }
```

### 페이징 응답 (`body` 구조, Spring Page)

```json
{
  "content": [ ... ],
  "totalElements": 100,
  "totalPages": 7,
  "number": 0,
  "size": 15
}
```

---

## 3. 구현된 API 목록

### 3-1. 다국어 그룹 관리

Base URL: `/api/v1/system/mlg`

| 메서드 | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/api/v1/system/mlg` | 다국어 그룹 페이징 목록 | 필요 |
| GET | `/api/v1/system/mlg/{mlgCodeVal}` | 다국어 그룹 상세 | 필요 |
| POST | `/api/v1/system/mlg` | 다국어 그룹 등록 | 필요 |
| PUT | `/api/v1/system/mlg/{mlgCodeVal}` | 다국어 그룹 수정 | 필요 |
| DELETE | `/api/v1/system/mlg/{mlgCodeVal}` | 다국어 그룹 삭제 | 필요 |

**목록 조회 Query Params**

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `mlgCodeVal` | string | 다국어 코드 (부분 검색) |
| `langDivVal` | string | 언어 구분 (예: `ko`, `en`) |
| `langContent` | string | 번역 내용 (부분 검색) |
| `useYn` | boolean | 사용 여부 |
| `pagingYn` | boolean | 페이징 여부 (`false` 시 전체 조회) |
| `page` | number | 페이지 번호 (0부터 시작) |
| `size` | number | 페이지 크기 |
| `sort` | string | 정렬 (예: `regDatetime,desc`) |

**등록/수정 요청 Body**

```json
{
  "useYn": true,
  "remarkContent": "비고 내용 (최대 500자)",
  "details": [
    { "langDivVal": "ko", "langContent": "저장", "remarkContent": null },
    { "langDivVal": "en", "langContent": "Save", "remarkContent": null }
  ]
}
```

---

### 3-2. 다국어 번들 조회

| 메서드 | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/api/v1/i18n/messages` | 언어 번들 전체 조회 | 필요 |

**Query Params**

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `lang` | string | 언어 코드 (없으면 `Accept-Language` 헤더 기반) |

**응답 예시**

```json
{
  "statusCode": "OK",
  "resultCode": 200,
  "message": "OK",
  "body": {
    "MLG0000001": "저장",
    "MLG0000002": "취소"
  }
}
```

---

### 3-3. 시스템 상태

| 메서드 | URL | 설명 | 인증 |
|---|---|---|---|
| GET | `/api/health` | 헬스체크 | 불필요 |
| GET | `/api/env` | 서버 환경 정보 | 불필요 |

---

### 3-4. 인증 (미구현 — 백엔드 작업 필요)

> JWT 인프라(JwtService, TokenProvider)는 구현되어 있으나 컨트롤러 미구현

| 메서드 | URL | 설명 |
|---|---|---|
| POST | `/api/v1/auth/login` | 로그인 → Access Token 반환 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| POST | `/api/v1/auth/refresh` | Access Token 재발급 |

---

## 4. 프론트엔드 연동 구조

기능별로 관련 파일을 `features/` 폴더에 co-location합니다.
`app/`은 라우팅 진입점으로만 사용하고, 실제 로직은 `features/` 안에 둡니다.

```
src/
├── app/                              # Next.js 라우팅 진입점만
│   ├── (admin)/
│   │   └── system/
│   │       └── mlg/page.tsx          # features/mlg 불러서 렌더링만
│   └── login/page.tsx
├── features/                         # 기능별 co-location
│   ├── mlg/
│   │   ├── components/               # 다국어 관련 UI 컴포넌트
│   │   ├── hooks/                    # useQuery / useMutation 훅
│   │   ├── mlg.api.ts                # 다국어 CRUD API 함수
│   │   └── mlg.types.ts              # 다국어 요청/응답 타입
│   └── auth/                         # 인증 (백엔드 구현 후 추가)
│       ├── api.ts
│       └── types.ts
├── types/
│   └── api.ts                        # BizRespVo 등 전역 공통 타입
└── lib/
    └── axios.ts                      # apiClient (토큰 인터셉터 포함)
```

---

## 5. 작업 현황

| 항목 | 상태 | 비고 |
|---|---|---|
| axios 기본 설정 | 완료 | `lib/axios.ts` |
| 공통 응답 타입 (`BizRespVo`) | 완료 | `types/api.ts` |
| Access Token 헤더 주입 인터셉터 | 완료 | `lib/axios.ts` |
| 다국어 타입 정의 | 완료 | `features/mlg/mlg.types.ts` |
| 다국어 API 함수 | 완료 | `features/mlg/mlg.api.ts` |
| 인증 API 함수 | 미완료 | 백엔드 컨트롤러 구현 후 `features/auth/` 추가 |
| 로그인 페이지 | 미완료 | `app/login/page.tsx` 추가 필요 |
| 다국어 관리 페이지 | 미완료 | `app/(admin)/system/mlg/page.tsx` 추가 필요 |
