#!/usr/bin/env node
/**
 * vault-validate.mjs - Sprint 3.5 linter de completude do vault
 *
 * 9 validacoes com severidade ERROR/WARN. Exit codes: 0 OK, 1 ERROR, 2 WARN-only.
 *
 * Uso:
 *   node scripts/vault-validate.mjs
 *   node scripts/vault-validate.mjs --type=projeto
 *   node scripts/vault-validate.mjs --json
 *   node scripts/vault-validate.mjs --quiet
 *   node scripts/vault-validate.mjs --fix-suggestions
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const VAULT = path.join(ROOT, 'Berkahn-Vault');
const LINTER_CFG = path.join(VAULT, '.obsidian', 'plugins', 'obsidian-linter', 'data.json');

const ARGS = process.argv.slice(2);
const FLAGS = {
  json: ARGS.includes('--json'),
  quiet: ARGS.includes('--quiet'),
  fixSuggestions: ARGS.includes('--fix-suggestions'),
  type: ARGS.find(a => a.startsWith('--type='))?.slice(7),
};

const VALID_TYPES = new Set([
  'memory', 'prompt', 'context', 'atomic', 'draft-content', 'meta',
  'projeto', 'indice', 'auditoria', 'pesquisa', 'legal', 'site-copy',
  'apresentacao', 'linkedin-post', 'daily', 'documentacao',
]);
const VALID_STATUS = new Set(['draft', 'active', 'review', 'published', 'archived', 'locked', 'stale']);
const VALID_TAG_ROOTS = new Set(['domain', 'project', 'status', 'ai', 'source', 'tipo']);
const SKIP_DIRS = new Set(['.obsidian', '.trash', 'node_modules', '.git', '.claude', '91-templates', '99-archive']);
// 91-templates skipado: arquivos Templater começam com <%* ... %> em vez de YAML
// 99-archive skipado: arquivos legacy preservados como-foram

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m',
  cyan: '\x1b[36m', gray: '\x1b[90m',
};

let canonicalOrder = [];

async function loadLinterOrder() {
  try {
    const cfg = JSON.parse(await fs.readFile(LINTER_CFG, 'utf-8'));
    const orderStr = cfg.ruleConfigs?.['yaml-key-sort']?.['yaml-key-priority-sort-order'] || '';
    canonicalOrder = orderStr.split('\n').filter(Boolean);
  } catch (e) {
    canonicalOrder = [];
  }
}

function parseFm(content) {
  // Normaliza CRLF -> LF para parser consistente
  const norm = content.replace(/\r\n/g, '\n');
  if (!norm.startsWith('---\n')) return { fm: {}, body: norm, keys: [], hadYaml: false };
  const end = norm.indexOf('\n---\n', 4);
  if (end === -1) return { fm: {}, body: norm, keys: [], hadYaml: false };
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
  return { fm, body, keys, hadYaml: true };
}

async function walk(dir) {
  const out = [];
  const ents = await fs.readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(full));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function relativePath(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
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
    const unknownKeys = keys.filter(k => !canonicalOrder.includes(k));
    if (unknownKeys.length) {
      issues.push({ rule: 2, severity: 'WARN', file: rel, msg: `keys fora da ordem canonica: ${unknownKeys.join(', ')}`, fix: 'adicionar essas keys a yaml-key-priority-sort-order no data.json do linter' });
    }
  }

  // 3. Tags root validos
  if (Array.isArray(fm.tags)) {
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

  // 7. Wikilinks suspeitos
  const wikilinkRegex = /\[\[([^\]\|#]+?)(?:\||#|\])/g;
  let match;
  const wlinks = new Set();
  while ((match = wikilinkRegex.exec(body)) !== null) {
    wlinks.add(match[1].trim());
  }
  for (const w of wlinks) {
    if (w.length < 3) {
      issues.push({ rule: 7, severity: 'WARN', file: rel, msg: `wikilink suspeito (muito curto): [[${w}]]`, fix: 'revisar' });
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
  if (!FLAGS.json) {
    console.log(`${C.bold}vault-validate.mjs${C.reset}`);
    console.log(`   Source: ${VAULT}`);
    if (FLAGS.type) console.log(`   Filter: tipo == "${FLAGS.type}"`);
    console.log(`   Linter order: ${canonicalOrder.length} keys carregadas`);
    console.log('');
  }

  const allFiles = await walk(VAULT);
  let scanned = 0;
  let issues = [];

  for (const file of allFiles) {
    const content = await fs.readFile(file, 'utf-8');
    const parsed = parseFm(content);
    if (FLAGS.type && parsed.fm.tipo !== FLAGS.type) continue;
    scanned++;
    issues.push(...validate(file, parsed));
  }

  issues.push(...await validateIndices(allFiles));

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

main().catch(e => { console.error(C.red + e.message + C.reset); process.exit(1); });
