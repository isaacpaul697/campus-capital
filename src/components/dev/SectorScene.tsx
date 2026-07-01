/**
 * A bespoke, hand-crafted animated scene for each asset class (and the build-a-
 * property lab), in the spirit of the student-housing "coast to coast" tour: a
 * distinct little world per class rather than one generic building glyph. Every
 * scene is a real depiction of its asset type: multifamily is a cluster of
 * mid-rise towers, single-family is a pitched-roof neighborhood, industrial is a
 * warehouse with a truck backing into the dock, office is a glass tower with a
 * running elevator, retail is a storefront with shoppers on the sidewalk,
 * affordable is homes sheltering a pulsing heart, and "build" is a crane raising
 * a tower floor by floor over a blueprint. Pure CSS (cc-* / cc-scn-* keyframes in
 * globals.css); all motion parks under prefers-reduced-motion. Decorative, so
 * aria-hidden. Coordinates live on a 320 x 210 canvas, ground line at y = 182.
 */

export type SceneVariant =
  | "multifamily"
  | "single-townhome"
  | "industrial"
  | "office"
  | "retail"
  | "affordable"
  | "build";

const GROUND = 182;

/** Even grid of window cells for a rectangular facade. */
function windowGrid(x: number, top: number, w: number, cols: number, rows: number, rowGap = 14) {
  const padX = 8;
  const gapX = (w - padX * 2) / (cols - 1 || 1);
  const cells: { x: number; y: number; i: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: x + padX + c * gapX - 3, y: top + 9 + r * rowGap, i: r * cols + c });
    }
  }
  return cells;
}

/** A rising group anchored to the ground so the structure grows up from y=182. */
function Rise({ cx, delay, children }: { cx: number; delay: number; children: React.ReactNode }) {
  return (
    <g className="cc-abt-rise" style={{ transformOrigin: `${cx}px ${GROUND}px`, animationDelay: `${delay}s` }}>
      {children}
    </g>
  );
}

/* ── Multifamily: a cluster of mid-rise apartment towers ─────────────────── */
function Multifamily({ color }: { color: string }) {
  const towers = [
    { x: 70, w: 50, top: 92, cols: 3, rows: 6, delay: 0.15 },
    { x: 128, w: 64, top: 54, cols: 4, rows: 9, delay: 0 },
    { x: 200, w: 48, top: 104, cols: 3, rows: 5, delay: 0.28 },
  ];
  return (
    <>
      {towers.map((t) => (
        <Rise key={t.x} cx={t.x + t.w / 2} delay={t.delay}>
          <rect x={t.x} y={t.top} width={t.w} height={GROUND - t.top} rx="2" fill={color} />
          <rect x={t.x} y={t.top} width="4" height={GROUND - t.top} fill="rgba(255,255,255,0.14)" />
          {windowGrid(t.x, t.top, t.w, t.cols, t.rows).map((c) => (
            <rect
              key={c.i}
              className="cc-abt-win"
              x={c.x}
              y={c.y}
              width="6"
              height="8"
              rx="1"
              fill="var(--gold-bright)"
              style={{ animationDelay: `${0.9 + c.i * 0.12}s` }}
            />
          ))}
        </Rise>
      ))}
      {/* rooftop beacon on the tallest */}
      <circle className="cc-abt-ping" cx="160" cy="54" r="4" fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="160" cy="54" r="2.4" fill="var(--gold-bright)" />
    </>
  );
}

/* ── Single-family & townhome: a little pitched-roof neighborhood ────────── */
function House({ x, w, h, color, delay }: { x: number; w: number; h: number; color: string; delay: number }) {
  const top = GROUND - h;
  const apex = top - w * 0.42;
  const cx = x + w / 2;
  return (
    <Rise cx={cx} delay={delay}>
      <rect x={x} y={top} width={w} height={h} rx="1.5" fill={color} />
      <path d={`M${x - 4} ${top} L${cx} ${apex} L${x + w + 4} ${top} Z`} fill={color} />
      <path d={`M${x - 4} ${top} L${cx} ${apex} L${x + w + 4} ${top} Z`} fill="rgba(255,255,255,0.16)" />
      {/* two warm windows + a door */}
      <rect className="cc-abt-win" x={x + w * 0.16} y={top + 8} width="8" height="9" rx="1" fill="var(--gold-bright)" style={{ animationDelay: `${1 + delay}s` }} />
      <rect className="cc-abt-win" x={x + w * 0.58} y={top + 8} width="8" height="9" rx="1" fill="var(--gold-bright)" style={{ animationDelay: `${1.3 + delay}s` }} />
      <rect x={cx - 4} y={GROUND - 14} width="8" height="14" rx="1" fill="rgba(0,0,0,0.22)" />
    </Rise>
  );
}

