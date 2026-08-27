#!/usr/bin/env node
/**
 * vault-validate.mjs - Sprint 3.5 linter de completude do vault
 *
 * Validacoes de frontmatter, taxonomia, wikilinks e pendencias.
 * Exit codes: 0 OK, 1 ERROR, 2 WARN-only.
 *
 * Uso:
 *   node scripts/vault-validate.mjs
 *   node scripts/vault-validate.mjs --type=projeto
 *   node scripts/vault-validate.mjs --json
 *   node scripts/vault-validate.mjs --quiet
 *   node scripts/vault-validate.mjs --fix-suggestions
 *   node scripts/vault-validate.mjs --single Berkahn-Vault/00-meta/MOC.md
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const VAULT = path.join(ROOT, 'Berkahn-Vault');
const LINTER_CFG = path.join(VAULT, '.obsidian', 'plugins', 'obsidian-linter', 'data.json');

function parseArgs(args) {
  const flags = { json: false, quiet: false, fixSuggestions: false, type: undefined, single: undefined };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') flags.json = true;
    else if (arg === '--quiet') flags.quiet = true;
    else if (arg === '--fix-suggestions') flags.fixSuggestions = true;
    else if (arg.startsWith('--type=')) flags.type = arg.slice(7);
    else if (arg.startsWith('--single=')) flags.single = arg.slice(9);
    else if (arg === '--single') {
      flags.single = args[++i];
      if (!flags.single || flags.single.startsWith('--')) throw new Error('--single exige o caminho de uma nota');
    } else {
      throw new Error(`argumento desconhecido: ${arg}`);
    }
  }
  if (flags.type && flags.single) throw new Error('--type e --single nao podem ser usados juntos');
  return flags;
}

let FLAGS;
try {
  FLAGS = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const VALID_TYPES = new Set([
  'memory', 'prompt', 'context', 'atomic', 'draft-content', 'meta',
  'projeto', 'indice', 'auditoria', 'pesquisa', 'legal', 'site-copy',
  'apresentacao', 'linkedin-post', 'daily', 'documentacao',
]);
const VALID_STATUS = new Set(['draft', 'active', 'review', 'published', 'archived', 'locked', 'stale']);
const VALID_TAG_ROOTS = new Set(['domain', 'project', 'status', 'ai', 'source', 'tipo']);
const SKIP_DIRS = new Set(['.obsidian', '.trash', 'node_modules', '.git', '.claude', '91-templates', '99-archive']);
const INDEX_SKIP_DIRS = new Set(['.obsidian', '.trash', 'node_modules', '.git', '.claude']);
// 91-templates skipado: arquivos Templater começam com <%* ... %> em vez de YAML
// 99-archive skipado: arquivos legacy preservados como-foram

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m',
  cyan: '\x1b[36m', gray: '\x1b[90m',
};

let canonicalOrder = [];

async function loadLinterOrder() {
  let cfg;
  try {
    cfg = JSON.parse(await fs.readFile(LINTER_CFG, 'utf-8'));
  } catch (error) {
    throw new Error(`config do Obsidian Linter invalida (${relativePath(LINTER_CFG)}): ${error.message}`);
  }
  const yamlSort = cfg.ruleConfigs?.['yaml-key-sort'];
  if (yamlSort?.enabled !== true) throw new Error('regra yaml-key-sort do Obsidian Linter esta desativada');
  const orderStr = yamlSort['yaml-key-priority-sort-order'];
  if (typeof orderStr !== 'string' || !orderStr.trim()) throw new Error('ordem canonica do Obsidian Linter esta vazia');
  canonicalOrder = orderStr.split('\n').map(key => key.trim()).filter(Boolean);
  const requiredOrderKeys = ['tipo', 'criado', 'atualizado', 'tags', 'ai_summary', 'status'];
  const missingRequired = requiredOrderKeys.filter(key => !canonicalOrder.includes(key));
  if (missingRequired.length) throw new Error(`ordem canonica nao cobre keys obrigatorias: ${missingRequired.join(', ')}`);
  const duplicates = canonicalOrder.filter((key, index) => canonicalOrder.indexOf(key) !== index);
  if (duplicates.length) throw new Error(`ordem canonica tem keys duplicadas: ${[...new Set(duplicates)].join(', ')}`);
}

function parseFm(content) {
  // Normaliza CRLF -> LF para parser consistente
  const norm = content.replace(/\r\n/g, '\n');
  if (!norm.startsWith('---\n')) return { fm: {}, body: norm, yaml: '', keys: [], hadYaml: false };
  const end = norm.indexOf('\n---\n', 4);
  if (end === -1) return { fm: {}, body: norm, yaml: '', keys: [], hadYaml: false };
  const yaml = norm.slice(4, end);
  const body = norm.slice(end + 5);
  const fm = {};
  const keys = [];
  let currentArrayKey = null;
  for (const line of yaml.split('\n')) {
    if (!line.trim()) continue;
    if (/^\s+-\s/.test(line) && currentArrayKey) {
      fm[currentArrayKey].push(line.replace(/^\s+-\s/, '').trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) { currentArrayKey = null; continue; }
    const key = m[1];
    let val = m[2].trim();
    keys.push(key);
    if (val === '') { fm[key] = []; currentArrayKey = key; continue; }
    if (val.startsWith('[') && val.endsWith(']')) {
      fm[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      fm[key] = val.replace(/^["']|["']$/g, '');
    }
    currentArrayKey = null;
  }
  return { fm, body, yaml, keys, hadYaml: true };
}

async function walk(dir, markdownOnly = true) {
  const out = [];
  const ents = await fs.readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    if ((markdownOnly ? SKIP_DIRS : INDEX_SKIP_DIRS).has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(full, markdownOnly));
    else if (e.isFile() && (!markdownOnly || e.name.endsWith('.md'))) out.push(full);
  }
  return out;
}

function relativePath(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function isEmptyValue(value) {
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || String(value).trim() === '';
}

function validate(file, parsed) {
  const { fm, body, keys, hadYaml } = parsed;
  const issues = [];
  const rel = relativePath(file);

  // 1. Frontmatter minimo
  if (!hadYaml) {
    issues.push({ rule: 1, severity: 'ERROR', file: rel, msg: 'sem frontmatter YAML', fix: 'adicionar bloco --- tipo: ... --- no topo' });
    return issues;
  }
  for (const required of ['tipo', 'criado', 'atualizado', 'tags', 'ai_summary', 'status']) {
    if (!(required in fm)) {
      issues.push({ rule: 1, severity: 'ERROR', file: rel, msg: `campo obrigatorio '${required}' ausente`, fix: `adicionar '${required}:' ao frontmatter` });
    } else if (isEmptyValue(fm[required])) {
      issues.push({ rule: 1, severity: 'ERROR', file: rel, msg: `campo obrigatorio '${required}' vazio`, fix: `preencher '${required}' com valor canonico` });
    }
  }
  for (const dateKey of ['criado', 'atualizado']) {
    if (!isEmptyValue(fm[dateKey]) && !/^\d{4}-\d{2}-\d{2}$/.test(String(fm[dateKey]))) {
      issues.push({ rule: 1, severity: 'ERROR', file: rel, msg: `campo '${dateKey}' fora de YYYY-MM-DD`, fix: `normalizar '${dateKey}'` });
    }
  }

  // 2. Ordem canonica
  if (canonicalOrder.length) {
    const presentInOrder = keys.filter(k => canonicalOrder.includes(k));
    const expectedOrder = canonicalOrder.filter(k => keys.includes(k));
    for (let i = 0; i < presentInOrder.length; i++) {
      if (presentInOrder[i] !== expectedOrder[i]) {
        issues.push({ rule: 2, severity: 'WARN', file: rel, msg: `ordem keys: '${presentInOrder[i]}' deveria estar em posicao '${expectedOrder[i]}'`, fix: 'abrir no Obsidian -> linter auto-reordena' });
        break;
      }
    }
    const unknownKeys = keys.filter(k => !canonicalOrder.includes(k) && !k.startsWith('kpi_'));
    if (unknownKeys.length) {
      issues.push({ rule: 2, severity: 'WARN', file: rel, msg: `keys fora da ordem canonica: ${unknownKeys.join(', ')}`, fix: 'adicionar essas keys a yaml-key-priority-sort-order no data.json do linter' });
    }
  }

  // 3. Tags root validos
  if ('tags' in fm && !Array.isArray(fm.tags)) {
    issues.push({ rule: 3, severity: 'ERROR', file: rel, msg: 'tags deve ser array YAML', fix: 'usar tags em lista multi-line' });
  } else if (Array.isArray(fm.tags)) {
    for (const t of fm.tags) {
      const root = t.split('/')[0];
      if (!VALID_TAG_ROOTS.has(root)) {
        issues.push({ rule: 3, severity: 'ERROR', file: rel, msg: `tag root '${root}' invalido`, fix: `usar uma das raizes: ${[...VALID_TAG_ROOTS].join(', ')}` });
      }
    }
  }

  // 4. Status valido
  if (fm.status && !VALID_STATUS.has(fm.status)) {
    issues.push({ rule: 4, severity: 'ERROR', file: rel, msg: `status '${fm.status}' invalido`, fix: `mudar para: ${[...VALID_STATUS].join(', ')}` });
  }

  // 5. Tipo valido
  if (fm.tipo && !VALID_TYPES.has(fm.tipo)) {
    issues.push({ rule: 5, severity: 'ERROR', file: rel, msg: `tipo '${fm.tipo}' invalido`, fix: `mudar para: ${[...VALID_TYPES].join(', ')}` });
  }

  // 6. Tipo-especifico
  if (fm.tipo === 'draft-content' && fm.status === 'published' && !fm.url_final) {
    issues.push({ rule: 6, severity: 'ERROR', file: rel, msg: 'draft-content published sem url_final', fix: 'adicionar url_final: https://www.berkahn.com.br/atualidades/<slug>' });
  }
  if (fm.tipo === 'atomic' && !fm.ai_summary) {
    issues.push({ rule: 6, severity: 'ERROR', file: rel, msg: 'atomic note sem ai_summary', fix: 'adicionar ai_summary: <1-3 linhas>' });
  }
  if (fm.tipo === 'projeto') {
    const kpiKeys = Object.keys(fm).filter(k => k.startsWith('kpi_'));
    if (kpiKeys.length < 2) {
      issues.push({ rule: 6, severity: 'ERROR', file: rel, msg: `projeto com ${kpiKeys.length} kpi_* (minimo 2)`, fix: 'adicionar pelo menos 2 campos kpi_<nome>: <valor>' });
    }
  }
  if (fm.locked === 'true' || fm.locked === true) {
    const hasLockTag = Array.isArray(fm.tags) && fm.tags.some(t => t === 'ai/locked');
    if (!hasLockTag) {
      issues.push({ rule: 6, severity: 'WARN', file: rel, msg: 'locked: true sem tag ai/locked', fix: 'adicionar "ai/locked" as tags' });
    }
  }

  // 7. Sintaxe das pendencias que alimentam MOC_Pendencias
  for (const line of stripCode(body).split('\n')) {
    if (!line.includes('#pendencia')) continue;
    if (!/^- \[ \] @\S+ .+ #pendencia\s*$/.test(line)) {
      issues.push({ rule: 7, severity: 'ERROR', file: rel, msg: `pendencia fora da sintaxe canonica: ${line.trim()}`, fix: 'usar - [ ] @responsavel ... #pendencia' });
    }
  }

  // 8. Campos novos Sprint 2.4
  if (fm.tipo === 'draft-content') {
    if (!fm.contextos_aplicados || (Array.isArray(fm.contextos_aplicados) && fm.contextos_aplicados.length === 0)) {
      issues.push({ rule: 8, severity: 'WARN', file: rel, msg: 'draft-content sem contextos_aplicados', fix: 'adicionar contextos_aplicados: [berkahn-brand, seo-aeo-strategy, article-pipeline]' });
    }
  }
  if (fm.tipo === 'atomic') {
    if (!('usado_em' in fm)) {
      issues.push({ rule: 8, severity: 'WARN', file: rel, msg: 'atomic sem campo usado_em (pode ser [] mas deve existir)', fix: 'adicionar usado_em: []' });
    }
    if (!('origem_pesquisa' in fm)) {
      issues.push({ rule: 8, severity: 'WARN', file: rel, msg: 'atomic sem campo origem_pesquisa', fix: 'adicionar origem_pesquisa: ""' });
    }
  }

  return issues;
}

function stripCode(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '');
}

function extractWikilinks(body) {
  const links = [];
  const seen = new Set();
  const regex = /!?\[\[([^\]\n]+)\]\]/g;
  let match;
  const searchable = stripCode(body);
  while ((match = regex.exec(searchable)) !== null) {
    const raw = match[1].split('|', 1)[0].trim().replace(/\\$/, '');
    const hashAt = raw.indexOf('#');
    const target = (hashAt === -1 ? raw : raw.slice(0, hashAt)).trim();
    const anchor = hashAt === -1 ? '' : raw.slice(hashAt + 1).trim();
    const key = `${target}#${anchor}`;
    if (!seen.has(key)) links.push({ raw: match[0], target, anchor });
    seen.add(key);
  }
  return links;
}

function normalizeHeading(value) {
  return value
    .replace(/[*_~`]/g, '')
    .replace(/\s+#+\s*$/, '')
    .trim()
    .toLocaleLowerCase('pt-BR');
}

function headingsAndBlocks(content) {
  const headings = new Set();
  const blocks = new Set();
  for (const line of stripCode(content).split('\n')) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading) headings.add(normalizeHeading(heading[1]));
    for (const block of line.matchAll(/\^([a-zA-Z0-9-]+)(?:\s|$)/g)) blocks.add(block[1]);
  }
  return { headings, blocks };
}

function vaultRelative(file) {
  return path.relative(VAULT, file).replace(/\\/g, '/');
}

function buildLinkIndex(allFiles) {
  const exact = new Map();
  const markdownByBase = new Map();
  const anyByName = new Map();
  for (const file of allFiles) {
    const rel = vaultRelative(file).toLocaleLowerCase('pt-BR');
    exact.set(rel, file);
    const fileName = path.basename(file).toLocaleLowerCase('pt-BR');
    const sameName = anyByName.get(fileName) || [];
    sameName.push(file);
    anyByName.set(fileName, sameName);
    if (file.endsWith('.md')) {
      exact.set(rel.slice(0, -3), file);
      const base = path.basename(file, '.md').toLocaleLowerCase('pt-BR');
      const matches = markdownByBase.get(base) || [];
      matches.push(file);
      markdownByBase.set(base, matches);
    }
  }
  return { exact, markdownByBase, anyByName };
}

function resolveWikilink(source, target, index) {
  if (!target) return [source];
  const normalized = target.replace(/\\/g, '/').replace(/^\.\//, '');
  if (/^[a-z]+:\/\//i.test(normalized)) return [];
  const hitsFor = values => {
    const hits = [];
    for (const value of values) {
      const hit = index.exact.get(value.toLocaleLowerCase('pt-BR'));
      if (hit && !hits.includes(hit)) hits.push(hit);
    }
    return hits;
  };
  const direct = hitsFor([normalized, `${normalized}.md`]);
  if (direct.length) return direct;
  const sourceRelative = path.relative(VAULT, path.resolve(path.dirname(source), normalized)).replace(/\\/g, '/');
  if (!sourceRelative.startsWith('../')) {
    const local = hitsFor([sourceRelative, `${sourceRelative}.md`]);
    if (local.length) return local;
  }
  const candidates = [];
  const addCandidate = hit => {
    if (hit && !candidates.includes(hit)) candidates.push(hit);
  };
  if (!normalized.includes('/')) {
    for (const hit of index.anyByName.get(normalized.toLocaleLowerCase('pt-BR')) || []) addCandidate(hit);
    if (candidates.length) return candidates;
    for (const hit of index.markdownByBase.get(normalized.toLocaleLowerCase('pt-BR')) || []) addCandidate(hit);
  }
  return candidates;
}

async function validateWikilinks(files, allFiles, parsedByFile) {
  const issues = [];
  const index = buildLinkIndex(allFiles);
  const contentCache = new Map();
  for (const file of files) {
    const parsed = parsedByFile.get(file);
    for (const link of extractWikilinks(`${parsed.yaml}\n${parsed.body}`)) {
      const matches = resolveWikilink(file, link.target, index);
      if (matches.length === 0) {
        issues.push({ rule: 10, severity: 'ERROR', file: relativePath(file), msg: `wikilink nao resolvido: ${link.raw}`, fix: 'apontar para nota existente ou usar code span se for exemplo literal' });
        continue;
      }
      if (matches.length > 1) {
        issues.push({ rule: 10, severity: 'ERROR', file: relativePath(file), msg: `wikilink ambiguo: ${link.raw}`, fix: 'usar o path relativo da nota' });
        continue;
      }
      if (!link.anchor || !matches[0].endsWith('.md')) continue;
      let targetContent = contentCache.get(matches[0]);
      if (!targetContent) {
        targetContent = await fs.readFile(matches[0], 'utf-8');
        contentCache.set(matches[0], targetContent);
      }
      const { headings, blocks } = headingsAndBlocks(targetContent);
      const exists = link.anchor.startsWith('^')
        ? blocks.has(link.anchor.slice(1))
        : headings.has(normalizeHeading(link.anchor));
      if (!exists) {
        issues.push({ rule: 10, severity: 'ERROR', file: relativePath(file), msg: `anchor nao resolvido: ${link.raw}`, fix: 'corrigir o heading/block de destino' });
      }
    }
  }
  return issues;
}

async function resolveSingle(single) {
  if (!single) return null;
  const attempts = path.isAbsolute(single)
    ? [path.resolve(single)]
    : [path.resolve(ROOT, single), path.resolve(VAULT, single)];
  for (const candidate of attempts) {
    const relative = path.relative(VAULT, candidate);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !candidate.endsWith('.md')) continue;
    try {
      if ((await fs.stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  throw new Error(`--single nao encontrou uma nota dentro do vault: ${single}`);
}

async function validateIndices(files) {
  const issues = [];
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { fm } = parseFm(content);
    if (fm.tipo !== 'indice') continue;
    if (!fm.path_externo) {
      issues.push({ rule: 9, severity: 'WARN', file: relativePath(file), msg: 'indice sem path_externo', fix: 'adicionar path_externo: <path relativo>' });
      continue;
    }
    const fileDir = path.dirname(file);
    const externalPath = path.resolve(fileDir, fm.path_externo);
    try {
      const stat = await fs.stat(externalPath);
      if (!stat.isDirectory()) {
        issues.push({ rule: 9, severity: 'WARN', file: relativePath(file), msg: `path_externo aponta para arquivo: ${fm.path_externo}` });
      }
    } catch {
      issues.push({ rule: 9, severity: 'WARN', file: relativePath(file), msg: `path_externo nao existe: ${fm.path_externo}`, fix: 'verificar se diretorio foi movido' });
    }
  }
  return issues;
}

function printIssue(issue) {
  if (FLAGS.quiet && issue.severity !== 'ERROR') return;
  const sevColor = issue.severity === 'ERROR' ? C.red : C.yellow;
  const sevTag = `${sevColor}${C.bold}[${issue.severity}]${C.reset}`;
  const ruleTag = `${C.dim}(R${issue.rule})${C.reset}`;
  console.log(`${sevTag} ${ruleTag} ${C.cyan}${issue.file}${C.reset}: ${issue.msg}`);
  if (FLAGS.fixSuggestions && issue.fix) {
    console.log(`  ${C.gray}-> fix: ${issue.fix}${C.reset}`);
  }
}

async function main() {
  await loadLinterOrder();
  if (FLAGS.type && !VALID_TYPES.has(FLAGS.type)) throw new Error(`tipo desconhecido em --type: ${FLAGS.type}`);
  const singleFile = await resolveSingle(FLAGS.single);
  if (!FLAGS.json) {
    console.log(`${C.bold}vault-validate.mjs${C.reset}`);
    console.log(`   Source: ${VAULT}`);
    if (FLAGS.type) console.log(`   Filter: tipo == "${FLAGS.type}"`);
    if (singleFile) console.log(`   Single: ${relativePath(singleFile)}`);
    console.log(`   Linter order: ${canonicalOrder.length} keys carregadas`);
    console.log('');
  }

  const allFiles = await walk(VAULT);
  const allVaultFiles = await walk(VAULT, false);
  const filesToValidate = singleFile ? [singleFile] : allFiles;
  let scanned = 0;
  let issues = [];
  const parsedByFile = new Map();

  for (const file of filesToValidate) {
    const content = await fs.readFile(file, 'utf-8');
    const parsed = parseFm(content);
    if (FLAGS.type && parsed.fm.tipo !== FLAGS.type) continue;
    parsedByFile.set(file, parsed);
    scanned++;
    issues.push(...validate(file, parsed));
  }

  const selectedFiles = [...parsedByFile.keys()];
  issues.push(...await validateIndices(selectedFiles));
  issues.push(...await validateWikilinks(selectedFiles, allVaultFiles, parsedByFile));

  if (!singleFile && !FLAGS.type) {
    const mocPath = path.join(VAULT, '00-meta', 'MOC.md');
    const moc = await fs.readFile(mocPath, 'utf-8');
    if (!/^## MOC_Pendencias\s*$/m.test(moc) || !/tag:#pendencia/.test(moc)) {
      issues.push({ rule: 11, severity: 'ERROR', file: relativePath(mocPath), msg: 'MOC_Pendencias ou query tag:#pendencia ausente', fix: 'restaurar a secao agregadora no MOC' });
    }
  }

  const errors = issues.filter(i => i.severity === 'ERROR');
  const warns = issues.filter(i => i.severity === 'WARN');

  if (FLAGS.json) {
    console.log(JSON.stringify({ scanned, errors: errors.length, warns: warns.length, issues }, null, 2));
  } else {
    if (issues.length === 0) {
      console.log(`${C.green}${C.bold}OK${C.reset} - ${scanned} notas validadas, 0 issues`);
    } else {
      issues.sort((a, b) => a.file.localeCompare(b.file));
      issues.forEach(printIssue);
      console.log('');
      console.log(`${C.bold}Resumo:${C.reset} ${scanned} notas escaneadas`);
      console.log(`   ${C.red}${errors.length} ERRORs${C.reset}`);
      console.log(`   ${C.yellow}${warns.length} WARNs${C.reset}`);
      if (!FLAGS.fixSuggestions && issues.length > 0) {
        console.log(`   ${C.gray}rodar com --fix-suggestions para ver como corrigir${C.reset}`);
      }
    }
  }

  process.exit(errors.length > 0 ? 1 : warns.length > 0 ? 2 : 0);
}

main().catch(e => {
  if (FLAGS?.json) console.error(JSON.stringify({ error: e.message }));
  else console.error(C.red + e.message + C.reset);
  process.exit(1);
});
