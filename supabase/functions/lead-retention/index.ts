import { createClient } from "npm:@supabase/supabase-js@2";

const BUDGET_BUCKET = "orcamento-pdfs";

Deno.serve(async (request) => {
  if (request.method !== "POST") return response({ error: "method_not_allowed" }, 405);
  const expected = Deno.env.get("RETENTION_CRON_SECRET");
  const received = request.headers.get("x-cron-secret");
  if (!expected || !received || !(await safeEqual(received, expected))) return response({ error: "unauthorized" }, 401);

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
      const { error: storageError } = await supabase.storage.from(BUDGET_BUCKET).remove(paths);
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

  const { data: queuedObjects, error: queueError } = await supabase
    .from("lead_storage_cleanup")
    .select("id,bucket,path,tentativas")
    .order("criado_em")
    .limit(500);
  if (queueError) return response({ error: "storage_queue_query_failed", anonymized, failed }, 500);

  for (const item of queuedObjects || []) {
    const { error: storageError } = await supabase.storage.from(item.bucket).remove([item.path]);
    if (storageError) {
      failed += 1;
      await supabase
        .from("lead_storage_cleanup")
        .update({
          tentativas: item.tentativas + 1,
          ultimo_erro: storageError.message.slice(0, 500),
        })
        .eq("id", item.id);
      continue;
    }
    const { error: deleteError } = await supabase
      .from("lead_storage_cleanup")
      .delete()
      .eq("id", item.id);
    if (deleteError) {
      failed += 1;
      continue;
    }
    removedObjects += 1;
  }

  return response({
    candidates: candidates?.length || 0,
    queued_objects: queuedObjects?.length || 0,
    anonymized,
    failed,
    removed_objects: removedObjects,
  });
});

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

// Compara digests SHA-256 de tamanho fixo byte a byte, sem retorno antecipado:
// o tempo não revela quantos caracteres do segredo o chamador acertou.
async function safeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [digestA, digestB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const bytesA = new Uint8Array(digestA);
  const bytesB = new Uint8Array(digestB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}
