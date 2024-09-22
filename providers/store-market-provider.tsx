"use client";

import React, { useMemo } from "react";

import { Category } from "@/types";

export interface SessionProviderProps {
  children: React.ReactNode;
  taxonomies?: Category[];
  difficulties?: Category[];
}

export const MarketContext = React.createContext?.<{
  taxonomies?: Category[];
  difficulties?: Category[];
}>({} as { taxonomies?: Category[]; difficulties?: Category[] });

export function useMarket() {
  if (!MarketContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = React.useContext(MarketContext);

  return value;
}

export function MarketProvider({ taxonomies, difficulties, children }: SessionProviderProps) {
  if (!MarketContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = useMemo(() => ({ taxonomies, difficulties }), [taxonomies, difficulties]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
