"use client";

import { createContext, useContext } from "react";

const WhatsAppNumberContext = createContext<string | null>(null);

export function WhatsAppNumberProvider({
  number,
  children,
}: {
  number: string | null;
  children: React.ReactNode;
}) {
  return (
    <WhatsAppNumberContext.Provider value={number}>
      {children}
    </WhatsAppNumberContext.Provider>
  );
}

export function useWhatsAppNumber() {
  return useContext(WhatsAppNumberContext);
}
