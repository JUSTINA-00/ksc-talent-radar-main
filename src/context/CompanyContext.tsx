import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "selected-company";

export interface Selection {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  selection: Selection | null;
  selectCompany: (selection: Selection) => void;
  clearCompany: () => void;
}

const Ctx = createContext<CompanyContextValue | null>(null);

function loadSelection(raw: string | null): Selection | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Selection;
    if (
      typeof parsed.companyId === "number" &&
      typeof parsed.companyName === "string" &&
      typeof parsed.logoUrl === "string"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const loaded = loadSelection(raw);
    if (loaded) setSelection(loaded);
  }, []);

  const selectCompany = (selection: Selection) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    setSelection(selection);
  };

  const clearCompany = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelection(null);
  };

  return (
    <Ctx.Provider
      value={{
        selection,
        selectCompany,
        clearCompany,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
