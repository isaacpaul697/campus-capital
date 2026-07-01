"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UNIVERSITIES } from "@/lib/universities";
import { NATION_W, NATION_H, STATE_PATHS, projectLngLat } from "@/lib/nationShape";

/**
 * "Coast to coast" campus tour, in the spirit of a conference's national TV
 * spot: the camera sweeps across a real US map and each campus pops up in turn,
 * rendered as a building tinted its true brand color with its city and
 * conference. A selector switches the tour between athletic conferences (Big
 * Ten, Big 12, SEC, Ivy League, and so on) or every tracked school at once, so
 * the whole roster is reachable. Everything is real: the outline is bundled
 * Census state geometry and every campus uses its genuine coordinates and brand
 * color from the university dataset. No mascots or logos are invented. The map
 * is the continental US, so Alaska and Hawaii campuses are omitted. Auto-
 * advances on a timer, pauses on hover, honors prefers-reduced-motion.
 */

interface Stop {
  id: string;
  name: string;
  shortName: string;
  abbr: string;
  city: string;
  state: string;
  conference: string;
  color: string;
  x: number;
  y: number;
}

const ALL_KEY = "__all";
const STEP_MS = 2600;

// Continental campuses only (the map has no AK/HI insets), projected once.
const CONTINENTAL = UNIVERSITIES.filter((u) => u.state !== "AK" && u.state !== "HI");
const ALL_STOPS: Stop[] = CONTINENTAL.map((u) => {
  const { x, y } = projectLngLat(u.lng, u.lat);
  return {
    id: u.id,
    name: u.name,
    shortName: u.shortName,
    abbr: u.abbr,
    city: u.city,
    state: u.state,
    conference: u.conference,
    color: u.brandColor,
    x,
    y,
  };
});

// Conferences with at least two continental schools, most-represented first,
// so the selector leads with the majors and each option makes a real tour.
const CONFERENCES = (() => {
  const counts = new Map<string, number>();
  for (const u of CONTINENTAL) counts.set(u.conference, (counts.get(u.conference) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, n]) => ({ name, n }));
})();

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A small campus hall, drawn centered on (0,0) at its base, tinted `color`. */
function Building({ color, popKey }: { color: string; popKey: string }) {
  return (
    <g key={popKey} className="cc-bt-pop" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
      <ellipse cx="0" cy="1.5" rx="16" ry="3.2" fill="rgba(0,0,0,0.16)" />
      <rect x="-13" y="-24" width="26" height="24" rx="1.5" fill={color} />
      <path d="M-16 -24 L0 -34 L16 -24 Z" fill={color} />
      <path d="M-16 -24 L0 -34 L16 -24 Z" fill="rgba(255,255,255,0.14)" />
      {[-9, -4.5, 0, 4.5, 9].map((cx) => (
        <rect key={cx} x={cx - 1.1} y="-22" width="2.2" height="18" rx="0.6" fill="rgba(255,255,255,0.55)" />
      ))}
      <rect x="-15" y="-5" width="30" height="4" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect x="-2.2" y="-11" width="4.4" height="7" rx="0.6" fill="rgba(0,0,0,0.22)" />
    </g>
  );
}