function SingleTownhome({ color }: { color: string }) {
  return (
    <>
      {/* sun, gently bobbing */}
      <g className="cc-abt-hero">
        <circle cx="266" cy="52" r="14" fill="var(--gold-bright)" opacity="0.9" />
        <circle className="cc-abt-ping" cx="266" cy="52" r="14" fill="none" stroke="var(--gold)" strokeWidth="1.2" />
      </g>
      <House x={34} w={42} h={34} color={color} delay={0.05} />
      <House x={104} w={54} h={46} color={color} delay={0.18} />
      <House x={186} w={40} h={32} color={color} delay={0.32} />
      {/* a small tree for the street */}
      <g>
        <rect x="240" y="150" width="5" height={GROUND - 150} fill="var(--ink-soft)" opacity="0.5" />
        <circle cx="242.5" cy="146" r="16" fill={color} opacity="0.28" />
        <circle cx="242.5" cy="146" r="16" fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" />
      </g>
    </>
  );
}

/* ── Industrial: a warehouse with a truck backing into the dock ──────────── */
function Industrial({ color }: { color: string }) {
  const bx = 96, bw = 200, btop = 108;
  return (
    <>
      <Rise cx={bx + bw / 2} delay={0}>
        <rect x={bx} y={btop} width={bw} height={GROUND - btop} rx="2" fill={color} />
        {/* sawtooth roof */}
        <path
          d={`M${bx} ${btop} ${Array.from({ length: 5 }, (_, i) => {
            const sx = bx + i * (bw / 5);
            const sw = bw / 5;
            return `L${sx} ${btop - 16} L${sx + sw} ${btop}`;
          }).join(" ")} Z`}
          fill={color}
          opacity="0.85"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={bx + i * (bw / 5)} y1={btop - 16} x2={bx + i * (bw / 5) + bw / 5} y2={btop} stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" />
        ))}
        {/* loading dock doors */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={bx + 16 + i * 46} y={GROUND - 34} width="34" height="34" rx="1.5" fill="rgba(0,0,0,0.22)" />
        ))}
      </Rise>
      {/* delivery truck driving to the dock */}
      <g className="cc-scn-truck">
        <rect x="18" y="150" width="44" height="24" rx="2" fill="var(--surface)" stroke={color} strokeWidth="1.6" />
        <rect x="62" y="156" width="20" height="18" rx="2" fill={color} />
        <rect x="66" y="159" width="10" height="8" rx="1" fill="rgba(255,255,255,0.6)" />
        <circle cx="32" cy="176" r="5" fill="var(--ink)" />
        <circle cx="54" cy="176" r="5" fill="var(--ink)" />
        <circle cx="72" cy="176" r="5" fill="var(--ink)" />
      </g>
    </>
  );
}

/* ── Office: a glass tower with a running elevator ───────────────────────── */
function Office({ color }: { color: string }) {
  const x = 116, w = 88, top = 42;
  return (
    <>
      <Rise cx={x + w / 2} delay={0}>
        <rect x={x} y={top} width={w} height={GROUND - top} rx="2" fill={color} />
        {/* dense curtain-wall grid */}
        {windowGrid(x, top, w, 5, 10, 13).map((c) => (
          <rect
            key={c.i}
            className="cc-abt-win"
            x={c.x}
            y={c.y}
            width="7"
            height="8"
            rx="0.5"
            fill="var(--gold-bright)"
            style={{ animationDelay: `${0.9 + (c.i % 7) * 0.16}s` }}
          />
        ))}
        {/* elevator shaft + running car */}
        <rect x={x + w / 2 - 4} y={top + 10} width="8" height={GROUND - top - 16} rx="1" fill="rgba(0,0,0,0.28)" />
        <rect className="cc-scn-lift" x={x + w / 2 - 3} y={GROUND - 22} width="6" height="12" rx="1" fill="var(--gold-bright)" />
        {/* rooftop antenna */}
        <line x1={x + w / 2} y1={top} x2={x + w / 2} y2={top - 14} stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle className="cc-abt-ping" cx={x + w / 2} cy={top - 14} r="4" fill="none" stroke={color} strokeWidth="1.4" />
        <circle cx={x + w / 2} cy={top - 14} r="2.2" fill="var(--gold-bright)" />
      </Rise>
    </>
  );
}

