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
      <Suspense>
        <BuilderWithParams />
      </Suspense>
    </ToastProvider>
  );
}
