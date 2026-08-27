import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { getAdminSession } from "@/lib/supabase/sessao";

export const metadata: Metadata = {
  title: "Admin | Berkahn",
  description: "Painel administrativo Berkahn",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Berkahn Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/images/logo/icon-192x192.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  return <AdminLayoutClient membership={session?.membership ?? null}>{children}</AdminLayoutClient>;
}