/* ── Retail: a storefront strip with awnings and shoppers ────────────────── */
function Retail({ color }: { color: string }) {
  const x = 44, w = 232, top = 108;
  const stripes = 8;
  return (
    <>
      <Rise cx={x + w / 2} delay={0}>
        <rect x={x} y={top} width={w} height={GROUND - top} rx="2" fill={color} />
        {/* shopfront glass */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} className="cc-abt-win" x={x + 14 + i * 56} y={top + 24} width="40" height={GROUND - top - 30} rx="1.5" fill="var(--gold-bright)" style={{ animationDelay: `${1 + i * 0.25}s` }} />
        ))}
        {/* scalloped striped awning */}
        <g>
          {Array.from({ length: stripes }, (_, i) => (
            <path
              key={i}
              d={`M${x + i * (w / stripes)} ${top} L${x + (i + 1) * (w / stripes)} ${top} L${x + (i + 1) * (w / stripes)} ${top + 14} Q${x + (i + 0.5) * (w / stripes)} ${top + 20} ${x + i * (w / stripes)} ${top + 14} Z`}
              fill={i % 2 === 0 ? color : "var(--surface)"}
              stroke={color}
              strokeWidth="1"
            />
          ))}
        </g>
        {/* OPEN sign */}
        <rect x={x + w / 2 - 16} y={top - 22} width="32" height="15" rx="2" fill="var(--surface)" stroke={color} strokeWidth="1.4" />
        <circle className="cc-abt-win" cx={x + w / 2} cy={top - 14.5} r="3.2" fill="var(--good)" style={{ animationDelay: "0.4s" }} />
      </Rise>
      {/* shoppers strolling the sidewalk */}
      {[0, 2.4, 4.1].map((d, i) => (
        <g key={i} className="cc-scn-walk" style={{ animationDelay: `${d}s` }}>
          <circle cx="30" cy="168" r="4" fill={color} />
          <rect x="27" y="171" width="6" height="11" rx="2.5" fill={color} opacity="0.8" />
        </g>
      ))}
    </>
  );
}

/* ── Affordable: homes sheltering a pulsing heart ────────────────────────── */
function heartPath(cx: number, cy: number, s: number) {
  return `M${cx} ${cy + s * 0.85} C${cx - s * 1.1} ${cy - s * 0.2} ${cx - s * 0.55} ${cy - s} ${cx} ${cy - s * 0.35} C${cx + s * 0.55} ${cy - s} ${cx + s * 1.1} ${cy - s * 0.2} ${cx} ${cy + s * 0.85} Z`;
}
function Affordable({ color }: { color: string }) {
  return (
    <>
      {/* the heart at the crown */}
      <g className="cc-abt-hero">
        <circle className="cc-abt-ping" cx="160" cy="52" r="18" fill="none" stroke={color} strokeWidth="1.4" />
        <path d={heartPath(160, 50, 18)} fill={color} />
        <path d={heartPath(160, 50, 18)} fill="rgba(255,255,255,0.12)" />
      </g>
      <House x={44} w={46} h={40} color={color} delay={0.1} />
      <House x={130} w={60} h={52} color={color} delay={0} />
      <House x={224} w={44} h={38} color={color} delay={0.22} />
    </>
  );
}

