# Frontend Template

Next.js 기반 프론트엔드 프로젝트 템플릿입니다.

## 기술 스택

| 분류 | 라이브러리 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| UI | Ant Design 6 |
| 상태 관리 | Zustand 5 |
| 서버 상태 | TanStack Query 5 |
| HTTP 클라이언트 | Axios |
| 폼 검증 | React Hook Form + Zod |
| 폰트 | Noto Sans KR (@fontsource) |
| 날짜 | Day.js |
| 유틸리티 | Lodash, UUID |
| Linter/Formatter | Biome 2 |
| 테스트 | Vitest + Testing Library + MSW |
| Git 훅 | Husky + commitlint + lint-staged |

## 시작하기

### 의존성 설치

```bash
npm install
```

### 환경변수 설정

환경별 `.env` 파일을 복사하여 사용합니다.

```bash
cp .env.dev .env.local      # 개발
cp .env.stg .env.local      # 스테이징
cp .env.prod .env.local     # 운영
```

### 개발 서버 실행

```bash
npm run dev
```

## 스크립트

```bash
npm run dev           # 개발 서버 실행
npm run build         # 빌드 (기본 .env)
npm run build:dev     # 빌드 (.env.dev 적용)
npm run build:stg     # 빌드 (.env.stg 적용)
npm run build:prod    # 빌드 (.env.prod 적용)
npm run start         # 프로덕션 서버 실행
npm run lint          # 린트 검사
npm run format        # 코드 포맷
npm run check         # 린트 + 포맷 자동 수정
npm run test          # 테스트 (watch 모드)
npm run test:run      # 테스트 (단일 실행)
npm run coverage      # 커버리지 리포트
```

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router — 라우팅 진입점만 담당
│   ├── (admin)/                # 인증 필요 레이아웃 그룹
│   │   └── system/
│   │       └── mlg/page.tsx    # features/mlg 불러서 렌더링만
│   └── login/page.tsx
├── assets/                     # 정적 리소스 (이미지, 스타일)
│   ├── images/                 # 프로젝트 이미지 (로고, 에러 일러스트 등)
│   │   ├── project/            # 로고, 브랜드 이미지
│   │   └── error/              # 에러 페이지 일러스트
│   └── styles/                 # 전역 CSS
│       ├── variables.css       # 디자인 토큰 (색상, 타이포, 간격, 그림자)
│       └── reset.css           # 브라우저 리셋 + 베이스 스타일
├── features/                        # 기능별 모듈 — 관련 파일을 한 폴더에 co-location
│   └── {feature}/                   # 기능 단위 폴더 (예: mlg, auth, user ...)
│       ├── components/              # 해당 기능 전용 UI 컴포넌트
│       ├── {feature}.api.ts         # API 함수 (apiClient 호출)
│       ├── {feature}.hooks.ts       # useQuery / useMutation 훅 (Query / Mutation 섹션으로 구분)
│       ├── {feature}.query-keys.ts  # TanStack Query key 상수
│       └── {feature}.types.ts       # 요청/응답 타입 정의
├── components/                 # 전역 공통 컴포넌트 (여러 기능에서 재사용)
├── config/                     # 환경변수 및 앱 설정
│   ├── env.ts                  # 런타임 환경변수 accessor
│   └── index.ts                # 타입이 있는 config 객체
├── constants/
│   └── constants.ts            # 전역 상수 (ROUTES, HTTP, DATE_FORMAT 등)
├── hooks/                      # 전역 공통 훅 (여러 기능에서 재사용)
├── lib/                        # 외부 라이브러리 설정
│   ├── axios.ts                # apiClient (토큰 인터셉터 포함)
│   └── query-client.ts         # TanStack Query 설정
├── providers/                  # React Context Provider
├── store/                      # Zustand 전역 상태 (인증, UI 등 앱 전반 상태만)
│   ├── index.ts                # useAuthStore
│   └── ui.ts                   # useUiStore (로딩 등)
└── types/                      # 전역 공통 타입
    └── api.ts                  # BizRespVo, PageResponse 등 백엔드 공통 응답 타입
```

### 새 기능 추가 시 체크리스트

1. `src/features/{feature}/` 폴더 생성
2. `{feature}.types.ts` — 요청/응답 타입 정의
3. `{feature}.api.ts` — API 함수 작성 (`mlgApi` 패턴 참고)
4. `{feature}.query-keys.ts` — query key 상수 정의 (`mlgQueryKeys` 패턴 참고)
5. `{feature}.hooks.ts` — `useQuery` / `useMutation` 훅 작성
6. `components/` — UI 컴포넌트 작성
7. `src/app/` — 라우팅 진입점 페이지 추가 (렌더링만)

> 기능별 타입과 API는 `features/` 안에 둡니다. `types/api.ts`와 `store/`는 여러 기능에서 공유하는 전역 파일만 넣습니다.

## 배포

### 파일 배포 방식

환경별 빌드 후 `.next/standalone` 결과물을 서버에 전달합니다.

```bash
npm run build:prod
```

### Docker 배포 방식

단일 이미지로 빌드하고 환경변수를 컨테이너 실행 시 주입합니다.

```bash
docker build -t frontend .
docker run -e NEXT_PUBLIC_API_BASE_URL=https://api.example.com -p 3000:3000 frontend
```

런타임 환경변수는 `docker/docker-entrypoint.sh`에서 `public/env-config.js`로 주입됩니다.

## 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정, 패키지 업데이트
ci: CI/CD 설정 변경
revert: 커밋 되돌리기
```
