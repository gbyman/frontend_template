"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Z_INDEX } from "@/constants/constants";
import useUiStore from "@/store/ui";

export default function GlobalSpinner() {
  const isLoading = useUiStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <Spin
      indicator={<LoadingOutlined />}
      size="large"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: Z_INDEX.GLOBAL_SPINNER,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    />
  );
}
