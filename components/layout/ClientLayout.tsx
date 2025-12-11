"use client";

import { MenuProvider } from "@/components/providers/MenuProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      <Header />
      <Sidebar />
      <main className="pt-20">{children}</main>
    </MenuProvider>
  );
}
