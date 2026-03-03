# 코드 컨벤션

React 19 + Next.js 16 + TypeScript 기반 프로젝트의 코드 작성 규칙입니다.

---

## 1. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 파일/폴더 | `camelCase` 또는 `PascalCase` (컴포넌트) | `mlg.api.ts`, `GlobalSpinner.tsx` |
| 변수/함수 | `camelCase` | `getLocale`, `formatDate` |
| 상수 | `SCREAMING_SNAKE_CASE` | `STORAGE_KEYS`, `HTTP` |
| 타입/인터페이스 | `PascalCase` + 용도 접미사 | `MlgGroupReqDto`, `BizRespVo` |
| 컴포넌트 | `PascalCase` | `QueryProvider`, `GlobalSpinner` |
| 커스텀 훅 | `use` 접두사 + `camelCase` | `useSSE`, `useRouteGuard` |
| Query Key | `{feature}QueryKeys` | `mlgQueryKeys` |
| API 객체 | `{feature}Api` | `mlgApi` |

### 기능별 파일 네이밍

```
features/{feature}/
├── {feature}.api.ts           # API 함수
├── {feature}.hooks.ts         # Query/Mutation 훅
├── {feature}.query-keys.ts    # TanStack Query key factory
├── {feature}.types.ts         # 요청/응답 타입
└── components/                # 기능 전용 UI 컴포넌트
```

---

## 2. 프로젝트 구조

| 디렉토리 | 역할 | 원칙 |
|---|---|---|
| `app/` | Next.js 라우팅 진입점 | 렌더링만, 비즈니스 로직 X |
| `assets/` | 정적 리소스 | 이미지(`images/`), 전역 CSS(`styles/`) |
| `features/` | 기능별 모듈 (co-location) | API, 훅, 타입, 컴포넌트를 한 폴더에 |
| `components/` | 전역 공통 컴포넌트 | 2개 이상 기능에서 재사용하는 것만 |
| `hooks/` | 전역 공통 훅 | 2개 이상 기능에서 재사용하는 것만 |
| `store/` | Zustand 전역 상태 | 인증, UI 등 앱 전반 상태만 |
| `types/` | 전역 공통 타입 | `BizRespVo` 등 공유 타입만 |
| `utils/` | 유틸리티 함수 | 순수 함수, 훅이 아닌 것 |
| `lib/` | 외부 라이브러리 설정 | axios, query-client 등 |
| `constants/` | 전역 상수 | ROUTES, HTTP, LOCALE 등 |

> 기능 전용 타입과 API는 반드시 `features/` 안에 둔다. `types/`와 `store/`는 전역 공유 파일만 넣는다.

---

## 3. 컴포넌트 컨벤션

### `"use client"` 디렉티브

```tsx
// 필요한 경우에만 선언
// - useState, useEffect 등 훅 사용 시
// - onClick, onChange 등 이벤트 핸들러 사용 시
// - 브라우저 API (localStorage, window) 접근 시
"use client";
```

Server Component가 기본이므로, 위 조건에 해당하지 않으면 `"use client"` 생략한다.

### export 방식

```tsx
// 페이지 컴포넌트, Provider — export default
export default function MlgPage() { ... }

// 훅, 유틸, API, 타입 — named export
export function useSSE<T>() { ... }
export const mlgApi = { ... };
```

### Props 타입

```tsx
// interface로 정의하고 컴포넌트 바로 위에 배치
interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

export default function UserCard({ name, email, onEdit }: UserCardProps) {
  return ...;
}
```

---

## 4. React 19 훅 가이드

React 19에서 추가된 훅과 패턴입니다. 새 기능 구현 시 적극 활용을 권장합니다.

### `use()` — Promise/Context 읽기

```tsx
import { use, Suspense } from "react";

// Promise를 직접 읽는다 (Suspense 필수)
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return <div>{user.name}</div>;
}

// 사용 시 Suspense로 감싸기
<Suspense fallback={<Loading />}>
  <UserProfile userPromise={fetchUser(id)} />
</Suspense>

// Context도 use()로 읽을 수 있다
function ThemeButton() {
  const theme = use(ThemeContext);
  return <button style={{ color: theme.primary }}>Click</button>;
}
```

### `useActionState()` — 폼 액션 상태 관리

```tsx
import { useActionState } from "react";

// 서버 사이드 폼 처리나 단순 폼에 적합
// 복잡한 폼 검증이 필요하면 React Hook Form + Zod 사용
function LoginForm() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const result = await login(formData);
      if (!result.success) return { error: result.message };
      redirect("/dashboard");
    },
    { error: null }
  );

  return (
    <form action={submitAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      {state.error && <p>{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
```

### `useFormStatus()` — 폼 제출 상태 (자식 컴포넌트 전용)

```tsx
import { useFormStatus } from "react-dom";

// 반드시 <form> 하위 컴포넌트에서 사용해야 한다
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? "처리 중..." : "저장"}
    </button>
  );
}

// 사용
<form action={submitAction}>
  <SubmitButton />
</form>
```

### `useOptimistic()` — 낙관적 업데이트