export function CampusTour() {
  const [conf, setConf] = useState("Big Ten");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  // Filtered, west-to-east so the tour reads as one coast-to-coast pass.
  const stops = useMemo(() => {
    const list = conf === ALL_KEY ? ALL_STOPS : ALL_STOPS.filter((s) => s.conference === conf);
    return [...list].sort((a, b) => a.x - b.x);
  }, [conf]);

  // Restart the sweep whenever the conference changes.
  useEffect(() => {
    setActive(0);
  }, [conf]);

  useEffect(() => {
    if (paused || reduced.current || stops.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % stops.length), STEP_MS);
    return () => clearInterval(t);
  }, [paused, stops.length]);

  const idx = Math.min(active, stops.length - 1);
  const cur = stops[idx];

  const route = useMemo(() => stops.map((s, i) => `${i === 0 ? "M" : "L"}${s.x} ${s.y}`).join(" "), [stops]);

  const camera = useMemo(() => {
    if (!cur) return "none";
    const zoom = 1.85;
    const tx = NATION_W / 2 - zoom * cur.x;
    const ty = NATION_H / 2 - zoom * cur.y;
    return `translate(${tx}px, ${ty}px) scale(${zoom})`;
  }, [cur]);

  if (!cur) return null;

  const title = conf === ALL_KEY ? "Every market we track" : `${conf} markets we track`;

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(700px 300px at 50% -20%, var(--gold-soft) 0%, transparent 65%)" }}
      />

      <div className="relative" style={{ aspectRatio: `${NATION_W} / ${NATION_H}` }}>
        <svg viewBox={`0 0 ${NATION_W} ${NATION_H}`} className="w-full h-full" aria-hidden preserveAspectRatio="xMidYMid meet">
          <g style={{ transform: camera, transition: reduced.current ? "none" : "transform 1.25s cubic-bezier(.6,.15,.2,1)", transformOrigin: "0 0" }}>
            {STATE_PATHS.map((s) => (
              <path key={s.name} d={s.d} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            ))}

            <path
              d={route}
              fill="none"
              stroke="var(--gold-deep)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3 5"
              vectorEffect="non-scaling-stroke"
              opacity={0.7}
            />

            {stops.map((s, i) => (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r={i === idx ? 3.4 : 2.4}
                fill={s.color}
                stroke="var(--surface)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                opacity={i === idx ? 1 : 0.55}
              />
            ))}

            <circle className="cc-bt-ring" cx={cur.x} cy={cur.y} r={5} fill="none" stroke={cur.color} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <g transform={`translate(${cur.x} ${cur.y}) scale(0.5)`}>
              <Building color={cur.color} popKey={cur.id} />
            </g>
          </g>
        </svg>

        {/* heading */}
        <div className="absolute top-4 left-4 md:top-5 md:left-6 pr-3">
          <div className="text-[10.5px] font-semibold uppercase tracking-[1.6px] text-gold-deep">Coast to coast</div>
          <div className="font-display text-[18px] md:text-[22px] font-semibold text-ink leading-tight mt-0.5">{title}</div>
        </div>

        {/* conference selector */}
        <div className="absolute top-4 right-4 md:top-5 md:right-6">
          <div className="relative">
            <select
              aria-label="Choose a conference to tour"
              value={conf}
              onChange={(e) => setConf(e.target.value)}
              className="appearance-none text-[12px] font-semibold text-ink bg-surface/95 backdrop-blur-sm border border-line rounded-full pl-3.5 pr-8 h-9 cursor-pointer hover:border-line-strong focus:outline-none focus:border-gold shadow-[var(--shadow)]"
            >
              <option value={ALL_KEY}>All conferences ({ALL_STOPS.length})</option>
              {CONFERENCES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.n})
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" width={14} height={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* active-school card */}
        <div key={cur.id} className="cc-bt-card absolute bottom-5 left-4 right-4 md:left-6 md:right-auto md:w-[340px] rounded-[var(--radius-card)] border border-line bg-surface/95 backdrop-blur-sm shadow-[var(--shadow-lg)] p-4 flex items-center gap-3">
          <span
            className="grid place-items-center rounded-[12px] shrink-0 font-display font-bold text-white text-[13px] tracking-tight"
            style={{ background: cur.color, width: 46, height: 46 }}
          >
            {cur.abbr}
          </span>
          <div className="min-w-0">
            <div className="font-display text-[16px] font-semibold text-ink leading-tight truncate">{cur.shortName}</div>
            <div className="text-[12px] text-ink-soft truncate">{cur.city}, {cur.state}</div>
            <div className="text-[11px] text-muted-2 mt-0.5">{cur.conference} · {idx + 1} of {stops.length}</div>
          </div>
        </div>

        {/* progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-line/50">
          <div className="h-full transition-all duration-500" style={{ width: `${((idx + 1) / stops.length) * 100}%`, background: cur.color }} />
        </div>
      </div>
    </div>
  );
}
