import type { Article } from "@/lib/types";
import type { SectorCompany } from "@/lib/dev/sectors";
import type { Filing } from "@/lib/dev/live/edgar";
import { fmtDate } from "@/lib/dev/format";
import { Card, SectionTitle, FirmLogo } from "./ui";

export interface PlayerRow {
  company: SectorCompany;
  filings: Filing[];
}

/** Major operators in the asset class, each with their latest live SEC filings. */
export function SectorPlayers({
  rows,
  intro,
  accent,
}: {
  rows: PlayerRow[];
  intro: string;
  accent: string;
}) {
  if (!rows.length) return null;
  return (
    <Card>
      <SectionTitle sub={intro}>Major players &amp; recent moves</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map(({ company, filings }) => (
          <div key={company.ticker + company.cik} className="bg-surface-2 border border-line rounded-[var(--radius-card)] p-4">
            <div className="flex items-start gap-3">
              <FirmLogo src={`https://www.google.com/s2/favicons?domain=${company.site}&sz=128`} name={company.name} size={38} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[15px] font-semibold text-ink truncate">{company.name}</span>
                  <span className="text-[10px] font-semibold num px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: `${accent}1f`, color: accent }}>{company.ticker}</span>
                </div>
                <div className="text-[12px] text-muted mt-0.5 leading-snug">{company.note}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-line flex flex-col gap-1.5">
              {filings.length > 0 ? (
                filings.map((f) => (
                  <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 text-[12px] group">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-surface border border-line text-muted shrink-0">{f.form}</span>
                      <span className="text-ink-soft truncate group-hover:text-ink">{f.label}</span>
                    </span>
                    <span className="num text-muted-2 shrink-0">{fmtDate(f.date)}</span>
                  </a>
                ))
              ) : (
                <span className="text-[12px] text-muted-2">No recent SEC filings.</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-muted-2">
        Filings pulled live from SEC EDGAR. Company list is a fixed reference of major public operators; no activity is fabricated.
      </div>
    </Card>
  );
}

/** Live sector news headlines from Google News RSS. */
export function SectorNews({ articles, label }: { articles: Article[]; label: string }) {
  return (
    <Card>
      <SectionTitle sub="Live headlines from Google News, refreshed twice daily">{label} news</SectionTitle>
      {articles.length > 0 ? (
        <div className="flex flex-col divide-y divide-line">
          {articles.map((a) => (
            <a key={a.link} href={a.link} target="_blank" rel="noopener noreferrer"
              className="py-2.5 first:pt-0 last:pb-0 group">
              <div className="text-[13.5px] text-ink-soft group-hover:text-ink leading-snug">{a.title}</div>
              <div className="text-[11px] text-muted-2 mt-1 flex items-center gap-1.5">
                <span className="truncate">{a.source}</span>
                {a.published && <><span>·</span><span className="num shrink-0">{fmtDate(a.published)}</span></>}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-muted">No headlines returned right now. The news feed will repopulate shortly.</div>
      )}
    </Card>
  );
}
