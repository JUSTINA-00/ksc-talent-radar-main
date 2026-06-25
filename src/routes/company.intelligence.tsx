import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, memo } from "react";
import { ExternalLink, Linkedin } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/CompanyLogo";
import { buildIntelligenceSections, type SectionDef, type FieldDef } from "@/data/intelligenceData";
import { asString, isNullish, splitItems, type CompanyProfile } from "@/lib/companyData";
import { useCompanyProfile, type CompanyProfileData } from "@/lib/companyApi";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({ meta: [{ title: "Company Intelligence — KITS" }] }),
  component: CompanyIntelligence,
});

function renderValue(label: string, raw: unknown) {
  const v = asString(raw);
  if (isNullish(v))
    return (
      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs italic text-muted-foreground">
        Not Available
      </span>
    );

  if (/^https?:\/\//i.test(v)) {
    if (/youtube\.com|youtu\.be|vimeo\.com/.test(v)) {
      return (
        <a href={v} target="_blank" rel="noreferrer" className="text-[#2563eb] underline break-all">
          ▶ {v}
        </a>
      );
    }
    return (
      <a href={v} target="_blank" rel="noreferrer" className="text-[#2563eb] underline break-all">
        {v}
      </a>
    );
  }

  if (/rating|score|nps/i.test(label)) {
    return <span className="font-medium">{v}</span>;
  }

  if (/[;•\n]/.test(v) || (v.includes(",") && v.length > 60)) {
    const items = splitItems(v.includes(";") || v.includes("•") || v.includes("\n") ? v : v.replace(/,\s*/g, "; "));
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span key={i} className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground">
            {it}
          </span>
        ))}
      </div>
    );
  }

  if (v.length > 160) {
    return <p className="leading-relaxed text-sm text-foreground">{v}</p>;
  }
  return <span className="text-sm text-foreground">{v}</span>;
}

const FieldRow = memo(function FieldRow({ field, value }: { field: FieldDef; value: unknown }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-1/3">
        {field.label}
      </dt>
      <dd className="sm:w-2/3">{renderValue(field.label, value)}</dd>
    </div>
  );
});

const SectionCard = memo(function SectionCard({
  section, profile, idx,
}: { section: SectionDef; profile: Record<string, unknown>; idx: number }) {
  const { Icon } = section;
  return (
    <section
      id={`sec-${idx}`}
      data-section-idx={idx}
      className="scroll-mt-32 rounded-xl border border-border bg-card p-5"
    >
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#2563eb]" />
          <h2 className="font-heading text-lg font-semibold text-foreground">{section.title}</h2>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {section.fields.length}
        </span>
      </header>
      <dl>
        {section.fields.map((f) => (
          <FieldRow key={f.key} field={f} value={profile[f.key]} />
        ))}
      </dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { selection } = useCompany();
  const { data, isLoading, isError, refetch } = useCompanyProfile(selection?.companyId);
  const profileData = data as CompanyProfileData | null;
  const summary = profileData?.summary;
  const profile = profileData?.profile;
  const sections = useMemo(() => buildIntelligenceSections(profile ?? undefined), [profile]);
  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.sectionIdx);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.5] }
    );
    sections.forEach((_, i) => {
      const el = document.getElementById(`sec-${i}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    const el = tabs.querySelector<HTMLElement>(`[data-tab-idx="${active}"]`);
    if (el) tabs.scrollTo({ left: el.offsetLeft - tabs.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const scrollToSection = (idx: number) => {
    isScrollingRef.current = true;
    setActive(idx);
    const el = document.getElementById(`sec-${idx}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  };

  if (!selection || isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading company…</div>;
  }

  if (isError || !summary || !profile) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        <div>Unable to load company details.</div>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyLogo name={summary.name} url={summary.logo_url} size={40} />
            <div className="min-w-0">
              <h1 className="truncate font-heading text-base font-semibold text-foreground">
                {summary.name}
              </h1>
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                {summary.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {summary.website_url && !isNullish(summary.website_url) && (
              <Button asChild size="sm" variant="outline">
                <a href={summary.website_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1 h-3.5 w-3.5" /> Website
                </a>
              </Button>
            )}
            {summary.linkedin_url && !isNullish(summary.linkedin_url) && (
              <Button asChild size="sm" variant="outline">
                <a href={summary.linkedin_url} target="_blank" rel="noreferrer">
                  <Linkedin className="mr-1 h-3.5 w-3.5" /> LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>
        <div
          ref={tabsRef}
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto border-t border-border px-4 py-2 scrollbar-thin"
        >
          {sections.map((s, i) => (
            <button
              key={s.id}
              data-tab-idx={i}
              onClick={() => scrollToSection(i)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                active === i
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        {sections.map((s, i) => (
          <SectionCard
            key={s.id}
            section={s}
            profile={profile as Record<string, unknown>}
            idx={i}
          />
        ))}
      </div>
    </div>
  );
}
