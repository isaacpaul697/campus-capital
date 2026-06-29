"use client";

import { useEffect, useState } from "react";
import type { ProviderUsage } from "@/lib/usage";

/**
 * Live API-key status, surfaced inline next to any figure that is blank because
 * a source hit its rate limit. The honest companion to the app's "n/a": instead
 * of leaving a reader guessing whether a number is missing or just throttled,
 * we name the source and say when its quota window reopens.
 *
 * The reading comes from /api/usage (the same registry the settings panel uses).
 * We fetch it once per minute and share the result across every note on the
 * page through a module-level cache, so a screen full of stats makes one call.
 */
let cache: { data: ProviderUsage[]; ts: number } | null = null;
let inflight: Promise<ProviderUsage[]> | null = null;
const TTL_MS = 60_000;

function loadUsage(): Promise<ProviderUsage[]> {
  if (cache && Date.now() - cache.ts < TTL_MS) return Promise.resolve(cache.data);
  if (inflight) return inflight;
  inflight = fetch("/api/usage")
    .then((r) => r.json())
    .then((d) => {
      const data: ProviderUsage[] = d.providers ?? [];
      cache = { data, ts: Date.now() };
      inflight = null;
      return data;
    })
    .catch(() => {
      inflight = null;
      return cache?.data ?? [];
    });
  return inflight;
}

export function useApiUsage(): ProviderUsage[] {
  const [providers, setProviders] = useState<ProviderUsage[]>(cache?.data ?? []);
  useEffect(() => {
    let on = true;
    loadUsage().then((d) => {
      if (on) setProviders(d);
    });
    return () => {
      on = false;
    };
  }, []);
  return providers;
}

/** "back ~3:45 PM (in 2h 55m)" from an ISO reset timestamp. */
function formatReset(iso: string | null): string | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const ms = t - Date.now();
  if (ms <= 0) return "back any moment";
  const clock = new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const mins = Math.round(ms / 60_000);
  const rel = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  return `back ~${clock} (in ${rel})`;
}

/**
 * Tiny amber note shown next to a blank figure when its source key is rate
 * limited. Renders nothing unless that source is actually exhausted, so it
 * never cries wolf when a value is simply unavailable.
 */
export function RateLimitNote({ source, className = "" }: { source: string; className?: string }) {
  const providers = useApiUsage();
  const p = providers.find((u) => u.id === source);
  if (!p || p.status !== "exhausted") return null;
  const reset = formatReset(p.resetAt);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10.5px] font-medium text-warn bg-warn-soft rounded-md px-1.5 py-0.5 leading-tight ${className}`}
      title={`${p.name} rate limit reached. ${p.note}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-warn shrink-0" />
      {p.name} quota reached{reset ? ` · ${reset}` : ""}
    </span>
  );
}
