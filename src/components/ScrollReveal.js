"use client";
import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  once = true,
  className = "",
  style = {},
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const transforms = {
    "fade-up": { from: "translateY(32px)", to: "translateY(0)" },
    "fade-down": { from: "translateY(-32px)", to: "translateY(0)" },
    "fade-left": { from: "translateX(-32px)", to: "translateX(0)" },
    "fade-right": { from: "translateX(32px)", to: "translateX(0)" },
    "scale": { from: "scale(0.92)", to: "scale(1)" },
    "fade": { from: "none", to: "none" },
  };

  const t = transforms[animation] || transforms["fade-up"];

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? t.to : t.from,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

export function StaggerChildren({ children, baseDelay = 0, stagger = 80, animation = "fade-up", ...rest }) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <ScrollReveal key={i} animation={animation} delay={baseDelay + i * stagger} {...rest}>
              {child}
            </ScrollReveal>
          ))
        : <ScrollReveal animation={animation} delay={baseDelay} {...rest}>{children}</ScrollReveal>
      }
    </>
  );
}
