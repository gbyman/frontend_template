# Legacy 프로젝트 분석

> frontend_template 개발 참고용 분석 문서

---

## 기술 스택

| 항목 | 라이브러리 |
|---|---|
| 프레임워크 | React 18 + Vite 6 + TypeScript 5 |
| 상태관리 | Redux Toolkit 2 + redux-persist |
| HTTP | Axios 1.7 |
| 라우팅 | react-router-dom 6 |
| UI | Ant Design 5 + Bootstrap 5 |
| 폼 | Formik |
| 그리드 | AG Grid 30 |
| 차트 | ECharts 5 |
| 에디터 | CKEditor 5 + CodeMirror |
| 마크다운 | marked + dompurify |
| Lint/Format | Biome |

---

## 디렉토리 구조

```
src/
├── App.tsx                   # 루트 앱 (store, 라우팅, 전역 로더)
├── Assets/                   # scss, 폰트, 이미지
├── Layouts/                  # 레이아웃 컴포넌트 (Sidebar, Header, Footer)
├── Routes/
│   ├── index.tsx             # 전체 라우트 정의 (60+ lazy routes)
│   ├── AuthenticatedRoute.tsx
│   └── PublicRoute.tsx
├── common/
│   ├── component/
│   │   ├── atoms/            # 기본 컴포넌트 (Input, Spinner 등)
│   │   ├── Chat/             # SSE 스트리밍 채팅 위젯
│   │   └── widgets/
│   ├── constants/            # 환경변수, 컬러, 아이콘, AI 모델 정보
│   ├── hooks/                # 커스텀 훅
│   └── utils/                # 공통 유틸
├── config/
│   └── env.js                # 런타임 환경변수 브릿지
├── helpers/
│   ├── api_configuration.ts  # Axios 인스턴스 + 인터셉터
│   ├── api_service.ts        # HTTP 추상화 레이어
│   ├── url_helper.ts         # API 엔드포인트 상수
│   └── fakebackend_helper.ts # Named API 호출 래퍼
├── pages/                    # 도메인별 페이지
└── store/                    # Redux store (55+ 슬라이스)
    ├── index.ts              # configureStore
    ├── reducers.ts           # combineReducers + persist
    └── _templates/           # 채팅 슬라이스/썽크 팩토리
```

---

## 주요 아키텍처 패턴

### 1. AI 채팅 팩토리 패턴

15개 이상의 채팅 기능을 2개 파일로 생성. `createChatSlice` + `createDigitalWorksChatThunks` 팩토리 함수로 boilerplate 제거.

```ts
// [Feature]Slice.ts
const allInOneHelperSlice = createChatSlice("AllInOneHelper");
export const { initChatbotText, appendChatbotText } = allInOneHelperSlice.actions;

// [Feature]Thunk.ts
export const { fetchChatbotText, downloadChatDocumentFile }
  = createDigitalWorksChatThunks("AllInOneHelper", "PRODUCTIVITY", sliceActions);
```

채팅 페이지는 config 객체만 전달하면 완성:
```tsx
const chatConfig: ChatConfig = {
  sliceName: "AllInOneHelper",
  fetchThunk: fetchChatbotText,
  placeholder: "...",
  enableFileUpload: true,
  enableVoiceInput: true,
};
return <Chat config={chatConfig} />;
```

**frontend_template 적용:** Zustand store factory 함수 + `useChatStream` 커스텀 훅 패턴으로 대응

---

### 2. SSE 스트리밍 (Fetch API)

Axios가 ReadableStream을 제대로 처리하지 못해 네이티브 `fetch`를 사용.

```ts
postStream: async (url, data, onChunk) => {
  const response = await fetch(url, { method: "POST", body: JSON.stringify(data) });
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(parsedData);
  }
}
```

**frontend_template 적용:** `src/hooks/useSSE.ts`에 `EventSource` 기반으로 구현 완료 ✅

---

### 3. 토큰 갱신 큐 패턴

