"use client";

/**
 * Real Estate Intelligence master mark. `variant` selects the glyph while the
 * gold gradient tile stays constant. All glyphs are solid shapes (not thin line
 * art) so the mark stays crisp and confident down to ~24px.
 *   1 rising skyline (skyline + upward analytics chart)
 *   2 flagship setback tower
 *   3 serif monogram "R"
 *   4 skyline with a rising trend line
 *   5 property pin sheltering a building
 */
export type LogoVariant = 1 | 2 | 3 | 4 | 5;

function Glyph({ variant }: { variant: LogoVariant }) {
  // Warm cutout color for punched windows, matching the gold tile.
  const cut = "var(--gold-deep)";
  switch (variant) {
    case 2:
      return (
        <>
          <rect x="34" y="50" width="32" height="38" rx="2" fill="white" />
          <rect x="39" y="34" width="22" height="18" fill="white" />
          <rect x="44" y="22" width="12" height="14" fill="white" />
          <line x1="50" y1="22" x2="50" y2="12" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
          <circle cx="50" cy="8.5" r="4" fill="white" />
          {[56, 68].map((y) =>
            [40, 48, 56].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="6" rx="1" fill={cut} />),
          )}
        </>
      );
    case 3:
      return (
        <text x="50" y="74" fontFamily="Georgia, 'Times New Roman', serif" fontSize="72" fontWeight="700" fill="white" textAnchor="middle">
          R
        </text>
      );
    case 4:
      return (
        <>
          <rect x="20" y="60" width="13" height="26" rx="1.5" fill="white" fillOpacity="0.5" />
          <rect x="36" y="60" width="13" height="26" rx="1.5" fill="white" fillOpacity="0.5" />
          <rect x="52" y="60" width="13" height="26" rx="1.5" fill="white" fillOpacity="0.5" />
          <rect x="68" y="60" width="11" height="26" rx="1.5" fill="white" fillOpacity="0.5" />
          <polyline points="22,74 40,64 58,48 78,28" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="78" cy="28" r="5.2" fill="white" />
          <rect x="17" y="86" width="66" height="4" rx="2" fill="white" />
        </>
      );
    case 5:
      return (
        <>
          <path fill="white" d="M50 12 C34 12 22 24 22 40 C22 60 50 88 50 88 C50 88 78 60 78 40 C78 24 66 12 50 12 Z" />
          <path fill={cut} d="M39 50 V36 L50 28 L61 36 V50 Z" />
          <rect x="46" y="42" width="8" height="8" fill="white" />
        </>
      );
    case 1:
    default:
      return (
        <>
          <rect x="22" y="52" width="17" height="34" rx="2.5" fill="white" fillOpacity="0.78" />
          <rect x="42" y="38" width="17" height="48" rx="2.5" fill="white" fillOpacity="0.9" />
          <rect x="62" y="24" width="17" height="62" rx="2.5" fill="white" />
          <line x1="70.5" y1="24" x2="70.5" y2="15" stroke="white" strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="70.5" cy="11" r="4.2" fill="white" />
          <rect x="17" y="86" width="66" height="5" rx="2.5" fill="white" />
        </>
      );
  }
}

export function LogoMark({ size = 40, variant = 2 }: { size?: number; variant?: LogoVariant }) {
  return (
    <span
      className="inline-grid place-items-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "linear-gradient(150deg, var(--gold-bright), var(--gold-deep))",
        boxShadow: "0 1px 3px rgba(0,0,0,.12)",
      }}
    >
      <svg viewBox="0 0 100 100" width={size * 0.62} height={size * 0.62} xmlns="http://www.w3.org/2000/svg">
        <Glyph variant={variant} />
      </svg>
    </span>
  );
}
