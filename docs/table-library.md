# 테이블 라이브러리 비교

React 프로젝트에서 사용할 수 있는 주요 테이블/그리드 라이브러리를 비교합니다.

---

## 요약

| 라이브러리 | 유형 | 번들 크기 | 라이선스 | 대용량 데이터 | 러닝커브 |
|---|---|---|---|---|---|
| Ant Design Table | UI 컴포넌트 | 포함 (antd) | MIT | 보통 | 낮음 |
| TanStack Table | Headless | ~15KB | MIT | 우수 | 중간 |
| AG Grid | 풀 스택 그리드 | ~300KB+ | MIT / 상용 | 최상 | 높음 |
| MUI DataGrid | UI 컴포넌트 | ~150KB+ | MIT / 상용 | 우수 | 중간 |
| React Data Grid | UI 컴포넌트 | ~100KB | MIT / 상용 | 우수 | 중간 |

---

## 1. Ant Design Table

> 현재 프로젝트에 antd 6이 설치되어 있으므로 **추가 의존성 없이** 바로 사용 가능

**장점**
- 별도 설치 불필요 (antd에 포함)
- 정렬, 필터, 페이징, 선택, 트리 구조 기본 지원
- 디자인 시스템과 통일된 UI
- 한국어 로케일 지원
- 문서와 예제가 풍부

**단점**
- 10,000행 이상 대용량에서 성능 저하 (가상 스크롤은 `virtual` prop으로 제한적 지원)
- 셀 단위 편집 기본 미지원 (직접 구현 필요)
- 엑셀 수준의 복잡한 기능(피벗, 수식, 그룹핑) 없음
- 커스텀 스타일링 시 antd 내부 CSS 오버라이드 필요

**적합한 경우**
- 일반 관리자 페이지 (CRUD 목록, 검색, 페이징)
- 행 수 1,000건 이하의 일반적인 테이블
- antd 디자인 시스템을 그대로 활용하는 프로젝트

```tsx
import { Table } from "antd";

<Table
  columns={columns}
  dataSource={data}
  pagination={{ pageSize: 15 }}
  rowSelection={{ type: "checkbox" }}
/>
```

---

## 2. TanStack Table (v8)

> Headless UI — 로직만 제공하고 렌더링은 직접 구현

**장점**
- 완전한 UI 자유도 (antd, shadcn, 자체 디자인 등 무엇이든 조합 가능)
- 번들 크기가 매우 작음 (~15KB)
- 정렬, 필터, 그룹핑, 피벗, 가상화 등 풍부한 플러그인
- TypeScript 퍼스트 설계
- SSR/RSC 호환

**단점**
- UI를 직접 만들어야 함 → 초기 구현 비용 높음
- 셀 편집, 클립보드 등은 직접 구현해야 함
- headless 개념에 익숙하지 않으면 러닝커브 있음

**적합한 경우**
- 커스텀 디자인이 중요한 프로젝트
- antd Table로 부족하지만 AG Grid까지는 불필요한 중간 규모
- 번들 크기에 민감한 경우

```tsx
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```

---

## 3. AG Grid

> 엔터프라이즈급 풀 스택 데이터 그리드 (lotca_ai_frontend에서 사용 중)

**장점**
- 100,000행 이상도 처리 가능한 성능 (Row Virtualization 내장)
- 셀 편집, 클립보드 복사/붙여넣기, 드래그 앤 드롭 기본 지원
- 그룹핑, 피벗, 트리 데이터, 마스터/디테일 지원
- 엑셀 내보내기 내장 (Enterprise)
- 차트 통합 (Enterprise)

**단점**
- Community 버전은 기본 기능만 제공, 고급 기능은 **유료** (Enterprise ~$1,000+/개발자)
- 번들 크기가 큼 (~300KB+)
- 자체 스타일링이 강해서 antd 디자인과 통합하기 어려움
- 설정이 복잡하고 러닝커브가 높음

**적합한 경우**
- 엑셀 수준의 데이터 조작이 필요한 ERP, 회계, 재무 시스템
- 대용량 데이터 (10,000행 이상) 실시간 처리
- 셀 편집, 피벗, 그룹핑이 핵심 요구사항

```tsx
import { AgGridReact } from "ag-grid-react";

<AgGridReact
  rowData={rowData}
  columnDefs={columnDefs}
  pagination={true}
  paginationPageSize={20}
/>
```

---

## 4. MUI DataGrid

> Material UI 생태계의 데이터 그리드

**장점**
- 정렬, 필터, 페이징, 셀 편집 기본 지원
- 가상 스크롤로 대용량 데이터 처리 가능
- TypeScript 지원 우수
- MUI 디자인 시스템과 완벽한 통합

**단점**
- MUI를 사용하지 않는 프로젝트에서는 부적합 (antd와 혼용 시 디자인 충돌)
- 고급 기능(그룹핑, 트리, 피벗)은 **Pro/Premium 유료** ($200+/개발자/년)
- antd와 함께 쓰면 CSS 충돌 및 디자인 불일치

**적합한 경우**
- MUI 기반 프로젝트
- antd를 사용하지 않는 경우

> **참고**: 현재 프로젝트는 antd 6을 사용하므로 MUI DataGrid 도입 시 디자인 시스템 충돌이 발생합니다.

---

## 5. React Data Grid (Adazzle)

> 엑셀 스타일에 가까운 오픈소스 그리드

**장점**
- 셀 편집, 복사/붙여넣기, 드래그 채우기 등 엑셀 UX
- 가상 스크롤 내장
- 비교적 가벼움 (~100KB)
- MIT 코어 + 유료 확장

**단점**
- 커뮤니티 규모가 작음 (AG Grid, TanStack 대비)
- 문서가 부족한 편
- antd와의 디자인 통합은 직접 구현해야 함
- 트리 데이터, 마스터/디테일 등 고급 기능 제한적

**적합한 경우**
- 엑셀 느낌의 셀 편집이 필요하지만 AG Grid 비용이 부담되는 경우

---

## 채택 가이드

### 일반 관리자 페이지 (CRUD, 검색, 페이징)

```
→ Ant Design Table (추가 설치 없이 바로 사용)
```

관리자 대시보드, 시스템 관리, 사용자 목록 등 일반적인 테이블은 antd Table로 충분합니다. 프로젝트에 이미 antd 6이 설치되어 있으므로 추가 의존성 없이 바로 사용 가능합니다.

### 커스텀 디자인 + 중간 복잡도

```
→ TanStack Table + antd 컴포넌트 조합
```

antd Table의 기본 기능으로 부족하고, UI를 세밀하게 제어하고 싶을 때 적합합니다. TanStack Table의 로직 + antd의 UI 컴포넌트를 조합하면 유연하게 구현 가능합니다.

### 대용량 + 엑셀 수준 기능

```
→ AG Grid
```

10,000행 이상의 대용량 데이터, 셀 편집, 피벗, 그룹핑 등 엑셀에 가까운 기능이 필요하면 AG Grid가 적합합니다. 단, 유료 라이선스 비용과 번들 크기를 고려해야 합니다.