/* ── Build: a crane raising a tower floor by floor over a blueprint ──────── */
function Build({ color }: { color: string }) {
  const x = 92, w = 84, top = 78;
  const floors = 5;
  const fh = (GROUND - top) / floors;
  return (
    <>
      {/* faint blueprint grid behind the site */}
      <g opacity="0.5">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`v${i}`} x1={40 + i * 40} y1="30" x2={40 + i * 40} y2={GROUND} stroke={color} strokeWidth="0.6" opacity="0.28" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="30" y1={40 + i * 34} x2="300" y2={40 + i * 34} stroke={color} strokeWidth="0.6" opacity="0.28" />
        ))}
      </g>
      {/* stacked floors rising in sequence */}
      {Array.from({ length: floors }, (_, i) => {
        const fy = GROUND - (i + 1) * fh;
        return (
          <g key={i} className="cc-abt-rise" style={{ transformOrigin: `${x + w / 2}px ${GROUND}px`, animationDelay: `${i * 0.22}s` }}>
            <rect x={x} y={fy} width={w} height={fh - 2} rx="1.5" fill={color} opacity={0.55 + i * 0.09} />
            {[0, 1, 2, 3].map((c) => (
              <rect key={c} className="cc-abt-win" x={x + 10 + c * 18} y={fy + 5} width="8" height={fh - 12} rx="1" fill="var(--gold-bright)" style={{ animationDelay: `${1 + (i * 4 + c) * 0.1}s` }} />
            ))}
          </g>
        );
      })}
      {/* tower crane: mast, jib, cable, and a hoisted beam that bobs */}
      <g stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none">
        <line x1="212" y1={GROUND} x2="212" y2="46" />
        <line x1="212" y1="46" x2="120" y2="46" />
        <line x1="212" y1="46" x2="244" y2="46" />
        <line x1="212" y1="52" x2="150" y2="46" strokeWidth="1.4" />
        <line x1="212" y1="52" x2="238" y2="46" strokeWidth="1.4" />
      </g>
      <g className="cc-scn-hoist">
        <line x1="150" y1="46" x2="150" y2="96" stroke={color} strokeWidth="1.4" />
        <rect x="136" y="96" width="28" height="10" rx="1.5" fill="var(--gold)" />
      </g>
      {/* counterweight */}
      <rect x="238" y="44" width="10" height="12" rx="1.5" fill={color} />
    </>
  );
}

const SCENES: Record<SceneVariant, (p: { color: string }) => React.ReactNode> = {
  multifamily: Multifamily,
  "single-townhome": SingleTownhome,
  industrial: Industrial,
  office: Office,
  retail: Retail,
  affordable: Affordable,
  build: Build,
};

export function SectorScene({ variant, color }: { variant: SceneVariant; color: string }) {
  const Scene = SCENES[variant] ?? Multifamily;
  return (
    <svg viewBox="0 0 320 210" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={`scn-glow-${variant}`} cx="52%" cy="34%" r="62%">
          <stop offset="0" stopColor={color} stopOpacity="0.2" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="320" height="210" fill={`url(#scn-glow-${variant})`} />

      {/* twinkling sparkles in the surrounding air */}
      {[
        { x: 40, y: 48, r: 4.5, d: 0.2 },
        { x: 286, y: 40, r: 5, d: 0.9 },
        { x: 300, y: 96, r: 3.5, d: 1.4 },
        { x: 22, y: 100, r: 3.5, d: 1.1 },
      ].map((s, i) => (
        <path
          key={i}
          className="cc-campus-spark"
          style={{ animationDelay: `${s.d}s` }}
          d={`M${s.x} ${s.y - s.r} L${s.x + s.r * 0.3} ${s.y - s.r * 0.3} L${s.x + s.r} ${s.y} L${s.x + s.r * 0.3} ${s.y + s.r * 0.3} L${s.x} ${s.y + s.r} L${s.x - s.r * 0.3} ${s.y + s.r * 0.3} L${s.x - s.r} ${s.y} L${s.x - s.r * 0.3} ${s.y - s.r * 0.3} Z`}
          fill={color}
        />
      ))}

      {/* ground shadow + baseline */}
      <ellipse cx="160" cy={GROUND + 8} rx="140" ry="12" fill="var(--ink)" opacity="0.07" />
      <line x1="18" y1={GROUND} x2="302" y2={GROUND} stroke="var(--line-strong)" strokeWidth="1.4" />

      <Scene color={color} />
    </svg>
  );
}
