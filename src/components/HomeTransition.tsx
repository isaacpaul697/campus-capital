"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogoMark } from "./LogoMark";

/**
 * The "back to home" transition. Returning to the hub should feel like pulling
 * back to take in the whole skyline, so clicking a home link plays a ~1.6s
 * overlay: a row of building silhouettes rises floor-by-floor into a city
 * skyline while the frame gently zooms out, as if stepping back from the board.
 * It is intentionally distinct from the area-search radar, the About blueprint,
 * and the BuildOverlay single-tower raise so the hub has its own arrival feel.
 *
 * The behaviour lives in a hook so any entry point (sidebar logo, About header)
 * can share it. The overlay is rendered through a portal to document.body and
 * sits above everything (maps, drawers) so it is never trapped behind chrome.
 * Honors reduced-motion: navigates straight through with no overlay.
 */

const HOLD_MS = 2300;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useHomeTransition(onNavigate?: () => void) {
  const path = usePathname();
  const router = useRouter();
  const active = path === "/";
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
      router.prefetch("/");
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [
        window.setTimeout(() => router.push("/"), HOLD_MS - 320),
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
      ? createPortal(<HomeTransitionOverlay leaving={leaving} />, document.body)
      : null;

  return { onClick, overlay, active };
}

/**
 * A home link that wraps any children (logo lockup, text) with the transition.
 * Keeps every call site styling its own trigger while sharing the behaviour.
 */
export function HomeLink({
  children,
  className,
  onNavigate,
}: {
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const { onClick, overlay } = useHomeTransition(onNavigate);
  return (
    <>
      <Link href="/" onClick={onClick} className={className}>
        {children}
      </Link>
      {overlay}
    </>
  );
}

/** Full-screen establishing shot: a skyline rising while the frame pulls back. */
export function HomeTransitionOverlay({ leaving }: { leaving: boolean }) {
  // Each tower: x, width, full height, rise delay. Varied heights read as a city.
  const towers: { x: number; w: number; h: number; d: number }[] = [
    { x: 20, w: 22, h: 58, d: 0.18 },
    { x: 46, w: 26, h: 92, d: 0.06 },
    { x: 76, w: 20, h: 70, d: 0.24 },
    { x: 100, w: 30, h: 120, d: 0.0 },
    { x: 134, w: 22, h: 84, d: 0.14 },
    { x: 160, w: 26, h: 104, d: 0.1 },
    { x: 190, w: 18, h: 64, d: 0.26 },
  ];
  const groundY = 168;

  return (
    <div
      className={`cc-home-overlay fixed inset-0 z-[2000] grid place-items-center text-center transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(7px)" }}
      role="status"
      aria-live="polite"
      aria-label="Returning to the home workspace"
    >
      <div className="flex flex-col items-center px-6">
        <div className="cc-home-zoom">
          <svg viewBox="0 0 220 200" width={228} height={208} xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <linearGradient id="cc-home-twr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold-bright)" />
                <stop offset="100%" stopColor="var(--gold-deep)" />
              </linearGradient>
            </defs>

            {/* twinkling skyline stars */}
            <g fill="var(--gold)">
              {[
                [34, 36], [180, 28], [120, 22], [70, 44], [200, 56],
              ].map(([cx, cy], i) => (
                <circle key={`s${cx}`} className="cc-home-star" cx={cx} cy={cy} r="1.6" style={{ animationDelay: `${0.5 + i * 0.12}s` }} />
              ))}
            </g>

            {/* towers grow upward from the ground line (scaleY anchored at base) */}
            <g>
              {towers.map((t) => (
                <rect
                  key={t.x}
                  className="cc-home-bld"
                  x={t.x}
                  y={groundY - t.h}
                  width={t.w}
                  height={t.h}
                  fill="url(#cc-home-twr)"
                  rx="1.5"
                  style={{ transformOrigin: `${t.x + t.w / 2}px ${groundY}px`, animationDelay: `${t.d}s` }}
                />
              ))}
            </g>

            {/* ground line sits on top so towers read as planted on it */}
            <line x1="8" y1={groundY} x2="212" y2={groundY} stroke="var(--gold-deep)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex items-center gap-2.5 mt-5">
          <LogoMark size={28} />
          <span className="font-display text-[19px] font-semibold text-ink tracking-tight">Real Estate Intelligence</span>
        </div>
        <p className="text-[13px] text-muted mt-2 max-w-xs">
          Back to the whole board: every workspace, one view.
        </p>
      </div>
    </div>
  );
}
