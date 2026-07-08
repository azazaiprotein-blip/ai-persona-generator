"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface RadarAxis {
  label: string;
  value: number; // 0–100
}

interface PersonalityRadarProps {
  axes: RadarAxis[];
  size?: number;
  className?: string;
}

function pointOnCircle(cx: number, cy: number, r: number, angle: number) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

export function PersonalityRadar({
  axes,
  size = 220,
  className,
}: PersonalityRadarProps) {
  const n = axes.length;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 46;
  const abbrev = (s: string) => (s.length > 9 ? `${s.slice(0, 8)}.` : s);
  const gid = `radar-${axes.map((a) => a.label[0]).join("")}-${Math.round(radius)}`;

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const rings = [0.25, 0.5, 0.75, 1];
  const ringPolys = rings.map((ring) =>
    axes
      .map((_, i) => {
        const [x, y] = pointOnCircle(cx, cy, radius * ring, angleFor(i));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" "),
  );

  const valuePoints = axes.map((a, i) => {
    const [x, y] = pointOnCircle(
      cx,
      cy,
      radius * (Math.max(4, a.value) / 100),
      angleFor(i),
    );
    return [x, y] as const;
  });
  const valuePoly = valuePoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("h-auto w-full max-w-[240px]", className)}
      role="img"
      aria-label="Personality radar"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-2)" />
        </linearGradient>
      </defs>

      {/* grid rings */}
      {ringPolys.map((poly, i) => (
        <polygon
          key={i}
          points={poly}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
        />
      ))}

      {/* spokes */}
      {axes.map((_, i) => {
        const [x, y] = pointOnCircle(cx, cy, radius, angleFor(i));
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth={1}
          />
        );
      })}

      {/* value polygon */}
      <motion.polygon
        points={valuePoly}
        fill={`url(#${gid})`}
        fillOpacity={0.22}
        stroke={`url(#${gid})`}
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center" }}
      />

      {/* value dots */}
      {valuePoints.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={3}
          fill="var(--brand)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 + i * 0.05 }}
        />
      ))}

      {/* labels */}
      {axes.map((a, i) => {
        const [x, y] = pointOnCircle(cx, cy, radius + 14, angleFor(i));
        const anchor = Math.abs(x - cx) < 8 ? "middle" : x > cx ? "start" : "end";
        return (
          <text
            key={i}
            x={x}
            y={y}
            dy="0.32em"
            textAnchor={anchor}
            className="fill-muted-foreground text-[9px] font-medium"
          >
            {abbrev(a.label)}
          </text>
        );
      })}
    </svg>
  );
}
