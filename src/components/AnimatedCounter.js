"use client";
import { useState, useEffect, useRef } from "react";

export default function AnimatedCounter({ value, duration = 1500, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animateValue();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function animateValue() {
    const numStr = String(value).replace(/[^0-9.]/g, "");
    const target = parseFloat(numStr) || 0;
    const isFloat = numStr.includes(".");
    const decimals = isFloat ? (numStr.split(".")[1] || "").length : 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isFloat) {
        setDisplay(current.toFixed(decimals));
      } else {
        setDisplay(Math.round(current).toLocaleString());
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Set to the original string value to preserve formatting like "10K+"
        setDisplay(value);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}
