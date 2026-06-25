export interface CompanySummary {
  company_id: number;
  name: string;
  short_name: string;
  logo_url: string;
  category: string;
  company_type: string;
  incorporation_year: number | string;
  employee_size: string;
  headquarters_address: string;
  yoy_growth_rate: string;
  website_url: string;
  linkedin_url?: string;
}

export type CompanyProfile = Record<string, unknown> & {
  name: string;
  short_name: string;
};

export interface DashboardSkill {
  id: number;
  name: string;
  required_level: number;
  required_proficiency: string;
}

export const asString = (v: unknown): string =>
  v === null || v === undefined ? "" : String(v);

export const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

const NULLISH = new Set(["", "na", "n/a", "none", "-", "null", "undefined"]);
export const isNullish = (v: unknown) =>
  NULLISH.has(asString(v).trim().toLowerCase());

export const splitItems = (v: string): string[] =>
  v
    .split(/[\n;•]|(?<!\d)\.(?!\d)/g)
    .map((s) => s.trim())
    .filter(Boolean);

export const titleCaseFromCode = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const scoreToDifficulty = (n: number) =>
  n >= 8 ? "EXPERT" : n >= 6 ? "ADVANCED" : n >= 4 ? "PRO" : "BEGINNER";

export function normalizeCompanySummary(
  short: Record<string, unknown>,
  id: number,
): CompanySummary {
  return {
    company_id: id,
    name: asString(short.name),
    short_name: asString(short.short_name),
    logo_url: asString(short.logo_url),
    category: asString(short.category),
    company_type: asString(short.company_type),
    incorporation_year: (short.incorporation_year as number) ?? "",
    employee_size: asString(short.employee_size),
    headquarters_address: asString(short.headquarters_address),
    yoy_growth_rate: asString(short.yoy_growth_rate),
    website_url: asString(short.website_url),
    linkedin_url: asString(short.linkedin_url),
  };
}

export function normalizeCompanyProfile(
  full: Record<string, unknown>,
  short: Record<string, unknown>,
): CompanyProfile {
  return { ...short, ...full } as CompanyProfile;
}

export function normalizeDashboardSkills(
  skillLevels: Array<{
    skill_set_id: number;
    skill_set_name: string;
    required_level: number;
    required_proficiency: string;
  }>,
): DashboardSkill[] {
  return skillLevels.map((s) => ({
    id: s.skill_set_id,
    name: s.skill_set_name,
    required_level: s.required_level,
    required_proficiency: s.required_proficiency,
  }));
}

export const proficiencyToBloom = (n: number) =>
  n <= 2 ? "CU" : n <= 4 ? "AP" : n <= 6 ? "AS" : n <= 8 ? "EV" : "CR";

export const scoreToCriticality = (n: number) =>
  n >= 7 ? "Critical" : n >= 5 ? "Important" : "Baseline";

export const BLOOM_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  CU: { label: "Understand", color: "#3b82f6", bg: "#eff6ff" },
  AP: { label: "Apply", color: "#22c55e", bg: "#f0fdf4" },
  AS: { label: "Analyze", color: "#eab308", bg: "#fefce8" },
  EV: { label: "Evaluate", color: "#ef4444", bg: "#fef2f2" },
  CR: { label: "Create", color: "#a855f7", bg: "#faf5ff" },
};

export const CATEGORY_COLOR: Record<string, string> = {
  "Super Dream": "#7c3aed",
  Dream: "#2563eb",
  Standard: "#16a34a",
  Regular: "#d97706",
};
