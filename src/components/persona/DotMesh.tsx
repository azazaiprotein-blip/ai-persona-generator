"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Constellation backdrop — slow-drifting dots that draw links to their
 * neighbours as they pass, like research signals connecting. Pure canvas:
 * white dots, brand-green links. Renders a single static frame when the
 * visitor prefers reduced motion.
 */
export function DotMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const LINK = 130; // px distance under which two dots connect

    type Dot = { x: number; y: number; vx: number; vy: number; r: number };
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    function seed() {
      const count = Math.min(90, Math.max(28, Math.round((w * h) / 16000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.5,
      }));
    }

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (dots.length === 0) seed();
      // resizing wipes the bitmap — repaint immediately so the static
      // (reduced-motion) frame doesn't stay blank until the next rAF
      draw();
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        // wrap around the edges so the field never empties
        if (d.x < -24) d.x = w + 24;
        else if (d.x > w + 24) d.x = -24;
        if (d.y < -24) d.y = h + 24;
        else if (d.y > h + 24) d.y = -24;
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < LINK * LINK) {
            const closeness = 1 - Math.sqrt(dist2) / LINK;
            ctx.strokeStyle = `rgba(114, 205, 0, ${0.22 * closeness})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      for (const d of dots) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}
