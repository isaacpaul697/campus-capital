"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { LogoMark } from "./LogoMark";

/**
 * The transition played when a link is clicked from *within* the About page.
 * The About page is a static overview, so leaving it should feel like plotting
 * a course to a live workspace. This overlay is a "transfer / route" graphic: a
 * gold route line draws itself across a faint blueprint grid, a data packet
 * travels along it from a pulsing origin node, and a map pin drops onto the
 * destination, labelled with wherever the click is headed.
 *
 * It is intentionally distinct from the drafting-elevation overlay that plays
 * when *entering* About, and from the building-construction launcher on the hub,
 * so every destination keeps its own feel. Rendered through a portal to
 * document.body so it sits above all page chrome. Honors reduced-motion by
 * letting the click navigate straight through with no overlay.
 */

const HOLD_MS = 1500;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAboutLinkTransition() {
  const router = useRouter();
  const [dest, setDest] = useState<{ href: string; label: string } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const launch = useCallback(
    (e: React.MouseEvent, href: string, label: string) => {
      // Let modified clicks (new tab) and reduced-motion users behave normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (prefersReducedMotion()) return;
      e.preventDefault();
      router.prefetch(href);
      setDest({ href, label });
      setLeaving(false);
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [
        window.setTimeout(() => router.push(href), HOLD_MS - 300),
        window.setTimeout(() => setLeaving(true), HOLD_MS - 60),
        window.setTimeout(() => {
          setDest(null);
          setLeaving(false);
        }, HOLD_MS + 240),
      ];
    },
    [router],
  );

  const overlay =
    dest && typeof document !== "undefined"
      ? createPortal(<AboutLinkOverlay label={dest.label} leaving={leaving} />, document.body)
      : null;

  return { launch, overlay };
}

/** Full-screen "plotting a route" scene: a packet travels a drawn line to a pin. */
export function AboutLinkOverlay({ label, leaving }: { label: string; leaving: boolean }) {
  return (
    <div
      className={`cc-xfer-overlay fixed inset-0 z-[2000] grid place-items-center text-center transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "color-mix(in srgb, var(--bg) 86%, transparent)", backdropFilter: "blur(7px)" }}
      role="status"
      aria-live="polite"
      aria-label={`Opening ${label}`}
    >
      <div className="flex flex-col items-center px-6">
        <svg viewBox="0 0 200 160" width={224} height={179} xmlns="http://www.w3.org/2000/svg" aria-hidden>
          {/* faint blueprint grid */}
          <g stroke="var(--line-strong)" strokeWidth="0.6" opacity="0.32">
            {[30, 60, 90, 120, 150, 176].map((x) => (
              <line key={`v${x}`} x1={x} y1="14" x2={x} y2="150" />
            ))}
            {[36, 66, 96, 126].map((y) => (
              <line key={`h${y}`} x1="20" y1={y} x2="180" y2={y} />
            ))}
          </g>

          {/* the route: an arc from the origin node up to the destination pin */}
          <path
            id="cc-route"
            className="cc-route-line"
            pathLength={1}
            d="M44 120 C 84 120, 100 60, 150 50"
            fill="none"
            stroke="var(--gold-deep)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* origin node with a pulsing ring */}
          <circle className="cc-route-ring" cx="44" cy="120" r="8" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
          <circle className="cc-route-node" cx="44" cy="120" r="5" fill="var(--gold)" />

          {/* destination map pin, dropping onto the route end */}
          <g className="cc-route-pin" fill="var(--gold-deep)">
            <path d="M150 51 L141.5 36 h17 Z" />
            <circle cx="150" cy="29" r="11" />
            <circle cx="150" cy="29" r="4.4" fill="var(--bg)" />
          </g>

          {/* the data packet, travelling the route */}
          <circle r="3.6" fill="var(--gold)">
            <animateMotion dur="1.05s" begin="0.15s" fill="freeze" rotate="auto">
              <mpath href="#cc-route" />
            </animateMotion>
          </circle>
        </svg>

        <div className="flex items-center gap-2.5 mt-5">
          <LogoMark size={26} />
          <span className="font-display text-[19px] font-semibold text-ink tracking-tight">Opening {label}</span>
        </div>
        <p className="text-[13px] text-muted mt-2 max-w-xs">Plotting your route to live data.</p>
      </div>
    </div>
  );
}
