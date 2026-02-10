"use client";
import Builder from "@/components/Builder";
import { ToastProvider } from "@/components/Toast";

export default function BuilderPage() {
  return (
    <ToastProvider>
      <Builder />
    </ToastProvider>
  );
}
