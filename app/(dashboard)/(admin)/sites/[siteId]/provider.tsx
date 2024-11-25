"use client";

import { createContext, useContext, ReactNode } from "react";

const useContextValue = (value: any) => {
  return {
    ...value,
  };
};

export const editSiteContext = createContext<any>({
  id: "",
});

export const useEditSiteContext = () => {
  return useContext(editSiteContext);
};

export default function EditSiteProvider({
  value,
  children,
}: {
  value: any;
  children: ReactNode;
}) {
  const contextValue = useContextValue(value);
  return (
    <editSiteContext.Provider value={contextValue}>
      {children}
    </editSiteContext.Provider>
  );
}
