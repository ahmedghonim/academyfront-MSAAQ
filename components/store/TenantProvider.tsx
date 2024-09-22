"use client";

import { createContext, useContext, useState } from "react";

import { create } from "zustand";

import { Academy, IpInfo } from "@/types";

const createStore = (tenant: Academy, ipInfo: IpInfo | null) =>
  create<{
    tenant: Academy;
    ipInfo: IpInfo | null;
    setTenant: (tenant: Academy) => void;
    setIpInfo: (ipInfo: IpInfo) => void;
  }>((set) => ({
    tenant,
    ipInfo,
    setIpInfo(ipInfo: IpInfo) {
      set({ ipInfo });
    },
    setTenant(tenant: Academy) {
      set({ tenant });
    }
  }));

const TenantContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useTenant = () => {
  if (!TenantContext) throw new Error("useTenant must be used within a TenantProvider");

  return useContext(TenantContext)!;
};

const TenantProvider = ({
  tenant,
  ipInfo,
  children
}: {
  ipInfo: IpInfo | null;
  tenant: Academy;
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createStore(tenant, ipInfo));

  return <TenantContext.Provider value={store}>{children}</TenantContext.Provider>;
};

export default TenantProvider;
