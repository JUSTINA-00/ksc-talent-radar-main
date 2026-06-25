import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: CompanyLayout,
});

function CompanyLayout() {
  const { selection } = useCompany();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname === "/company") {
      navigate({ to: "/company/intelligence", replace: true });
    }
  }, [pathname, navigate]);

  // Wait briefly for context to hydrate from localStorage; if still missing, send home.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!selection && typeof window !== "undefined" && !localStorage.getItem("selected-company")) {
        navigate({ to: "/" });
      }
    }, 50);
    return () => clearTimeout(t);
  }, [selection, navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-12 items-center gap-3 border-b border-border bg-card px-3">
            <SidebarTrigger />
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Companies</Link>
              <span>/</span>
              <span className="font-medium text-foreground">{selection?.companyName ?? "—"}</span>
            </nav>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
