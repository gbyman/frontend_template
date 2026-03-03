"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { ReactNode } from "react";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return <AntdRegistry>{children}</AntdRegistry>;
}