401 발생 시 요청을 큐에 적재 → 토큰 갱신 → 일괄 재시도. 동시 다발 401 처리에 필수.

```ts
let isRefreshing = false;
const refreshAndRetryQueue: Array<(token: string) => void> = [];

axiosApi.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshToken();
      isRefreshing = false;
      refreshAndRetryQueue.forEach(cb => cb(newToken));
      refreshAndRetryQueue.length = 0;
    }
    return new Promise(resolve => {
      refreshAndRetryQueue.push(token => {
        error.config.headers.Authorization = `Bearer ${token}`;
        resolve(axiosApi(error.config));
      });
    });
  }
});
```

**frontend_template 적용:** `src/lib/axios.ts` 인터셉터에 추가 필요

---

### 4. 런타임 환경변수 주입

Docker 이미지 하나로 dev/staging/prod 모두 사용. nginx가 서빙 시 `window.ENV_CONFIG`를 주입.

```js
// config/env.js
const ENV = {
  API_URL: window.ENV_CONFIG?.API_URL ?? import.meta.env.VITE_API_URL,
};
```

**frontend_template 적용:** Next.js `NEXT_PUBLIC_*` 환경변수 사용. Docker 재사용이 필요하면 동일 패턴 적용 가능.

---

### 5. 서버 주도 메뉴/라우팅

메뉴 구조(경로, 권한, 순서)를 API로 받아 Redux에 저장. 배포 없이 메뉴 변경 가능.

```ts
dispatch(fetchMenuList()); // API에서 메뉴 목록 수신
// Routes/index.tsx에서 urlPaths 기반으로 동적 라우트 생성
```

**frontend_template 적용:** Zustand에 메뉴 상태 저장 + Next.js `middleware.ts`에서 서버사이드 권한 체크

---

### 6. 전역 로딩 (SpinSlice)

Axios 인터셉터에서 직접 Redux dispatch → 모든 API 호출에 자동 로딩 처리.

```ts
export const setupAxiosInterceptors = (store) => {
  axiosApi.interceptors.request.use(config => {
    store.dispatch(apiCallStarted());
    return config;
  });
  axiosApi.interceptors.response.use(response => {
    store.dispatch(apiCallFinished());
    return response;
  });
};
```

**frontend_template 적용:** Zustand UI store에 `isLoading` 상태 추가 + axios 인터셉터 연동

---

### 7. 다국어 처리 (서버 기반)

i18next 없이 서버에서 받은 번역 데이터를 Redux에 저장. `useMultiLanguage()` 훅으로 접근.

```ts
const { mlg } = useMultiLanguage();
return <span>{mlg("MLG0000123", "기본 텍스트")}</span>;
```

**frontend_template 적용:** `next-intl` 사용 또는 Zustand + 서버 번역 데이터 패턴 적용

---

## Biome 설정 참고

```jsonc
{
  "linter": {
    "rules": {
      "noExplicitAny": "warn",
      "noDoubleEquals": "error",
      "noVar": "error",
      "useExhaustiveDependencies": "warn",
      "noDangerouslySetInnerHtml": "off"
    }
  },
  "formatter": {
    "indentWidth": 2,
    "lineWidth": 80,
    "lineEnding": "lf"
  }
}
```

---

## frontend_template 반영 우선순위

| 우선순위 | 항목 | 파일 |
|---|---|---|
| 높음 | 토큰 갱신 큐 패턴 | `src/lib/axios.ts` |
| 높음 | API 엔드포인트 상수 | `src/lib/api-endpoints.ts` |
| 높음 | HTTP 추상화 레이어 | `src/lib/api.ts` |
| 중간 | 전역 로딩 UI 상태 | `src/store/ui.ts` |
| 중간 | 채팅 스트림 훅 | `src/hooks/useChatStream.ts` |
| 낮음 | 서버 주도 메뉴 | `src/store/menu.ts` |
| 낮음 | 다국어 처리 | `src/store/i18n.ts` |
