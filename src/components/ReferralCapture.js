"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function ReferralCaptureInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("paygate_ref", ref);
    }
  }, [searchParams]);

  return null;
}

export default function ReferralCapture() {
  return (
    <Suspense fallback={null}>
      <ReferralCaptureInner />
    </Suspense>
  );
}
