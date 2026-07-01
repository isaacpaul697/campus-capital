"use client";

import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AppBackground } from "@/components/AppBackground";
import { HomeLink } from "@/components/HomeTransition";
import { Reveal } from "@/components/Reveal";
import { useAboutLinkTransition } from "@/components/AboutLinkTransition";
import { AboutHeroVisual } from "@/components/AboutHeroVisual";
import { useSettings } from "@/lib/settings";
import { METHODOLOGY } from "@/lib/dev/model";
import { SECTORS, SECTOR_ORDER, SECTOR_ICON, STUDENT_HOUSING_ICON } from "@/lib/dev/sectorDefs";

/**
 * The three ways to jump straight into live data: the two interactive maps and
 * the area search. These sit at the top of the page, right after the data note.
 */
const QUICK_LINKS = [
  {
    href: "/national",
    eyebrow: "Live map",
    title: "National permit map",
    desc: "A clickable map of all 50 states showing live permit volumes and construction trends from the Census Building Permits Survey. Click any state to drill into its pipeline and top developers.",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.4 2.6 3.6 6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-6-3.6-9s1.2-6.4 3.6-9Z",
  },
  {
    href: "/student-housing/map",
    eyebrow: "Live map",
    title: "Student-housing map",
    desc: "An interactive map of major university markets, each scored 0 to 100 on live enrollment, demand, supply, and rent signals. Click a campus to open its full acquisition read.",
    icon: STUDENT_HOUSING_ICON,
  },
  {
    href: "/area",
    eyebrow: "Search",
    title: "Area search",
    desc: "Sweep OpenStreetMap building footprints for any US city or address to see what has actually been built on the ground, block by block, then underwrite any parcel.",
    icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.35-4.35",
  },
];

/** Every asset class, described by what it holds, with its own tagline. Student
 *  housing leads the roster as its own dedicated acquisitions workspace. */
const ASSET_CLASSES = [
  {
    href: "/student-housing",
    label: "Student housing",
    eyebrow: "Residential · Acquisitions desk",
    color: "#9a7b2e",
    icon: STUDENT_HOUSING_ICON,
    tagline: "Find the next student-housing market before the market does.",
    blurb:
      "Purpose-built and off-campus student housing. Screen university markets on live demand and supply, score deals 0 to 100, and auto-underwrite any mapped property.",
  },
  ...SECTOR_ORDER.map((slug) => {
    const s = SECTORS[slug];
    return {
      href: `/sector/${slug}`,
      label: s.label,
      eyebrow: s.eyebrow,
      color: s.color,
      icon: SECTOR_ICON[slug],
      tagline: `${s.heroLead} ${s.heroPunch}`,
      blurb: s.blurb,
    };
  }),
];

/** The student-housing screening pipeline, step by step. */
const HOUSING_METHOD = [
  { h: "1 · Define the market set", b: "Ten major university markets configured with real federal identifiers (IPEDS unit IDs), coordinates, and conference/region metadata." },
  { h: "2 · Fetch live enrollment", b: "The College Scorecard API provides official enrollment, acceptance rates, and historical counts. Growth is annualized over a 5-year baseline." },
  { h: "3 · Pull demand signals", b: "Google News RSS surfaces recent student-housing headlines per campus; article volume is a proxy for demand momentum." },
  { h: "4 · Map real apartments", b: "OpenStreetMap's Overpass API returns named apartment buildings near each campus, with addresses, websites, and exact distances." },
  { h: "5 · Score 0 to 100", b: "A transparent weighted model across six factors. Rent and occupancy are modeled from live inputs and labeled estimated." },
  { h: "6 · Auto-underwrite", b: "Click any mapped property to size the deal: gross rent flows to NOI through modeled vacancy and expense ratios, valued at a cap rate anchored to the live FRED mortgage rate plus an asset-class spread." },
];

/** The live public sources every number traces back to. */
const SOURCES = [
  "U.S. Census (ACS + Building Permits Survey)",
  "College Scorecard",
  "Bureau of Labor Statistics",
  "FRED (Federal Reserve)",
  "HUD Fair Market Rents",
  "FEMA National Risk Index",
  "SEC EDGAR filings",
  "OpenStreetMap",
  "City open-data permit portals",
  "Google News",
  "Wikipedia",
  "Open-Meteo & USGS",
];

