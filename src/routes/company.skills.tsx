import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";
import { useCompanyProfile, useCompanySkills, type CompanySkillsData, type CompanyProfileData } from "@/lib/companyApi";
import {
  BLOOM_META,
  proficiencyToBloom,
  scoreToCriticality,
} from "@/lib/companyData";

export const Route = createFileRoute("/company/skills")({
  head: () => ({ meta: [{ title: "Skill Intelligence — KITS" }] }),
  component: SkillIntelligence,
});

const CRITICALITY_META: Record<string, { color: string; bg: string; desc: string }> = {
  Critical: { color: "#ef4444", bg: "#fef2f2", desc: "Must-have for selection" },
  Important: { color: "#d97706", bg: "#fffbeb", desc: "Boosts your chances" },
  Baseline: { color: "#16a34a", bg: "#f0fdf4", desc: "Nice-to-have foundation" },
};

function SkillIntelligence() {
  const { selection } = useCompany();
  const profileQuery = useCompanyProfile(selection?.companyId);
  const skillsQuery = useCompanySkills(selection?.companyId);
  const profileData = profileQuery.data as CompanyProfileData | null;
  const skillsData = skillsQuery.data as CompanySkillsData | undefined;
  const summary = profileData?.summary;
  const skills = skillsData?.skills ?? [];
  const skillTopics = skillsData?.topics ?? {};
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const sorted = useMemo(
    () => [...skills].sort((a, b) => b.required_level - a.required_level),
    [skills]
  );

  if (!selection || profileQuery.isLoading || skillsQuery.isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading skills…</div>;
  }

  if (profileQuery.isError || skillsQuery.isError || !summary) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">Unable to load skill intelligence.</p>
        <Button variant="outline" className="mt-4" onClick={() => { profileQuery.refetch(); skillsQuery.refetch(); }}>
          Retry
        </Button>
      </div>
    );
  }

  if (!summary) {
    return <div className="p-8 text-sm text-muted-foreground">Loading skills…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <CompanyLogo name={summary.name} url={summary.logo_url} size={44} />
        <h1 className="font-heading text-xl font-semibold text-foreground">
          {summary.short_name || summary.name} Skill Intelligence
        </h1>
      </div>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Bloom Taxonomy</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Object.entries(BLOOM_META).map(([k, m]) => (
            <div
              key={k}
              className="rounded-lg border border-border px-3 py-2"
              style={{ background: m.bg }}
            >
              <div className="text-[10px] font-semibold tracking-wider" style={{ color: m.color }}>{k}</div>
              <div className="text-xs text-foreground">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(CRITICALITY_META).map(([k, m]) => (
          <div
            key={k}
            className="rounded-xl border border-border p-4"
            style={{ background: m.bg }}
          >
            <div className="text-sm font-semibold" style={{ color: m.color }}>{k}</div>
            <div className="text-xs text-muted-foreground">{m.desc}</div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        {sorted.map((s) => {
          const bloom = proficiencyToBloom(s.required_level);
          const meta = BLOOM_META[bloom];
          const crit = scoreToCriticality(s.required_level);
          const critMeta = CRITICALITY_META[crit];
          const topics = skillTopics[s.id] ?? [];
          const isOpen = !!open[s.id];
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card">
              <button
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
                onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
              >
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {bloom} · {meta.label}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: critMeta.bg, color: critMeta.color }}
                    >
                      {crit}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.required_level * 10}%`,
                          background: meta.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {s.required_level}/10
                    </span>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {isOpen && (
                <ol className="border-t border-border">
                  {topics.map((t, i) => {
                    const level = i + 1;
                    const locked = level > s.required_level;
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-3 border-b border-border px-4 py-2.5 text-sm last:border-0 ${
                          locked ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                          style={{
                            background: locked ? "var(--secondary)" : meta.bg,
                            color: locked ? "var(--muted-foreground)" : meta.color,
                          }}
                        >
                          {level}
                        </span>
                        <span className="flex-1">{t}</span>
                        {locked && (
                          <span className="inline-flex items-center gap-1 text-xs italic text-muted-foreground">
                            <Lock className="h-3 w-3" /> Beyond scope
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
