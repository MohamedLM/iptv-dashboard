"use client";
import { createContext, useContext, ReactNode } from "react";

export type SiteData = {
  id: string | null;
  name: string | null;
  role?: string;
};

interface SiteContext {
  activeSite: SiteData;
}

const useContextValue = (value: any) => {

  return {
    ...value,
  };
};

export const siteContext = createContext<SiteContext>({
  activeSite: {
    id: "",
    name: "",
    role: "",
  },
});

export const useSiteContext = () => {
  return useContext(siteContext);
};

export default function SiteProvider({
  value,
  children,
}: {
  value: {
    activeSite: SiteData;
  };
  children: ReactNode;
}) {
  const contextValue = useContextValue(value);
  return <siteContext.Provider value={contextValue}>{children}</siteContext.Provider>;
}