export default function AboutPage() {
  const { dark, toggleDark } = useSettings();
  const { launch, overlay } = useAboutLinkTransition();
  return (
    <div className="min-h-screen flex flex-col relative">
      <AppBackground />

      <header className="h-[60px] flex items-center justify-between px-6 md:px-10 border-b border-line">
        <HomeLink className="flex items-center gap-3">
          <LogoMark size={36} />
          <div>
            <div className="font-display text-[17px] font-semibold text-ink leading-none tracking-tight">Real Estate Intelligence</div>
            <div className="text-[11px] mt-1 text-muted">Live public-data analytics</div>
          </div>
        </HomeLink>
        <div className="flex items-center gap-2">
          <HomeLink className="text-[13px] font-semibold text-ink-soft hover:text-ink px-3 py-1.5 rounded-[10px] hover:bg-surface-2 transition-colors">
            ← Home
          </HomeLink>
          <button onClick={toggleDark} aria-label="Toggle theme"
            className="grid place-items-center w-9 h-9 rounded-[10px] bg-surface-2 border border-line text-ink-soft hover:text-ink hover:border-line-strong">
            {dark ? (
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={4} /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 md:px-10 py-14 md:py-18">
        <Reveal>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-12 items-center">
            <div className="max-w-[680px]">
              <div className="text-[12px] font-semibold uppercase tracking-[1.6px] text-gold-deep">About this site</div>
              <h1 className="font-display text-[32px] md:text-[42px] leading-[1.08] font-semibold text-ink mt-3">
                What Real Estate Intelligence is, and how every number is built.
              </h1>
              <p className="text-[15px] text-ink-soft mt-4 leading-relaxed">
                Real Estate Intelligence is a research workspace that turns free public data into an
                acquisitions and development read on US real estate. It pairs a student-housing
                acquisitions desk with a national development monitor, around a single rule: every figure is
                either pulled live from a public source or transparently modeled from live inputs and badged
                as estimated. There are no mock numbers anywhere in the app.
              </p>
            </div>
            <div className="rounded-[var(--radius)] bg-surface border border-line p-5 md:p-6 shadow-[var(--shadow)]">
              <AboutHeroVisual />
              <div className="text-[11px] text-muted text-center mt-2 leading-relaxed">
                Live public signals, scored and modeled into a market read.
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={60}>
          <div className="mt-10 rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">How the data works</div>
            <h2 className="font-display text-[20px] font-semibold text-ink mt-1">Live first, modeled-and-badged second</h2>
            <p className="text-[13.5px] text-ink-soft mt-3 leading-relaxed max-w-[720px]">
              Where a public source publishes a figure directly, the app shows it and tags it live. Where no
              free feed exists, such as a property valuation or an acquisition return, the number is modeled
              from live inputs using documented assumptions and clearly badged estimated, never invented.
              Every data point on every page carries a provenance tag so you always know what is real and
              what is modeled.
            </p>
            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-[1.4px] font-semibold text-muted-2 mb-2.5">Live data sources</div>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <span key={s} className="text-[12px] text-ink-soft bg-surface-2 border border-line rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-12">
            <div className="text-[12px] font-semibold uppercase tracking-[1.6px] text-gold-deep">Jump straight in</div>
            <h2 className="font-display text-[26px] md:text-[30px] font-semibold text-ink mt-2">Open a live map or search any area</h2>
            <p className="text-[14px] text-ink-soft mt-3 leading-relaxed max-w-[680px]">
              Two interactive maps and a footprint search, each built entirely on live public data. Jump
              straight to whichever one you need.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {QUICK_LINKS.map((q) => (
                <Link key={q.href} href={q.href} onClick={(e) => launch(e, q.href, q.title)}
                  className="group flex h-full flex-col rounded-[var(--radius)] bg-surface border border-line p-5 md:p-6 shadow-[var(--shadow)] hover:border-gold hover:shadow-[var(--shadow-lg)] transition-all">
                  <span className="grid place-items-center w-11 h-11 rounded-full shrink-0" style={{ background: "var(--gold-soft)" }}>
                    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--gold-deep)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d={q.icon} />
                    </svg>
                  </span>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[1.2px] text-muted mt-4">{q.eyebrow}</div>
                  <div className="font-display text-[18px] font-semibold text-ink leading-tight mt-0.5">{q.title}</div>
                  <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">{q.desc}</p>
                  <div className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold-deep group-hover:gap-2.5 transition-all">
                    Open
                    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-14">
            <div className="text-[12px] font-semibold uppercase tracking-[1.6px] text-gold-deep">Asset classes</div>
            <h2 className="font-display text-[26px] md:text-[30px] font-semibold text-ink mt-2">A dedicated deep dive for every asset class</h2>
            <p className="text-[14px] text-ink-soft mt-3 leading-relaxed max-w-[680px]">
              Beyond student housing, each asset class has its own workspace: live permit activity, modeled
              development economics, major public and private players with SEC filings, and a live news feed.
              Open any class to explore it.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {ASSET_CLASSES.map((a, i) => (
            <Reveal key={a.href} delayMs={i * 90}>
              <Link href={a.href} onClick={(e) => launch(e, a.href, a.label)}
                className="group flex h-full flex-col rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)] hover:shadow-[var(--shadow-lg)] hover:border-line-strong transition-all">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center w-10 h-10 rounded-full shrink-0" style={{ background: `color-mix(in srgb, ${a.color} 16%, transparent)` }}>
                    <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke={a.color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                      <path d={a.icon} />
                    </svg>
                  </span>
                  <div>
                    <div className="text-[10.5px] font-semibold uppercase tracking-[1.2px] text-muted">{a.eyebrow}</div>
                    <div className="font-display text-[19px] font-semibold text-ink leading-tight">{a.label}</div>
                  </div>
                </div>
                <div className="font-display text-[15px] italic text-gold-deep mt-3.5 leading-snug">{a.tagline}</div>
                <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">{a.blurb}</p>
                <div className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold-deep group-hover:gap-2.5 transition-all">
                  Open {a.label}
                  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={120}>
          <div className="mt-12">
            <div className="text-[12px] font-semibold uppercase tracking-[1.6px] text-gold-deep">Methodology</div>
            <h2 className="font-display text-[26px] md:text-[30px] font-semibold text-ink mt-2">How each figure is computed</h2>
            <p className="text-[14px] text-ink-soft mt-3 leading-relaxed max-w-[680px]">
              Two methodologies power the app. The first, below, is the student-housing screening
              pipeline that turns live public data into an acquisition score. The second covers the
              development and underwriting models shared across every asset class.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-6 rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-gold-deep">Student housing</div>
            <h3 className="font-display text-[18px] font-semibold text-ink mt-1">How the student-housing acquisition score is built</h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-4">
              {HOUSING_METHOD.map((m) => (
                <div key={m.h} className="border-l-2 pl-4" style={{ borderColor: "var(--gold)" }}>
                  <div className="text-[13.5px] font-semibold text-ink">{m.h}</div>
                  <div className="text-[13px] text-ink-soft mt-0.5 leading-relaxed">{m.b}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-6 rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">Development & underwriting models</div>
            <h3 className="font-display text-[18px] font-semibold text-ink mt-1">Every modeled metric, its formula, and its source</h3>
            <div className="mt-4 flex flex-col divide-y divide-line">
              {METHODOLOGY.map((m) => (
                <div key={m.metric} className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-x-6 gap-y-1 py-3">
                  <div className="flex items-start gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 ${
                      m.provenance === "live" ? "bg-good-soft text-good" : "bg-warn-soft text-warn"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.provenance === "live" ? "bg-good" : "bg-warn"}`} />
                      {m.provenance}
                    </span>
                    <span className="text-[13.5px] font-semibold text-ink">{m.metric}</span>
                  </div>
                  <div>
                    <div className="text-[13px] text-ink-soft leading-relaxed">{m.formula}</div>
                    <div className="text-[11.5px] text-muted mt-0.5">{m.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-line px-6 md:px-10 py-5 text-[12px] text-muted">
        100% live public data · No mock numbers · Figures are live or modeled-and-badged
      </footer>

      {overlay}
    </div>
  );
}
