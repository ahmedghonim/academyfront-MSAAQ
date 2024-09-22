"use client";

import React, { useMemo } from "react";

import { logout } from "@/lib/auth";
import { Member } from "@/types";

type Session = { token: string; member: Member; expires: Date; logout: () => void };

export interface SessionProviderProps {
  children: React.ReactNode;
  session: Session;
}

export const SessionContext = React.createContext?.<Session>({} as Session);

export function useSession() {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = React.useContext(SessionContext);

  return value;
}

export function SessionProvider({ session, children }: SessionProviderProps) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = useMemo(() => {
    if (!session) return {} as Session;

    return {
      ...session,
      logout: logout
    };
  }, [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
