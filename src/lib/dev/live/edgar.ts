import { UA, HALF_DAY, memo } from "./http";

/**
 * Live corporate activity from the SEC's EDGAR system. Every public real-estate
 * operator files material events, results, and offerings here, with real dates
 * and linkable documents, so this is an honest "recent moves" feed with zero
 * fabrication. Free, no key; SEC only asks for a descriptive User-Agent.
 */

export interface Filing {
  form: string;
  label: string;
  date: string; // ISO yyyy-mm-dd
  url: string;
}

/** Human-readable meaning for the SEC form codes worth surfacing as a "move". */
const FORM_LABEL: Record<string, string> = {
  "8-K": "Material event",
  "10-Q": "Quarterly results",
  "10-K": "Annual report",
  "S-11": "Property securities registration",
  "424B5": "Securities offering",
  "424B2": "Securities offering",
  "424B3": "Securities offering",
  "FWP": "Offering term sheet",
  "DEF 14A": "Proxy statement",
  "SC 13D": "Activist ownership stake",
  "SC 13D/A": "Ownership stake update",
};

/**
 * Forms that represent a company *doing something* (events, results, raises),
 * as opposed to insider-trade and passive-ownership noise (3/4/5/144/13G).
 */
function labelFor(form: string): string | null {
  if (FORM_LABEL[form]) return FORM_LABEL[form];
  if (form.startsWith("424B")) return "Securities offering";
  if (form.startsWith("S-11")) return "Property securities registration";
  if (form.startsWith("8-K")) return "Material event";
  if (form.startsWith("10-Q")) return "Quarterly results";
  if (form.startsWith("10-K")) return "Annual report";
  return null;
}

interface SubmissionsRecent {
  accessionNumber: string[];
  filingDate: string[];
  form: string[];
  primaryDocument: string[];
}

/** Fetch the most recent material filings for one company by CIK. */
export async function fetchFilings(cik: string | number, limit = 4): Promise<Filing[]> {
  const cikInt = Number(cik);
  if (!Number.isFinite(cikInt) || cikInt <= 0) return [];
  const padded = String(cikInt).padStart(10, "0");

  return memo(`edgar:${padded}:${limit}`, HALF_DAY, async () => {
    try {
      const res = await fetch(`https://data.sec.gov/submissions/CIK${padded}.json`, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        next: { revalidate: HALF_DAY },
      });
      if (!res.ok) return [];
      const data = (await res.json()) as { filings?: { recent?: SubmissionsRecent } };
      const r = data.filings?.recent;
      if (!r) return [];

      const out: Filing[] = [];
      for (let i = 0; i < r.form.length && out.length < limit; i++) {
        const form = r.form[i];
        const label = labelFor(form);
        if (!label) continue; // skip insider/ownership noise
        const acc = r.accessionNumber[i].replace(/-/g, "");
        const doc = r.primaryDocument[i];
        const base = `https://www.sec.gov/Archives/edgar/data/${cikInt}/${acc}`;
        out.push({
          form,
          label,
          date: r.filingDate[i],
          url: doc ? `${base}/${doc}` : `${base}/`,
        });
      }
      return out;
    } catch {
      return [];
    }
  });
}
