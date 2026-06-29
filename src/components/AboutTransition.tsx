"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogoMark } from "./LogoMark";

/**
 * The "About & methodology" transition. Because the About page is static (no
 * live fetch to wait on), a normal route-loading boundary would barely flash,
 * so clicking About plays a deliberate ~1.1s overlay: an architect's building
 * elevation literally draws itself in, line by line, over a blurred backdrop,
 * then lifts as the page settles underneath. It is intentionally distinct from
 * the area-search radar so each destination has its own feel.
 *
 * The behaviour lives in a hook so any entry point (sidebar, home header) can
 * share it. The overlay is rendered through a portal to document.body and sits
 * above everything (maps, drawers), so it is never trapped behind page chrome.
 * Honors reduced-motion: navigates straight through with no overlay.
 */

const HOLD_MS = 2300;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAboutTransition(onNavigate?: () => void) {
  const path = usePathname();
  const router = useRouter();
  const active = path === "/about";
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (active) return;
      // Let modified clicks (new tab) and reduced-motion users behave normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (prefersReducedMotion()) {
        onNavigate?.();
        return;
      }
      e.preventDefault();
      onNavigate?.();
      setShow(true);
      setLeaving(false);
      router.prefetch("/about");
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [
        window.setTimeout(() => router.push("/about"), HOLD_MS - 320),
        window.setTimeout(() => setLeaving(true), HOLD_MS - 80),
        window.setTimeout(() => {
          setShow(false);
          setLeaving(false);
        }, HOLD_MS + 260),
      ];
    },
    [active, onNavigate, router],
  );

  const overlay =
    show && typeof document !== "undefined"
      ? createPortal(<AboutTransitionOverlay leaving={leaving} />, document.body)
      : null;

  return { onClick, overlay, active };
}

/** Sidebar "About & methodology" nav link, with the transition built in. */
export function AboutNavLink({ onNavigate }: { onNavigate?: () => void }) {
  const { onClick, overlay, active } = useAboutTransition(onNavigate);
  return (
    <>
      <Link
        href="/about"
        onClick={onClick}
        className={`relative flex items-center gap-3 px-3 py-2 mb-0.5 rounded-[10px] text-[13.5px] transition-colors ${
          active ? "bg-gold-soft text-ink font-semibold" : "text-ink-soft hover:bg-surface-2 font-medium"
        }`}
      >
        {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ background: "var(--gold)" }} />}
        <svg
          viewBox="0 0 24 24"
          width={17}
          height={17}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={active ? { color: "var(--gold)" } : { opacity: 0.7 }}
        >
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
        </svg>
        About &amp; methodology
      </Link>
      {overlay}
    </>
  );
}

/** Full-screen drafting scene: a building elevation drawing itself in gold line. */
export function AboutTransitionOverlay({ leaving }: { leaving: boolean }) {
  return (
    <div
      className={`cc-about-overlay fixed inset-0 z-[2000] grid place-items-center text-center transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "color-mix(in srgb, var(--bg) 86%, transparent)", backdropFilter: "blur(7px)" }}
      role="status"
      aria-live="polite"
      aria-label="Opening About and methodology"
    >
      <div className="flex flex-col items-center px-6">
        <svg
          viewBox="0 0 200 200"
          width={208}
          height={208}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {/* faint blueprint grid */}
          <g stroke="var(--line-strong)" strokeWidth="0.6" opacity="0.35">
            {[30, 60, 90, 120, 150, 170].map((x) => (
              <line key={`v${x}`} x1={x} y1="18" x2={x} y2="176" />
            ))}
            {[40, 70, 100, 130, 160].map((y) => (
              <line key={`h${y}`} x1="22" y1={y} x2="178" y2={y} />
            ))}
          </g>

          <g
            fill="none"
            stroke="var(--gold-deep)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* tall tower outline */}
            <path className="cc-draw" pathLength={1} d="M52 176 V58 L86 38 V176" style={{ animationDelay: "0.05s" }} />
            {/* shorter building outline */}
            <path className="cc-draw" pathLength={1} d="M104 176 V78 L142 60 V176" style={{ animationDelay: "0.28s" }} />
            {/* ground line */}
            <path className="cc-draw" pathLength={1} d="M30 176 H172" strokeWidth="3" style={{ animationDelay: "0s" }} />
            {/* floor dividers, tall tower */}
            <path className="cc-draw" pathLength={1} d="M52 150 H86" style={{ animationDelay: "0.5s" }} />
            <path className="cc-draw" pathLength={1} d="M52 124 H86" style={{ animationDelay: "0.6s" }} />
            <path className="cc-draw" pathLength={1} d="M52 98 H86" style={{ animationDelay: "0.7s" }} />
            <path className="cc-draw" pathLength={1} d="M52 72 H86" style={{ animationDelay: "0.8s" }} />
            {/* floor dividers, short building */}
            <path className="cc-draw" pathLength={1} d="M104 150 H142" style={{ animationDelay: "0.62s" }} />
            <path className="cc-draw" pathLength={1} d="M104 122 H142" style={{ animationDelay: "0.72s" }} />
            <path className="cc-draw" pathLength={1} d="M104 94 H142" style={{ animationDelay: "0.82s" }} />
          </g>

          {/* windows fading in once the frame is drawn */}
          <g fill="var(--gold)">
            {[
              [60, 132], [72, 132], [60, 106], [72, 106], [60, 80], [72, 80],
              [113, 130], [126, 130], [113, 102], [126, 102],
            ].map(([x, y], i) => (
              <rect
                key={`${x}-${y}`}
                className="cc-draw-fade"
                x={x}
                y={y}
                width="7"
                height="9"
                rx="1"
                style={{ animationDelay: `${0.95 + i * 0.04}s` }}
              />
            ))}
          </g>
        </svg>

        <div className="flex items-center gap-2.5 mt-5">
          <LogoMark size={28} />
          <span className="font-display text-[19px] font-semibold text-ink tracking-tight">About &amp; methodology</span>
        </div>
        <p className="text-[13px] text-muted mt-2 max-w-xs">
          Tracing every number back to its public source.
        </p>
      </div>
    </div>
  );
}
