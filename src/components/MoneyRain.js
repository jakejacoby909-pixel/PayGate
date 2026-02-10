"use client";
import { useEffect, useRef } from "react";

export default function MoneyRain({ duration = 4000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    }
    resize();

    const greens = ["#16a34a", "#15803d", "#22c55e", "#065f46", "#4ade80"];
    const golds = ["#d97706", "#b45309", "#f59e0b", "#fbbf24"];
    const allColors = [...greens, ...golds];

    const particles = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const kind = Math.random();
      let type;
      if (kind < 0.4) type = "dollar";
      else if (kind < 0.7) type = "coin";
      else type = "bill";

      particles.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.6,
        color: allColors[Math.floor(Math.random() * allColors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: 1.5 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 0.7 + Math.random() * 0.3,
        decay: 0.003 + Math.random() * 0.003,
        wobble: Math.random() * 8,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobblePhase: Math.random() * Math.PI * 2,
        type,
        size: type === "dollar" ? 14 + Math.random() * 10 : type === "coin" ? 4 + Math.random() * 5 : 1,
        w: 10 + Math.random() * 6,
        h: 6 + Math.random() * 4,
      });
    }

    let frame;
    const start = Date.now();

    function draw() {
      const elapsed = Date.now() - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x += p.vx + Math.sin(p.wobblePhase) * p.wobble * 0.04;
        p.y += p.vy;
        p.vy += 0.03;
        p.rotation += p.rotationSpeed;
        p.wobblePhase += p.wobbleSpeed;

        if (elapsed > duration * 0.5) {
          p.opacity -= p.decay;
        }

        if (p.opacity <= 0) continue;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "dollar") {
          ctx.font = `bold ${p.size}px "Georgia", serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("$", 0, 0);
        } else if (p.type === "coin") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (elapsed < duration) {
        frame = requestAnimationFrame(draw);
      }
    }

    draw();
    return () => cancelAnimationFrame(frame);
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10001,
      }}
    />
  );
}
