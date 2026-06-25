import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, memo } from "react";
import { MapPin, Users, TrendingUp, TrendingDown, ArrowRight, Search, X } from "lucide-react";
import { normalizeCompanySummary, CATEGORY_COLOR, isNullish, type CompanySummary } from "@/lib/companyData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { useCompanies } from "@/lib/companyApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KITS Companies Research & Placement Analytics Portal" },
      { name: "description", content: "Your strategic edge for campus placements." },
    ],
  }),
  component: Index,
});

const COLLEGE = "Karunya Institute of Technology and Sciences";
const CATEGORIES = ["All", "Super Dream", "Dream", "Standard", "Regular"] as const;

const Pill = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
    style={{ background: color ?? "#64748b" }}
  >
    {children}
  </span>
);

const Field = ({ value, fallback = "not publicly available" }: { value: string; fallback?: string }) =>
  isNullish(value) ? <span className="italic text-muted-foreground">{fallback}</span> : <span>{value}</span>;

const CompanyCard = memo(function CompanyCard({
  c,
  onSelect,
}: {
  c: ReturnType<typeof normalizeCompanySummary>;
  onSelect: (selection: { companyId: number; companyName: string; logoUrl: string }) => void;
}) {
  const negative = c.yoy_growth_rate.trim().startsWith("-");
  const TrendIcon = negative ? TrendingDown : TrendingUp;
  return (
    <button
      onClick={() => onSelect({ companyId: c.company_id, companyName: c.name, logoUrl: c.logo_url })}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-[#2563eb] hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo name={c.name} url={c.logo_url} size={48} />
        <Pill color={CATEGORY_COLOR[c.company_type]}>{c.company_type || "—"}</Pill>
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">{c.name}</h3>
        <p className="text-xs text-muted-foreground">{c.short_name}</p>
      </div>
      <dl className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /><Field value={c.headquarters_address} /></div>
        <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /><Field value={c.employee_size} /></div>
        <div className="flex items-center gap-2">
          <TrendIcon className={`h-3.5 w-3.5 ${negative ? "text-destructive" : "text-[#16a34a]"}`} />
          <span className={negative ? "text-destructive" : ""}>
            <Field value={c.yoy_growth_rate} /> YoY
          </span>
        </div>
      </dl>
      <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[#2563eb]" />
    </button>
  );
});

function Index() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const { data: companies, isLoading, isError, refetch } = useCompanies();

  const allCompanies = useMemo<CompanySummary[]>(() => companies ?? [], [companies]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: allCompanies.length };
    for (const c of allCompanies) m[c.company_type] = (m[c.company_type] ?? 0) + 1;
    return m;
  }, [allCompanies]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allCompanies.filter(
      (c) =>
        (cat === "All" || c.company_type === cat) &&
        (!term || c.name.toLowerCase().includes(term) || c.short_name.toLowerCase().includes(term))
    );
  }, [allCompanies, q, cat]);

  const handleSelect = (selection: { companyId: number; companyName: string; logoUrl: string }) => {
    selectCompany(selection);
    navigate({ to: "/company/intelligence" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            KITS · INTELLIGENCE PLATFORM
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {COLLEGE} Companies Research & Placement Analytics Portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your strategic edge for campus placements
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search companies..."
              className="pl-9 pr-9 h-11"
            />
            {q && (
              <button
                aria-label="Clear"
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Loading companies…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Unable to load companies.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = cat === c;
                const color = c === "All" ? "#0f172a" : CATEGORY_COLOR[c];
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-transparent text-white"
                        : "border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                    style={active ? { background: color } : undefined}
                  >
                    <span>{c}</span>
                    <span className={`rounded-full px-1.5 text-[10px] ${active ? "bg-white/20" : "bg-secondary text-muted-foreground"}`}>
                      {counts[c] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                <p className="text-sm text-muted-foreground">No companies match your filters.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setQ(""); setCat("All"); }}>
                  Reset
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.map((c) => (
                  <CompanyCard key={c.company_id} c={c} onSelect={handleSelect} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
