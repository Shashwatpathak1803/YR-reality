import { createContext, useContext, useState, type ReactNode } from "react";

/** Budget label → [min, max] price in rupees. Shared by hero search + site visit form. */
export const BUDGET_RANGES: Record<string, [number, number]> = {
  "Under ₹ 50 Lakh": [0, 50_00_000],
  "₹ 50 Lakh – 1 Cr": [50_00_000, 1_00_00_000],
  "₹ 1 Cr – 3 Cr": [1_00_00_000, 3_00_00_000],
  "Above ₹ 3 Cr": [3_00_00_000, Number.POSITIVE_INFINITY],
};
export const BUDGETS = Object.keys(BUDGET_RANGES);

export const ANY = "All";

export interface SearchFilter {
  type: string;
  location: string;
  budget: string;
}

const SearchFilterContext = createContext<{
  filter: SearchFilter | null;
  setFilter: (f: SearchFilter | null) => void;
}>({ filter: null, setFilter: () => {} });

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<SearchFilter | null>(null);
  return (
    <SearchFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  return useContext(SearchFilterContext);
}
