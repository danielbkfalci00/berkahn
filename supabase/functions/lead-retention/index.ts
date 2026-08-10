import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "orcamento-pdfs";

Deno.serve(async (request) => {
  if (request.method !== "POST") return response({ error: "method_not_allowed" }, 405);
  const expected = Deno.env.get("RETENTION_CRON_SECRET");
  const received = request.headers.get("x-cron-secret");
  if (!expected || !received || received !== expected) return response({ error: "unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return response({ error: "server_misconfigured" }, 500);
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: candidates, error: candidatesError } = await supabase.rpc("get_lead_retention_candidates");
  if (candidatesError) return response({ error: "candidate_query_failed" }, 500);

  let anonymized = 0;
  let failed = 0;
  let removedObjects = 0;
  for (const candidate of candidates || []) {
    let paths = Array.isArray(candidate.pdf_paths) ? candidate.pdf_paths.filter(Boolean) : [];
    if (candidate.requires_anonymization) {
      const { data: claimedPaths, error: anonymizeError } = await supabase.rpc(
        "anonymize_expired_lead",
        { p_id: candidate.lead_id }
      );
      if (anonymizeError) {
        failed += 1;
        continue;
      }
      paths = Array.isArray(claimedPaths) ? claimedPaths.filter(Boolean) : [];
      anonymized += 1;
    }

    if (paths.length) {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
      if (storageError) {
        failed += 1;
        continue;
      }
      removedObjects += paths.length;
    }

    const { error: cleanupError } = await supabase.rpc("complete_lead_storage_cleanup", {
      p_id: candidate.lead_id,
    });
    if (cleanupError) failed += 1;
  }

  return response({ candidates: candidates?.length || 0, anonymized, failed, removed_objects: removedObjects });
});

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
