import { notFound } from "next/navigation";
import { HARNESS_HABILITADO, DOCS_HARNESS } from "@/lib/documentacoes/harness";
import { HarnessPonte } from "./HarnessPonte";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Harness da ponte de comentários",
  robots: { index: false, follow: false },
};

export default function HarnessPage() {
  if (!HARNESS_HABILITADO) notFound();
  return <HarnessPonte docs={[...DOCS_HARNESS]} />;
}