```tsx
import { useOptimistic } from "react";

// TanStack Query의 onMutate 낙관적 업데이트와 용도가 겹치므로
// API 연동 시에는 TanStack Query 패턴을, 로컬 UI 상태에는 useOptimistic 사용
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  async function handleAdd(formData: FormData) {
    const newTodo = { id: crypto.randomUUID(), title: formData.get("title") as string };
    addOptimistic(newTodo);
    await createTodo(newTodo); // 실패 시 자동 롤백
  }

  return ...;
}
```

### `ref` prop 직접 전달 — forwardRef 불필요

```tsx
// React 19부터 forwardRef 없이 ref를 props로 직접 받을 수 있다
interface InputProps {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

function CustomInput({ label, ref }: InputProps) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
}

// 사용
const inputRef = useRef<HTMLInputElement>(null);
<CustomInput label="이름" ref={inputRef} />
```

### React Hook Form + Zod vs React 19 폼 액션 사용 구분

| 상황 | 권장 |
|---|---|
| 복잡한 폼 검증 (실시간 에러, 다단계 폼) | React Hook Form + Zod |
| 단순 폼 제출 (로그인, 검색) | `useActionState` + `<form action>` |
| 서버 컴포넌트에서 폼 처리 | `useActionState` + Server Action |

---

## 5. 상태 관리 컨벤션

### 서버 상태 — TanStack Query

```tsx
// Query key factory 패턴 (features/{feature}/{feature}.query-keys.ts)
export const userQueryKeys = {
  all: ["user"] as const,
  list: (params?: SearchParams) => ["user", "list", params] as const,
  detail: (id: string) => ["user", "detail", id] as const,
} as const;
```

```tsx
// Query/Mutation 훅 (features/{feature}/{feature}.hooks.ts)
// Query 섹션과 Mutation 섹션을 구분선으로 나눈다

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
export const useUserList = (params?: SearchParams) =>
  useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => userApi.getList(params).then((res) => res.data.body),
  });

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------
export const useUserCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};
```

### 클라이언트 상태 — Zustand

```tsx
// store/{storeName}.ts
// devtools 미들웨어를 항상 포함한다
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-store" }
  )
);
```

---

## 6. API 연동 컨벤션

```tsx
// lib/axios.ts의 apiClient만 사용한다 (직접 axios.create() 금지)
import apiClient from "@/lib/axios";

// features/{feature}/{feature}.api.ts
const BASE_URL = "/api/v1/users";

export const userApi = {
  getList: (params?: SearchParams) =>
    apiClient.get<BizRespVo<PageResponse<UserRespDto>>>(BASE_URL, { params }),

  getOne: (id: string) =>
    apiClient.get<BizRespVo<UserRespDto>>(`${BASE_URL}/${id}`),

  create: (data: UserCreateReqDto) =>
    apiClient.post<BizRespVo<void>>(BASE_URL, data),

  update: (id: string, data: UserUpdateReqDto) =>
    apiClient.put<BizRespVo<void>>(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<BizRespVo<void>>(`${BASE_URL}/${id}`),
};
```

- 응답 타입은 항상 `BizRespVo<T>`로 래핑한다
- API 함수에서는 Promise를 반환하고, 데이터 추출(`.data.body`)은 훅에서 한다

---

## 7. TypeScript 컨벤션

### 타입 import

```tsx
// 타입 전용 import에는 import type을 사용한다
import type { MlgGroupReqDto } from "./mlg.types";
import type { ReactNode } from "react";
```

### 타입 정의 위치

| 타입 종류 | 위치 |
|---|---|
| 기능별 요청/응답 DTO | `features/{feature}/{feature}.types.ts` |
| 전역 공통 타입 (`BizRespVo`) | `types/api.ts` |
| 컴포넌트 Props | 같은 파일 내 컴포넌트 위에 |

### any 사용 제한

```tsx
// ❌ any 사용 금지 (biome에서 warn)
const data: any = response;

// ✅ unknown으로 받고 타입 가드 사용
const data: unknown = response;
if (isBizRespVo(data)) { ... }
```

---

## 8. 코드 스타일 (Biome)

프로젝트는 Biome 2로 린팅/포맷팅을 통합 관리합니다.

| 항목 | 설정 |
|---|---|
| 들여쓰기 | 2 spaces |
| 줄 너비 | 100자 |
| 따옴표 | 쌍따옴표 (`"`) |
| 세미콜론 | 항상 사용 |
| 후행 콤마 | ES5 (`es5`) |
| import 정렬 | Biome organizeImports 자동 |

```bash
npm run check    # 린트 + 포맷 자동 수정
npm run lint     # 린트만
npm run format   # 포맷만
```

---

## 9. 테스트 컨벤션

| 항목 | 설정 |
|---|---|
| 프레임워크 | Vitest |
| DOM 환경 | jsdom |
| 컴포넌트 테스트 | Testing Library |
| API 모킹 | MSW (Mock Service Worker) |

### 파일 위치 및 네이밍

```
features/mlg/
├── mlg.api.ts
├── mlg.hooks.ts
├── __tests__/              # 또는 소스 파일 옆에 배치
│   ├── mlg.api.test.ts
│   └── mlg.hooks.test.ts
```

- 파일명: `*.test.ts(x)` 또는 `*.spec.ts(x)`
- 전역 setup: `src/test/setup.ts`

### 실행

```bash
npm run test         # watch 모드
npm run test:run     # 단일 실행
npm run coverage     # 커버리지 리포트
```
