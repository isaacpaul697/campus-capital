"use client";

/**
 * The About-page hero visual: a small, warmly-lit architectural scene rather
 * than a generic chart. A tiered hero tower rises from a soft skyline, its
 * windows glowing and twinkling, a beacon pulsing at the crown, framed by a
 * warm radial wash and a couple of quiet neighbor buildings for depth. It reads
 * as "real estate," which is the subject of the whole site. Decorative, so it
 * is aria-hidden; all motion is disabled under prefers-reduced-motion via the
 * shared media query in globals.css. Coordinates are on a 340 x 280 canvas.
 */

const GROUND = 232;

// Window grid for a tier: evenly spaced lit panes with staggered twinkle.
function windows(x: number, w: number, top: number, cols: number, rows: number) {
  const padX = 10;
  const gapX = (w - padX * 2) / (cols - 1 || 1);
  const cells: { x: number; y: number; delay: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: x + padX + c * gapX - 3.2,
        y: top + 14 + r * 16,
        delay: (r * cols + c) * 0.18,
      });
    }
  }
  return cells;
}

const HERO_WINS = [
  ...windows(146, 48, 78, 3, 2),
  ...windows(132, 76, 110, 4, 2),
  ...windows(120, 100, 150, 5, 4),
];

export function AboutHeroVisual() {
  return (
    <svg viewBox="0 0 340 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id="ab-glow" cx="52%" cy="30%" r="62%">
          <stop offset="0" stopColor="var(--gold)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ab-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--ink-soft)" />
          <stop offset="1" stopColor="var(--ink)" />
        </linearGradient>
        <linearGradient id="ab-crown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-bright)" />
          <stop offset="1" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="340" height="280" fill="url(#ab-glow)" />

      {/* soft ground shadow + baseline */}
      <ellipse cx="172" cy={GROUND + 8} rx="150" ry="13" fill="var(--ink)" opacity="0.07" />
      <line x1="18" y1={GROUND} x2="322" y2={GROUND} stroke="var(--line-strong)" strokeWidth="1.4" />

      {/* quiet neighbor buildings for depth */}
      <g opacity="0.5">
        <rect className="cc-abt-rise" style={{ transformOrigin: `44px ${GROUND}px`, animationDelay: "0.05s" }} x="30" y="176" width="30" height={GROUND - 176} rx="1.5" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1" />
        <rect className="cc-abt-rise" style={{ transformOrigin: `78px ${GROUND}px`, animationDelay: "0.12s" }} x="62" y="150" width="40" height={GROUND - 150} rx="1.5" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1" />
      </g>
      <g opacity="0.55">
        <rect className="cc-abt-rise" style={{ transformOrigin: `246px ${GROUND}px`, animationDelay: "0.16s" }} x="222" y="138" width="48" height={GROUND - 138} rx="1.5" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1" />
        <rect className="cc-abt-rise" style={{ transformOrigin: `292px ${GROUND}px`, animationDelay: "0.09s" }} x="276" y="172" width="34" height={GROUND - 172} rx="1.5" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth="1" />
      </g>

      {/* the hero tower: three setback tiers rising from the baseline */}
      <g className="cc-abt-hero">
        <g className="cc-abt-rise" style={{ transformOrigin: `170px ${GROUND}px` }}>
          <rect x="120" y="150" width="100" height={GROUND - 150} rx="2" fill="url(#ab-tower)" />
          <rect x="132" y="110" width="76" height="42" rx="2" fill="url(#ab-tower)" />
          <rect x="146" y="78" width="48" height="34" rx="2" fill="url(#ab-tower)" />
          {/* warm side-light seam down the tower */}
          <rect x="120" y="150" width="5" height={GROUND - 150} fill="var(--gold)" opacity="0.14" />
          {/* crown + beacon */}
          <rect x="162" y="66" width="16" height="14" rx="1.5" fill="url(#ab-crown)" />
          <line x1="170" y1="66" x2="170" y2="54" stroke="var(--gold-deep)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* lit, twinkling windows */}
        {HERO_WINS.map((c, i) => (
          <rect
            key={i}
            className="cc-abt-win"
            x={c.x}
            y={c.y}
            width="6.4"
            height="9"
            rx="1"
            fill="var(--gold-bright)"
            style={{ animationDelay: `${0.8 + c.delay}s` }}
          />
        ))}

        {/* pulsing beacon at the crown */}
        <circle className="cc-abt-ping" cx="170" cy="52" r="5" fill="none" stroke="var(--gold)" strokeWidth="1.4" />
        <circle cx="170" cy="52" r="3" fill="var(--gold-bright)" />
      </g>

      {/* twinkling sparkles in the surrounding air */}
      {[
        { x: 40, y: 60, r: 4.5, d: 0.2 },
        { x: 300, y: 74, r: 5, d: 0.9 },
        { x: 286, y: 40, r: 3.5, d: 1.4 },
        { x: 58, y: 96, r: 3.5, d: 1.1 },
      ].map((s, i) => (
        <path
          key={`s${i}`}
          className="cc-campus-spark"
          style={{ animationDelay: `${s.d}s` }}
          d={`M${s.x} ${s.y - s.r} L${s.x + s.r * 0.3} ${s.y - s.r * 0.3} L${s.x + s.r} ${s.y} L${s.x + s.r * 0.3} ${s.y + s.r * 0.3} L${s.x} ${s.y + s.r} L${s.x - s.r * 0.3} ${s.y + s.r * 0.3} L${s.x - s.r} ${s.y} L${s.x - s.r * 0.3} ${s.y - s.r * 0.3} Z`}
          fill="var(--gold)"
        />
      ))}
    </svg>
  );
}
