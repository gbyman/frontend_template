# 상태관리 라이브러리 비교

## 상태 종류 구분

상태관리 라이브러리 선택 전에 **어떤 상태**를 관리하느냐를 먼저 구분해야 합니다.

| 종류 | 예시 |
|---|---|
| **서버 상태** | API 응답 데이터, 로딩/에러 상태 |
| **클라이언트 상태** | 로그인 유저 정보, UI 상태, 모달 열림 여부 |

---

## 서버 상태 관리

### TanStack Query (React Query)

백엔드와 통신하는 프로젝트라면 사실상 표준

**장점**
- 캐싱, 자동 리패칭, 중복 요청 제거 자동 처리
- 로딩/에러/성공 상태를 자동으로 관리
- `staleTime`, `gcTime` 등으로 캐시 전략 세밀하게 설정 가능
- Optimistic Update, Infinite Query, Mutation 지원
- Next.js App Router의 서버 컴포넌트와 잘 통합됨

**단점**
- 러닝커브가 약간 있음 (개념 학습 필요)
- 순수 클라이언트 상태 관리는 별도 라이브러리 필요

---

## 클라이언트 상태 관리

### Zustand

현재 가장 인기 있는 경량 라이브러리

**장점**
- 설정이 매우 단순 (boilerplate 거의 없음)
- Redux처럼 무겁지 않고, Context API처럼 리렌더링 문제 없음
- Next.js SSR 환경 지원
- TypeScript 친화적

**단점**
- 규모가 커지면 store 구조 설계를 직접 해야 함
- Redux DevTools 연동은 되지만 Redux만큼 강력하진 않음

---

### Redux Toolkit (RTK)

오랜 기간 검증된 엔터프라이즈 표준

**장점**
- Redux DevTools로 강력한 디버깅
- 대규모 팀 프로젝트에서 구조화된 패턴 강제
- RTK Query로 서버 상태도 함께 관리 가능
- 레퍼런스가 가장 많음

**단점**
- boilerplate가 여전히 많음 (Toolkit으로 줄었지만)
- Next.js App Router와의 통합이 까다로움
- 소/중규모 프로젝트엔 과함

**Redux가 적합한 조건**
- 금융, 의료, 회계 등 상태 변경 이력 추적(감사)이 중요한 시스템
- 10명 이상 여러 팀이 같은 전역 상태를 공유하는 경우
- 타임트래블 디버깅이 필요한 복잡한 UI

| Redux 적합 | Zustand 적합 |
|---|---|
| 은행 뱅킹 앱 | 커머스 쇼핑몰 |
| 병원 EMR 시스템 | 스타트업 SaaS |
| 대형 ERP | 관리자 대시보드 |
| 증권 거래 시스템 | 콘텐츠 플랫폼 |

---

### Jotai / Recoil

원자(atom) 단위 상태관리

**장점**
- 컴포넌트 단위로 필요한 상태만 구독 → 리렌더링 최소화
- 직관적인 API

**단점**
- Recoil은 Meta에서 사실상 관리 중단 상태
- Jotai는 좋지만 Zustand 대비 레퍼런스가 적음

---

## 채택 조합

```
TanStack Query (서버 상태) + Zustand (클라이언트 상태)
```

- API 호출/캐싱 → TanStack Query
- 로그인 유저 정보, 전역 UI 상태 → Zustand
- Next.js + Spring Boot 백엔드 연동 프로젝트에서 현재 가장 널리 쓰이는 패턴
