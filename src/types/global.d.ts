// 미디어 파일 직접 import 시 TypeScript 타입 선언
// next/image 컴포넌트 방식을 사용하는 경우에는 불필요하지만,
// SVG를 React 컴포넌트로 import하거나 이미지를 URL string으로 import할 때 필요

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
