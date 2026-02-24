"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Builder from "@/components/Builder";
import { ToastProvider } from "@/components/Toast";
import { getPage } from "@/lib/storage";

function BuilderWithParams() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const existingConfig = editId ? getPage(editId) : null;

  return <Builder existingConfig={existingConfig} />;
}

export default function BuilderPage() {
  return (
    <ToastProvider>
      <Suspense fallback={
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Loading builder...</p>
          </div>
        </div>
      }>
        <BuilderWithParams />
      </Suspense>
    </ToastProvider>
  );
}
