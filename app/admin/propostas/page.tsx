import { redirect } from "next/navigation";

/** Existing bookmarks lead to the available commercial workflow. */
export default function PropostasPage() {
  redirect("/admin/orcamentos");
}
