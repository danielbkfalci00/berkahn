#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const fileArg = process.argv.find((arg) => arg.startsWith("--file="))?.slice(7);
if (!fileArg) throw new Error("Use --file=C:\\caminho\\leads.csv e --dry-run ou --apply.");
if (!process.argv.includes("--dry-run") && !apply) throw new Error("Informe --dry-run ou --apply.");

const filePath = path.resolve(fileArg);
const repository = process.cwd();
const relative = path.relative(repository, filePath);
const insideRepository = relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
if (insideRepository) {
  throw new Error("O CSV temporário deve permanecer fora do repositório e do vault.");
}

const raw = await readFile(filePath, "utf8");
const fileHash = createHash("sha256").update(raw).digest("hex");
const parsed = Papa.parse(raw, { header: true, skipEmptyLines: "greedy", transformHeader: normalizeKey });
if (parsed.errors.length) throw new Error(`CSV inválido: ${parsed.errors.length} erro(s) de parsing.`);

const aliases = {
  nome: ["nome", "name", "cliente", "nome_do_cliente"],
  email: ["email", "e_mail"],
  telefone: ["telefone", "phone", "celular", "whatsapp"],
  segmento: ["segmento", "segment"],
  mensagem: ["mensagem", "message", "observacao", "observacoes", "nota"],
  canal: ["canal", "channel", "origem"],
  status: ["status", "situacao", "etapa"],
  criado_em: ["criado_em", "created_at", "data_criacao", "data"],
  atualizado_em: ["atualizado_em", "updated_at", "data_atualizacao"],
  tipo_projeto: ["tipo_projeto", "project_type", "tipo_de_projeto"],
  empresa: ["empresa", "company"],
  cargo: ["cargo", "role"],
};

const validStatuses = new Set(["novo", "em_contato", "qualificado", "proposta_enviada", "convertido", "desqualificado"]);
const now = new Date().toISOString();
const counts = new Map();

const rows = parsed.data.map((source, index) => {
  const value = (field) => first(source, aliases[field]);
  const rawStatus = slug(value("status"));
  const knownStatus = validStatuses.has(rawStatus);
  const shouldArchive = Boolean(rawStatus) && !knownStatus;
  const status = knownStatus ? rawStatus : "novo";
  const createdAt = parseDate(value("criado_em")) || now;
  const updatedAt = parseDate(value("atualizado_em")) || createdAt;
  const segment = normalizeSegment(value("segmento"));
  const channel = normalizeChannel(value("canal"));
  counts.set(status, (counts.get(status) || 0) + 1);

  return {
    nome: value("nome") || "Contato legado sem nome",
    email: nullable(value("email").toLowerCase()),
    telefone: nullable(value("telefone")),
    segmento: segment,
    mensagem: nullable(value("mensagem")),
    canal: channel,
    status,
    tipo_projeto: nullable(value("tipo_projeto")),
    empresa: nullable(value("empresa")),
    cargo: nullable(value("cargo")),
    visualizado_em: now,
    arquivado_em: shouldArchive ? now : null,
    qualificado_em: ["qualificado", "proposta_enviada", "convertido"].includes(status) ? updatedAt : null,
    convertido_em: status === "convertido" ? updatedAt : null,
    desqualificado_em: status === "desqualificado" ? updatedAt : null,
    origem_legado: `sheet:${fileHash}:${index + 2}`,
    importado_em: now,
    criado_em: createdAt,
    atualizado_em: updatedAt,
    sheet_sync_status: "sincronizado",
  };
});

const invalidContacts = rows.filter((row) => !row.email && !row.telefone).length;
const archivedUnknownStatuses = rows.filter((row) => row.arquivado_em).length;
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", file_sha256: fileHash, rows: rows.length, invalid_contacts: invalidContacts, archived_unknown_statuses: archivedUnknownStatuses, statuses: Object.fromEntries(counts) }, null, 2));
if (!apply) process.exit(0);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase não configurado no ambiente.");
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

let inserted = 0;
for (let start = 0; start < rows.length; start += 100) {
  const chunk = rows.slice(start, start + 100);
  const { data, error } = await supabase
    .from("leads")
    .upsert(chunk, { onConflict: "origem_legado", ignoreDuplicates: true })
    .select("id");
  if (error) throw new Error(`Falha no lote ${start / 100 + 1} (código ${error.code || "desconhecido"}).`);
  inserted += data?.length || 0;
}
console.log(JSON.stringify({ applied: true, inserted, skipped_existing: rows.length - inserted, file_sha256: fileHash }));

function normalizeKey(value) {
  return slug(value);
}

function slug(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function first(row, names) {
  for (const name of names) {
    const value = row[name];
    if (value !== undefined && String(value).trim()) return String(value).trim();
  }
  return "";
}

function nullable(value) {
  return value ? value : null;
}

function parseDate(value) {
  if (!value) return null;
  const br = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  const date = br
    ? new Date(Date.UTC(Number(br[3]), Number(br[2]) - 1, Number(br[1]), Number(br[4] || 12), Number(br[5] || 0)))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeSegment(value) {
  const normalized = slug(value);
  if (normalized.includes("resid")) return "residencial";
  if (normalized.includes("comerc")) return "comercial";
  return "nao_definido";
}

function normalizeChannel(value) {
  const normalized = slug(value);
  if (normalized.includes("whats")) return "whatsapp";
  if (normalized.includes("telefon") || normalized.includes("ligacao")) return "telefone";
  if (normalized.includes("email")) return "email";
  if (normalized.includes("indic")) return "indicacao";
  if (normalized.includes("form") || !normalized) return "form";
  return "manual";
}
