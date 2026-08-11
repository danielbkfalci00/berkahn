import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
