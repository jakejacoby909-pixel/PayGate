"use client";
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const TransitionContext = createContext({ navigating: false });

export function usePageTransition() {
  return useContext(TransitionContext);
}

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState("idle"); // idle | leaving | entering
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      // Start exit animation
      setPhase("leaving");
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setPhase("entering");
        setPrevPath(pathname);
        const enterTimer = setTimeout(() => setPhase("idle"), 350);
        return () => clearTimeout(enterTimer);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children, prevPath]);

  return (
    <TransitionContext.Provider value={{ navigating: phase !== "idle" }}>
      {/* Top loading bar */}
      {phase !== "idle" && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 9999,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, transparent, #16a34a, #22c55e, #16a34a, transparent)",
            animation: "pageLoadBar 1.2s ease-in-out infinite",
            backgroundSize: "200% 100%",
          }} />
        </div>
      )}

      {/* Page content with fade */}
      <div
        style={{
          opacity: phase === "leaving" ? 0 : 1,
          transform: phase === "leaving" ? "translateY(6px)" : phase === "entering" ? "translateY(0)" : "translateY(0)",
          transition: phase === "leaving"
            ? "opacity 0.15s ease-out, transform 0.15s ease-out"
            : "opacity 0.3s ease-out, transform 0.3s ease-out",
          minHeight: "100vh",
        }}
      >
        {displayChildren}
      </div>
    </TransitionContext.Provider>
  );
}
