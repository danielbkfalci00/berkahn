// Regressões offline dos helpers reais, sem Next, banco ou infraestrutura local.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import Papa from 'papaparse';
import ts from 'typescript';

async function loadTypeScript(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const contactSource = readFileSync(new URL('../lib/contact.ts', import.meta.url), 'utf8');
const { normalizeLeadPhone, submitLeadInput, getLeadSubmissionContent } = await loadTypeScript(contactSource);
assert.equal(normalizeLeadPhone('(11) 99999-9999'), '5511999999999');
assert.equal(normalizeLeadPhone('(11) 3333-4444'), '551133334444');
assert.equal(normalizeLeadPhone('+55 (11) 99999-9999'), '5511999999999');
assert.equal(normalizeLeadPhone('0055 11 99999 9999'), '5511999999999');
assert.equal(normalizeLeadPhone('+1 415 555 0123'), '14155550123');
assert.equal(normalizeLeadPhone(undefined), '');

const wizardSource = readFileSync(new URL('../components/admin/orcamentos/wizard-state.ts', import.meta.url), 'utf8');
const reducerStart = wizardSource.indexOf('export function reducer(');
const reducerEnd = wizardSource.indexOf('\n// ===', reducerStart);
assert.ok(reducerStart >= 0 && reducerEnd > reducerStart, 'Reducer real não encontrado.');
const { reducer } = await loadTypeScript(wizardSource.slice(reducerStart, reducerEnd));
const draftA = { cliente_nome: 'Cliente de teste A', valor_min: 100 };
const initial = { dados: draftA, hasUnsavedChanges: true, ultimoStepVisitado: 1 };
const editedDuringSave = reducer(initial, { type: 'UPDATE_FIELD', field: 'cliente_nome', valor: 'Cliente de teste B' });
const oldResponse = reducer(editedDuringSave, { type: 'MARK_SAVED', snapshot: draftA });
assert.equal(oldResponse.hasUnsavedChanges, true, 'Resposta de A não pode marcar B como salvo.');
assert.equal(oldResponse.dados.cliente_nome, 'Cliente de teste B');
assert.equal(reducer(oldResponse, { type: 'MARK_SAVED', snapshot: oldResponse.dados }).hasUnsavedChanges, false);

const pdfSource = readFileSync(new URL('../lib/orcamento-pdf-storage.ts', import.meta.url), 'utf8');
const hashStart = pdfSource.indexOf('export const DOCUMENT_FIELDS =');
const hashEnd = pdfSource.indexOf('const BUCKET_PDFS =', hashStart);
assert.ok(hashStart >= 0 && hashEnd > hashStart, 'Hash real não encontrado.');
const { getOrcamentoPdfRevision, isOrcamentoPdfCurrent, getOrcamentoPdfState } = await loadTypeScript(
  `import { createHash } from 'node:crypto';\n${pdfSource.slice(hashStart, hashEnd)}`
);
const budget = { numero: 'TEST-001', cliente_nome: 'Cliente sintético', valor_min: 100, hero_image_url: 'test/hero.webp' };
const revision = getOrcamentoPdfRevision(budget);
assert.equal(getOrcamentoPdfRevision({ ...budget, atualizado_em: '2026-09-29', pdf_url: 'https://example.invalid/new-token', lead_id: 'other' }), revision);
assert.notEqual(getOrcamentoPdfRevision({ ...budget, valor_min: 101 }), revision);
assert.notEqual(getOrcamentoPdfRevision({ ...budget, hero_image_url: 'test/new-hero.webp' }), revision);
assert.equal(isOrcamentoPdfCurrent({ ...budget, pdf_revision_hash: revision, pdf_storage_path: 'test/document.pdf' }), true);
assert.equal(isOrcamentoPdfCurrent({ ...budget, valor_min: 101, pdf_revision_hash: revision, pdf_storage_path: 'test/document.pdf' }), false);
assert.equal(getOrcamentoPdfState({ ...budget, pdf_revision_hash: revision, pdf_storage_path: 'test/document.pdf' }), 'current');
assert.equal(getOrcamentoPdfState({ ...budget, valor_min: 101, pdf_revision_hash: revision, pdf_storage_path: 'test/document.pdf' }), 'stale');
assert.equal(getOrcamentoPdfState({ ...budget, pdf_storage_path: 'test/legacy.pdf' }), 'legacy');
assert.equal(getOrcamentoPdfState({ ...budget, pdf_generated_at: '2026-09-29', pdf_storage_path: 'test/incomplete.pdf' }), 'stale');
assert.equal(getOrcamentoPdfState(budget), 'missing');

// Executa as actions e a rota reais, substituindo apenas banco, storage e Next.
function loadCommonModule(source, imports, globals = {}) {
  const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const testModule = { exports: {} };
  new Function('require', 'module', 'exports', ...Object.keys(globals), output)((name) => {
    assert.ok(Object.hasOwn(imports, name), `Import inesperado: ${name}`);
    return imports[name];
  }, testModule, testModule.exports, ...Object.values(globals));
  return testModule.exports;
}
const budgetTypes = loadCommonModule(readFileSync(new URL('../types/orcamento-estimativa.ts', import.meta.url), 'utf8'), {});
{
  const element = (type, props) => ({ type, props });
  const symbols = new Proxy({}, { get: (_, name) => String(name) });
  const table = loadCommonModule(readFileSync(new URL('../components/admin/orcamentos/OrcamentosTable.tsx', import.meta.url), 'utf8'), {
    'react/jsx-runtime': { jsx: element, jsxs: element },
    '@/lib/admin/return-to': { commercialHref: (href) => href },
    'next/link': { __esModule: true, default: 'Link' },
    './BaixarPdfButton': { BaixarPdfButton: 'BaixarPdfButton' },
    '@/components/ui/card': { Card: 'Card' },
    '@/components/ui/badge': { Badge: 'Badge' },
    'lucide-react': symbols,
  }).OrcamentosTable;
  const nodes = (tree) => Array.isArray(tree) ? tree.flatMap(nodes) : tree?.props ? [tree, ...nodes(tree.props.children)] : [];
  const row = { id: 'budget-test', numero: 'TEST-001', status: 'finalizado', cliente_nome: 'Cliente sintético', obra_cidade: 'Cidade', projeto_area_m2: 100, valor_min: 100, valor_max: 200, data_elaboracao: '2026-09-29', pdf_storage_path: 'test/document.pdf', pdf_generated_at: '2026-09-29', criado_em: '2026-09-29' };
  const stale = nodes(table({ orcamentos: [{ ...row, pdf_state: 'stale' }] }));
  assert.equal(stale.filter((node) => node.type === 'BaixarPdfButton').length, 0, 'PDF desatualizado não pode parecer baixável na lista.');
  assert.equal(stale.filter((node) => node.type === 'Link' && JSON.stringify(node.props.children).includes('PDF desatualizado')).length, 2, 'Lista mobile e desktop levam ao orçamento para regenerar.');
  const current = nodes(table({ orcamentos: [{ ...row, pdf_state: 'current' }] }));
  assert.equal(current.filter((node) => node.type === 'BaixarPdfButton').length, 2);
  const legacy = nodes(table({ orcamentos: [{ ...row, pdf_state: 'legacy' }] }));
  assert.equal(legacy.filter((node) => node.type === 'BaixarPdfButton').length, 2);
  assert.ok(legacy.filter((node) => node.type === 'BaixarPdfButton').every((node) => node.props.label === 'PDF do acervo'));
  const missing = nodes(table({ orcamentos: [{ ...row, pdf_state: 'missing' }] }));
  assert.equal(missing.filter((node) => node.type === 'BaixarPdfButton').length, 0);
}
const wizardModule = loadCommonModule(wizardSource, { '@/types/orcamento-estimativa': budgetTypes });
const planilhaModule = loadCommonModule(readFileSync(new URL('../lib/orcamento-planilha.ts', import.meta.url), 'utf8'), { papaparse: Papa, '@/types/orcamento-estimativa': budgetTypes, '@/components/admin/orcamentos/wizard-state': wizardModule });
const actionsSource = readFileSync(new URL('../app/admin/orcamentos/actions.ts', import.meta.url), 'utf8');
const heroSource = readFileSync(new URL('../app/api/admin/orcamentos/[id]/hero/route.ts', import.meta.url), 'utf8');
const pdfUrlSource = readFileSync(new URL('../app/api/admin/orcamentos/[id]/pdf-url/route.ts', import.meta.url), 'utf8');
const pdfRouteSource = readFileSync(new URL('../app/api/admin/orcamentos/[id]/pdf/route.ts', import.meta.url), 'utf8');
const sessionSource = readFileSync(new URL('../lib/supabase/sessao.ts', import.meta.url), 'utf8');
const initialRevision = '2026-09-29T16:00:00.000000+00:00';

// Preserve the origin after real wizard saves/finalization and spreadsheet import.
{
  const returns = loadCommonModule(readFileSync(new URL('../lib/admin/return-to.ts', import.meta.url), 'utf8'), {});
  const context = returns.leadHref('12345678-1234-1234-1234-123456789abc', '/admin/leads?q=Casa&page=3');
  const slots = [], destinations = [], dirty = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], (value) => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useReducer(reduce, initial) { const [value, set] = react.useState(initial); return [value, (action) => set((state) => reduce(state, action))]; },
    useRef(initial) { const i = cursor++; slots[i] ??= { current: initial }; return slots[i]; },
    useCallback(callback) { cursor++; return callback; },
    useMemo(compute) { cursor++; return compute(); },
    useTransition() { cursor++; return [false, (callback) => callback()]; },
  };
  const element = (type, props) => ({ type, props });
  const symbols = new Proxy({}, { get: (_, name) => String(name) });
  const imports = {
    react, 'react/jsx-runtime': { jsx: element, jsxs: element },
    'next/navigation': { useRouter: () => ({ push: (path) => destinations.push(path) }) },
    'next/link': { __esModule: true, default: 'Link' },
    '@/lib/admin/return-to': returns,
    '@/hooks/use-unsaved-changes': { useUnsavedChanges: (value) => dirty.push(value) },
    'lucide-react': symbols, '@/components/ui/card': symbols, '@/components/ui/button': symbols,
    '@/lib/utils': { cn: (...args) => args.filter(Boolean).join(' ') },
    './wizard-state': wizardModule,
    ...Object.fromEntries(['Step1Cliente', 'Step2Obra', 'Step3ValoresRegime', 'Step4ListasEntrega', 'Step5Revisao'].map((name) => [`./steps/${name}`, symbols])),
    '@/app/admin/orcamentos/actions': {
      async criarOrcamento() { throw new Error('This case edits an existing draft'); },
      async atualizarOrcamento() { return { ok: true, atualizadoEm: initialRevision }; },
      async finalizarOrcamento() { return { ok: true, atualizadoEm: initialRevision }; },
      async criarRascunhoDePlanilha() { return { ok: true, id: 'imported' }; },
    },
  };
  function nodes(tree, predicate) {
    if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, predicate));
    if (!tree?.props) return [];
    return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props.children, predicate)];
  }
  const wizard = loadCommonModule(readFileSync(new URL('../components/admin/orcamentos/OrcamentoWizard.tsx', import.meta.url), 'utf8'), imports).OrcamentoWizard;
  const record = { ...wizardModule.initialState().dados, id: 'existing', numero: 'TEST-1', atualizado_em: initialRevision, cliente_nome: 'Teste', obra_endereco: 'Rua de teste', obra_cidade: 'Cidade', projeto_area_m2: 100, valor_min: 100, valor_max: 200, valor_m2_min: 1, valor_m2_max: 2 };
  const render = () => { cursor = 0; return wizard({ orcamentoInicial: record, returnTo: context }); };
  let tree = render();
  assert.equal(nodes(tree, (node) => node.type === 'Step1Cliente')[0].props.returnTo, context);
  nodes(tree, (node) => node.type === 'Step1Cliente')[0].props.onChange('cliente_nome', 'Teste revisado');
  tree = render();
  assert.equal(dirty.at(-1), true);
  const button = (tree, name) => nodes(tree, (node) => node.type === 'Button' && JSON.stringify(node.props.children).includes(name))[0];
  await button(tree, 'Salvar rascunho').props.onClick();
  tree = render();
  assert.equal(dirty.at(-1), false);
  assert.equal(nodes(tree, (node) => node.type === 'Link')[0].props.href, returns.commercialHref('/admin/orcamentos/existing', context));
  await button(tree, 'Finalizar').props.onClick();
  assert.equal(destinations.at(-1), returns.commercialHref('/admin/orcamentos/existing', context));

  slots.length = 0;
  cursor = 0;
  const step = loadCommonModule(readFileSync(new URL('../components/admin/orcamentos/steps/Step1Cliente.tsx', import.meta.url), 'utf8'), { ...imports, '../form-fields': symbols }).Step1Cliente;
  const stepTree = step({ dados: { ...record, lead_id: '12345678-1234-1234-1234-123456789abc' }, erros: {}, onChange() {}, returnTo: context });
  assert.equal(nodes(stepTree, (node) => node.type === 'Link')[0].props.href, context, 'The linked lead shortcut inside the form also preserves the queue');

  slots.length = 0;
  const upload = loadCommonModule(readFileSync(new URL('../components/admin/orcamentos/PlanilhaUpload.tsx', import.meta.url), 'utf8'), imports).PlanilhaUpload;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ row: { cliente_nome: 'Teste importação' }, erros: [], warnings: [] });
  try {
    cursor = 0;
    tree = upload({ returnTo: context });
    nodes(tree, (node) => node.type === 'input' && node.props.type === 'file')[0].props.onChange({ target: { files: [new File(['data'], 'teste.csv')] } });
    // File selection starts an async parse from an event handler with no return value.
    await new Promise((resolve) => setImmediate(resolve));
    cursor = 0;
    tree = upload({ returnTo: context });
    const open = nodes(tree, (node) => node.type === 'Button' && !node.props.disabled && JSON.stringify(node.props.children).includes('wizard'))[0];
    assert.ok(open, 'Parsed spreadsheet offers the existing wizard action');
    await open.props.onClick();
    assert.equal(destinations.at(-1), returns.commercialHref('/admin/orcamentos/imported/edit', context));
  } finally { globalThis.fetch = realFetch; }

  // Two clicks before React renders must still make a single request.
  slots.length = 0;
  let requests = 0, refreshes = 0, complete;
  const generate = loadCommonModule(readFileSync(new URL('../components/admin/orcamentos/GerarPdfButton.tsx', import.meta.url), 'utf8'), {
    ...imports, 'next/navigation': { useRouter: () => ({ refresh() { refreshes++; } }) },
  }, { fetch: () => { requests++; return new Promise((resolve, reject) => { complete = { resolve, reject }; }); } }).GerarPdfButton;
  const renderGenerate = (atualizadoEm = initialRevision) => { cursor = 0; return generate({ orcamentoId: 'budget-test', atualizadoEm }); };
  for (const failure of [409, 503, 'network']) {
    const click = nodes(renderGenerate(), (node) => node.type === 'Button')[0].props.onClick;
    const before = requests;
    const first = click();
    await click();
    assert.equal(requests, before + 1, 'Cliques simultâneos geram somente uma solicitação');
    assert.equal(nodes(renderGenerate(), (node) => node.type === 'Button')[0].props.disabled, true);
    if (failure === 'network') complete.reject(new Error('Conexão interrompida'));
    else complete.resolve(Response.json({ error: 'Confira a versão atual' }, { status: failure }));
    await first;
    const result = renderGenerate();
    assert.equal(nodes(result, (node) => node.props.role === 'alert').length, 1);
    nodes(result, (node) => node.type === 'button' && node.props.children === 'Atualizar orçamento')[0].props.onClick();
    assert.equal(nodes(result, (node) => node.type === 'Button')[0].props.disabled, false, 'Falha libera nova tentativa');
  }
  const success = nodes(renderGenerate(), (node) => node.type === 'Button')[0].props.onClick();
  complete.resolve(Response.json({ atualizado_em: 'new-version' }));
  await success;
  assert.equal(refreshes, 4);
  assert.equal(nodes(renderGenerate('new-version'), (node) => node.props.role === 'status').length, 1);

  slots.length = 0;
  let downloads = 0, removed = 0, revoked = 0;
  const requested = [];
  const download = loadCommonModule(readFileSync(new URL('../components/admin/orcamentos/BaixarPdfButton.tsx', import.meta.url), 'utf8'), imports, {
    fetch: (url, options) => {
      requested.push({ url, options });
      return url.startsWith('/api/') ? new Promise((resolve) => { complete = { resolve }; }) : Promise.resolve(new Response('synthetic-pdf'));
    },
    document: { body: { appendChild() {} }, createElement: () => ({ click() { downloads++; }, remove() { removed++; } }) },
    URL: { createObjectURL: () => 'blob:synthetic', revokeObjectURL() { revoked++; } },
    setTimeout: (callback) => callback(),
  }).BaixarPdfButton;
  const renderDownload = () => { cursor = 0; return download({ orcamentoId: 'budget-test', filename: 'teste.pdf' }); };
  let downloadClick = nodes(renderDownload(), (node) => node.type === 'Button')[0].props.onClick;
  const failedDownload = downloadClick();
  await downloadClick();
  assert.equal(requested.length, 1);
  complete.resolve(Response.json({ error: 'Gere novamente após editar' }, { status: 409 }));
  await failedDownload;
  assert.equal(nodes(renderDownload(), (node) => node.props.role === 'alert').length, 1);
  downloadClick = nodes(renderDownload(), (node) => node.type === 'Button')[0].props.onClick;
  const successfulDownload = downloadClick();
  await downloadClick();
  assert.equal(requested.length, 2, 'Falha libera download e clique duplo continua bloqueado');
  complete.resolve(Response.json({ pdf_url: 'https://example.invalid/fresh.pdf' }));
  await successfulDownload;
  assert.equal(requested[1].options.cache, 'no-store');
  assert.equal(requested[2].url, 'https://example.invalid/fresh.pdf');
  assert.deepEqual([downloads, removed, revoked], [1, 1, 1]);
  assert.equal(nodes(renderDownload(), (node) => node.type === 'Button')[0].props.disabled, false);
}

function createBudgetHarness({ onUpdate, signingFails = false, loseFirstCreateResponse = false, normalizeStoredValues = (value) => value, role = 'owner', active = true, authenticated = true, pdf = {} } = {}) {
  let version = 0;
  let responseLost = false;
  let pdfResponseLost = false;
  const member = { user_id: 'synthetic-user', role, ativo: active };
  const row = { ...wizardModule.initialState().dados, id: 'budget-test', numero: 'TEST-001', atualizado_em: initialRevision, cliente_nome: 'Cliente sintético', obra_endereco: 'Endereço sintético', obra_cidade: 'Cidade', projeto_area_m2: 100, valor_min: 100, valor_max: 200, valor_m2_min: 1, valor_m2_max: 2, hero_image_url: 'budget-test/old.webp' };
  const calls = { writes: 0, logs: 0, signedPdfs: 0, uploaded: [], removed: [], privileged: 0, launched: 0, closed: 0, pdfs: 0, pdfUploads: 0, diagnostics: [] };
  const nextRevision = () => `2026-09-29T16:00:00.${String(++version).padStart(6, '0')}+00:00`;
  const supabase = {
    auth: { async getUser() { return { data: { user: authenticated ? { id: 'synthetic-user', email: 'test@example.invalid' } : null } }; } },
    from(table) {
      assert.ok(['orcamentos', 'activity_logs', 'lead_responsaveis'].includes(table));
      const filters = [];
      let patch;
      let insertion = false;
      const execute = async () => {
        if (table === 'lead_responsaveis') return { data: filters.every(([key, value]) => member[key] === value) ? member : null };
        if (table === 'activity_logs') { calls.logs++; return { error: null }; }
        if (pdf.failConfirmation && pdfResponseLost && !patch) return { data: null, error: { message: 'Leitura indisponível' } };
        if (insertion && patch.id && patch.id === row.id) return { data: null, error: { code: '23505', message: 'Chave já existente' } };
        if (patch && !insertion) await onUpdate?.(row, { nextRevision });
        if (!filters.every(([key, value]) => row[key] === value)) return { data: null, error: null };
        if (pdf.failUpdate && patch?.pdf_storage_path) return { data: null, error: { message: 'Gravação indisponível' } };
        if (patch) { Object.assign(row, normalizeStoredValues(patch), { atualizado_em: nextRevision() }); calls.writes++; }
        if (pdf.loseResponse && patch?.pdf_storage_path) { pdfResponseLost = true; return { data: null, error: { message: 'Resposta perdida após commit' } }; }
        if (insertion && loseFirstCreateResponse && !responseLost) { responseLost = true; return { data: null, error: { code: 'FETCH_ERROR', message: 'Resposta perdida depois do commit' } }; }
        return { data: structuredClone(row), error: null };
      };
      const query = {
        select() { return query; },
        eq(key, value) { filters.push([key, value]); return query; },
        update(value) { patch = value; return query; },
        insert(value) { patch = value; insertion = true; return query; },
        single: execute,
        maybeSingle: execute,
        then(resolve, reject) { return execute().then(resolve, reject); },
      };
      return query;
    },
    storage: { from(bucket) {
      assert.ok(['orcamento-heroes', 'orcamento-pdfs'].includes(bucket));
      return {
        async upload(path) { calls.uploaded.push(path); return { error: null }; },
        async createSignedUrl(path) { return signingFails ? { data: null, error: { message: 'Assinatura indisponível' } } : { data: { signedUrl: `https://example.invalid/${path}` }, error: null }; },
        async remove(paths) { calls.removed.push(...paths); if (pdf.cleanupThrows) throw new Error('Falha simulada na limpeza'); return { error: null }; },
      };
    } },
  };
  const cache = { revalidatePath() {} };
  const session = loadCommonModule(sessionSource, { 'server-only': {}, react: { cache: (fn) => fn }, 'next/server': { NextResponse: Response }, '@/lib/supabase/server': { createClient: async () => supabase } });
  const service = { createServiceClient() { calls.privileged++; return supabase; } };
  const actions = loadCommonModule(actionsSource, { 'next/cache': cache, 'node:util': { isDeepStrictEqual }, '@/lib/supabase/sessao': session, '@/components/admin/orcamentos/wizard-state': wizardModule, '@/lib/orcamento-planilha': planilhaModule });
  const sharp = () => { const image = { resize() { return image; }, webp() { return image; }, async toBuffer() { return Buffer.from('synthetic-image'); } }; return image; };
  const hero = loadCommonModule(heroSource, { 'next/cache': cache, 'next/server': { NextResponse: Response }, sharp, 'node:crypto': { randomUUID: () => 'new-upload' }, '@/lib/supabase/admin': service, '@/lib/supabase/sessao': session });
  const pdfUrl = loadCommonModule(pdfUrlSource, { 'next/server': { NextResponse: Response }, '@/lib/supabase/admin': service, '@/lib/supabase/sessao': session, '@/lib/orcamento-pdf-storage': { getOrcamentoPdfState, async gerarSignedUrlPdf() { calls.signedPdfs++; return `https://example.invalid/current.pdf?token=${calls.signedPdfs}`; } } });
  const page = {
    async setViewport() {}, async evaluateOnNewDocument() {}, async setExtraHTTPHeaders() {},
    async goto() { return { ok: () => !pdf.rendererFails, status: () => pdf.rendererFails ? 500 : 200 }; },
    async waitForSelector() {}, async evaluateHandle() {},
    async waitForFunction() { if (pdf.imageTimeout) throw new Error('Timeout de imagem'); },
    async $eval(selector, fn) {
      return fn({ getAttribute: () => pdf.wrongId ? 'another-budget' : row.id, querySelectorAll: () => [{ naturalWidth: pdf.brokenImage ? 0 : 100 }] });
    },
    async pdf(options) { calls.pdfs++; calls.pdfOptions = options; await pdf.onRender?.(row, nextRevision); return Buffer.from('%PDF-synthetic'); },
  };
  const pdfRoute = loadCommonModule(pdfRouteSource, {
    'next/server': { NextResponse: Response }, '@/lib/supabase/admin': service, '@/lib/supabase/sessao': session,
    '@/lib/puppeteer-launch': { getBaseUrl: () => 'https://renderer.example.invalid', async launchBrowser() { calls.launched++; return { newPage: async () => page, async close() { calls.closed++; } }; } },
    '@/lib/orcamento-token': { assinarToken: () => 'synthetic-token', ORCAMENTO_TOKEN_HEADER: 'x-orcamento-token' },
    '@/lib/orcamento-pdf-storage': { getOrcamentoPdfRevision, async salvarPdfOrcamento() { calls.pdfUploads++; return { path: `test/generated-${calls.pdfUploads}.pdf`, signedUrl: 'https://example.invalid/generated.pdf' }; } },
    '@/components/admin/orcamentos/wizard-state': wizardModule, '@/lib/orcamento-logo-data-uri': { LOGO_DATA_URI: 'data:image/png;base64,AA==' },
  }, { console: { error: (...args) => calls.diagnostics.push(args) } });
  return { row, calls, actions, hero, pdfUrl, pdfRoute, session, supabase };
}

// The real renderer must not replace a configured cover after a signing failure.
{
  const rendererSource = readFileSync(new URL('../app/orcamento/estimativa/[id]/page.tsx', import.meta.url), 'utf8');
  const element = (type, props) => ({ type, props });
  const sections = ['CapaHero', 'IndiceEstimativa', 'NaturezaDocumento', 'SobreBerkahn', 'OQueEntregamos', 'PadroesAcabamento', 'EstimativaInvestimento', 'Premissas', 'CondicionantesExclusoes', 'RegimesComerciais', 'ProximosPassos', 'ContatoFinal'];
  let validToken = true, reads = 0;
  const harness = createBudgetHarness({ signingFails: true });
  const renderer = loadCommonModule(rendererSource, {
    'react/jsx-runtime': { jsx: element, jsxs: element },
    'next/headers': { headers: async () => new Headers() },
    'next/navigation': { notFound() { throw new Error('NOT_FOUND'); } },
    '@/lib/supabase/admin': { createServiceClient() { reads++; return harness.supabase; } },
    '@/lib/orcamento-token': { validarToken: () => validToken, ORCAMENTO_TOKEN_HEADER: 'x-orcamento-token' },
    '@/lib/orcamento-estimativa-data': { SECOES_INDICE: [], HERO_DEFAULT: '/default-cover.webp' },
    './styles.module.css': { root: 'root' },
    ...Object.fromEntries(sections.map((name) => [`@/components/orcamento/estimativa/${name}`, { [name]: name }])),
  }).default;
  const render = () => renderer({ params: Promise.resolve({ id: 'budget-test' }) });
  await assert.rejects(render(), /carregar a capa/);
  harness.row.hero_image_url = null;
  assert.equal((await render()).props.children[0].props.heroUrl, '/default-cover.webp');
  harness.row.hero_image_url = 'https://example.invalid/selected-cover.webp';
  assert.equal((await render()).props.children[0].props.heroUrl, harness.row.hero_image_url);
  validToken = false;
  const before = reads;
  await assert.rejects(render(), /NOT_FOUND/);
  assert.equal(reads, before, 'Token inválido não inicia consulta privilegiada');
}

const editedBudget = createBudgetHarness();
const savedBudget = await editedBudget.actions.atualizarOrcamento('budget-test', { cliente_nome: 'Editor A' }, initialRevision);
assert.equal(savedBudget.ok, true);
assert.equal(savedBudget.atualizadoEm, editedBudget.row.atualizado_em, 'Resposta preserva timestamp exato do banco, incluindo microssegundos.');
assert.equal((await editedBudget.actions.atualizarOrcamento('budget-test', { cliente_nome: 'Editor B' }, initialRevision)).conflito, true);
assert.equal(editedBudget.row.cliente_nome, 'Editor A', 'Segundo editor não sobrescreve a versão já salva.');
assert.equal((await editedBudget.actions.finalizarOrcamento('budget-test', {}, initialRevision)).conflito, true);
assert.equal((await editedBudget.actions.atualizarOrcamento('budget-test', { cliente_nome: 'Sem versão' }, '')).conflito, true);
const archivedBudget = await editedBudget.actions.arquivarOrcamento('budget-test', savedBudget.atualizadoEm);
assert.equal(archivedBudget.ok, true);
assert.equal((await editedBudget.actions.atualizarOrcamento('budget-test', { status: 'rascunho' }, savedBudget.atualizadoEm)).conflito, true);
assert.equal(editedBudget.row.status, 'arquivado', 'Editor antigo não reabre orçamento arquivado.');
assert.equal((await editedBudget.actions.desarquivarOrcamento('budget-test', archivedBudget.atualizadoEm)).ok, true);

const finalizationRace = createBudgetHarness({ onUpdate(row, { nextRevision }) { row.cliente_nome = 'Edição concorrente'; row.atualizado_em = nextRevision(); } });
assert.equal((await finalizationRace.actions.finalizarOrcamento('budget-test', {}, initialRevision)).conflito, true, 'CAS precisa proteger também o intervalo entre validação e update.');
assert.equal(finalizationRace.row.status, 'rascunho');
assert.equal(finalizationRace.calls.logs, 0);
const finalized = createBudgetHarness();
const finalResult = await finalized.actions.finalizarOrcamento('budget-test', {}, initialRevision);
assert.equal(finalResult.ok, true);
assert.equal(finalized.row.status, 'finalizado');
assert.equal(finalResult.atualizadoEm, finalized.row.atualizado_em);
const created = createBudgetHarness();
const creation = await created.actions.criarOrcamento(wizardModule.initialState().dados);
assert.equal(creation.ok, true);
assert.equal(creation.atualizadoEm, created.row.atualizado_em);

const creationId = '12345678-1234-4234-8234-123456789abc';
const creationInput = { ...wizardModule.initialState().dados, id: creationId, cliente_nome: 'Criação única', condicionantes_extras: [{ texto: 'Condição', detalhe: 'Mesmo objeto com outra ordem' }] };
const retriedCreation = createBudgetHarness({ loseFirstCreateResponse: true });
assert.equal((await retriedCreation.actions.criarOrcamento(creationInput)).ok, false, 'Simula commit confirmado pelo banco cuja resposta não chegou ao cliente.');
const recoveredCreation = await retriedCreation.actions.criarOrcamento(creationInput);
assert.equal(recoveredCreation.ok, true);
assert.equal(recoveredCreation.id, creationId);
assert.equal(retriedCreation.calls.writes, 1, 'Retry recupera o mesmo registro sem outro insert efetivo.');
assert.equal((await retriedCreation.actions.criarOrcamento({ ...creationInput, condicionantes_extras: [{ detalhe: 'Mesmo objeto com outra ordem', texto: 'Condição' }] })).ok, true, 'Ordem de chaves JSONB não deve produzir falso conflito.');
const divergentCreation = await retriedCreation.actions.criarOrcamento({ ...creationInput, cliente_nome: 'Alteração local após falha' });
assert.equal(divergentCreation.ok, false);
assert.equal(divergentCreation.conflito, true);
assert.equal(divergentCreation.existenteId, creationId);
assert.equal(retriedCreation.row.cliente_nome, 'Criação única', 'Recuperação não sobrescreve conteúdo divergente.');
assert.equal(retriedCreation.calls.writes, 1);
retriedCreation.row.status = 'finalizado';
assert.equal((await retriedCreation.actions.criarOrcamento(creationInput)).conflito, true, 'Repetição não reabre orçamento que já avançou no fluxo.');

const simultaneousCreation = createBudgetHarness();
const simultaneousResults = await Promise.all([simultaneousCreation.actions.criarOrcamento(creationInput), simultaneousCreation.actions.criarOrcamento(creationInput)]);
assert.ok(simultaneousResults.every((result) => result.ok && result.id === creationId));
assert.equal(simultaneousCreation.calls.writes, 1, 'Dois envios simultâneos com a mesma chave criam apenas um orçamento.');
const foreignCreation = createBudgetHarness();
foreignCreation.row.id = creationId;
foreignCreation.row.criado_por = 'other-user';
const foreignResult = await foreignCreation.actions.criarOrcamento(creationInput);
assert.equal(foreignResult.ok, false);
assert.equal(foreignResult.existenteId, undefined, 'Não recupera nem revela orçamento de outro autor.');
assert.equal(foreignCreation.calls.writes, 0);
assert.equal((await foreignCreation.actions.criarOrcamento({ ...creationInput, id: 'invalid' })).ok, false);
assert.equal(foreignCreation.calls.writes, 0);
// O banco usa NUMERIC(..., 2): uma resposta perdida deve recuperar a versão
// arredondada, inclusive quando o decimal representa metade de um centavo.
const moneyInput = { ...creationInput, valor_min: 100.123, valor_max: 200.125, valor_m2_min: 1.005, valor_m2_max: 2.675 };
const moneyCreation = createBudgetHarness({ loseFirstCreateResponse: true, normalizeStoredValues(value) {
  const normalized = { ...value };
  for (const field of ['valor_min', 'valor_max', 'valor_m2_min', 'valor_m2_max']) if (field in normalized) normalized[field] = Number(normalized[field].toFixed(2));
  return normalized;
} });
assert.equal((await moneyCreation.actions.criarOrcamento(moneyInput)).ok, false);
assert.deepEqual(['valor_min', 'valor_max', 'valor_m2_min', 'valor_m2_max'].map((field) => moneyCreation.row[field]), [100.12, 200.13, 1.01, 2.68]);
assert.equal((await moneyCreation.actions.criarOrcamento(moneyInput)).id, creationId, 'Mesmos valores de origem recuperam os centavos persistidos.');
assert.equal(moneyCreation.calls.writes, 1);
assert.equal((await moneyCreation.actions.criarOrcamento({ ...moneyInput, valor_min: 100.14 })).conflito, true, 'Diferença real de centavos continua sendo conflito.');
const tinyAmount = createBudgetHarness();
assert.equal((await tinyAmount.actions.criarOrcamento({ ...creationInput, valor_min: 1e-7 })).ok, true);
assert.equal(tinyAmount.row.valor_min, 0, 'Notação exponencial também respeita a escala do banco.');

async function atUtcDate(iso, operation) {
  const OriginalDate = globalThis.Date;
  class FixedDate extends OriginalDate {
    constructor(...args) { if (args.length) super(...args); else super(iso); }
    static now() { return OriginalDate.parse(iso); }
  }
  globalThis.Date = FixedDate;
  try { return await operation(); } finally { globalThis.Date = OriginalDate; }
}
const beforeMidnight = '2026-09-29T23:59:59.000Z';
const afterMidnight = '2026-09-30T00:00:01.000Z';
const datedWizard = createBudgetHarness({ loseFirstCreateResponse: true });
const datedWizardInput = await atUtcDate(beforeMidnight, () => ({ ...wizardModule.initialState().dados, id: creationId }));
assert.equal((await atUtcDate(beforeMidnight, () => datedWizard.actions.criarOrcamento(datedWizardInput))).ok, false);
assert.equal((await atUtcDate(afterMidnight, () => datedWizard.actions.criarOrcamento(datedWizardInput))).id, creationId);
assert.equal(datedWizard.row.data_elaboracao, '2026-09-29');
assert.equal(datedWizard.row.data_cotacao, '2026-09-29', 'Datas do estado do wizard sobrevivem ao retry no dia seguinte.');
assert.equal(datedWizard.calls.writes, 1);

const importedCreation = createBudgetHarness({ loseFirstCreateResponse: true });
const importedInput = { cliente_nome: 'Importação sintética', obra_endereco: 'Endereço sintético', obra_cidade: 'Cidade', area_m2: 120, pavimentos: 1, padrao_acabamento: 'alto', valor_min: 100, valor_max: 200, valor_m2_min: 1, valor_m2_max: 2, regime_recomendado: 'indefinido', data_cotacao: '2026-09-20' };
const importDate = await atUtcDate(beforeMidnight, () => new Date().toISOString().slice(0, 10));
assert.equal((await atUtcDate(beforeMidnight, () => importedCreation.actions.criarRascunhoDePlanilha(importedInput, creationId, importDate))).ok, false);
assert.equal((await atUtcDate(afterMidnight, () => importedCreation.actions.criarRascunhoDePlanilha(importedInput, creationId, importDate))).id, creationId);
assert.equal(importedCreation.row.data_elaboracao, '2026-09-29', 'Mapper real recebe a data original da tentativa, mesmo após mudar o dia.');
assert.equal(importedCreation.row.data_cotacao, '2026-09-20', 'Data da planilha permanece independente da elaboração.');
assert.equal(importedCreation.row.projeto_area_m2, 120, 'Exercita o mapeamento real dos nomes da planilha.');
assert.equal(importedCreation.calls.writes, 1, 'Importação preserva chave e defaults de criação no retry.');
assert.equal((await importedCreation.actions.criarRascunhoDePlanilha(importedInput, creationId, 'inválida')).ok, false, 'Data fornecida usa o validador existente.');

const heroContext = { params: Promise.resolve({ id: 'budget-test' }) };
const heroRequest = (revision, method = 'DELETE') => ({ headers: new Headers({ 'If-Match': `"${revision}"` }), method, async formData() { return new Map([['file', new File(['synthetic'], 'test.webp', { type: 'image/webp' })]]); } });
const removedHero = createBudgetHarness();
assert.equal((await removedHero.hero.DELETE(heroRequest('old-revision'), heroContext)).status, 409);
assert.equal((await removedHero.hero.DELETE(heroRequest('2026-09-28T16:00:00.000000+00:00'), heroContext)).status, 409);
assert.equal(removedHero.calls.removed.length, 0, 'Conflito de revisão não remove o arquivo atual.');
assert.equal((await removedHero.hero.DELETE(heroRequest(initialRevision), heroContext)).status, 200);
assert.equal(removedHero.row.hero_image_url, null);
assert.deepEqual(removedHero.calls.removed, [], 'Remover vínculo preserva arquivos que outros orçamentos podem compartilhar.');
const uploadRace = createBudgetHarness({ onUpdate(row, { nextRevision }) { row.hero_image_url = 'budget-test/other-editor.webp'; row.atualizado_em = nextRevision(); } });
assert.equal((await uploadRace.hero.POST(heroRequest(initialRevision, 'POST'), heroContext)).status, 409);
assert.equal(uploadRace.row.hero_image_url, 'budget-test/other-editor.webp');
assert.deepEqual(uploadRace.calls.removed, uploadRace.calls.uploaded, 'Upload perdedor limpa apenas seu arquivo novo.');
const unsignedHero = createBudgetHarness({ signingFails: true });
assert.equal((await unsignedHero.hero.POST(heroRequest(initialRevision, 'POST'), heroContext)).status, 500);
assert.deepEqual(unsignedHero.calls.removed, unsignedHero.calls.uploaded, 'Falha de assinatura não deixa upload órfão.');
assert.equal(unsignedHero.row.hero_image_url, 'budget-test/old.webp');
const uploadedHero = createBudgetHarness();
assert.equal((await uploadedHero.hero.POST(heroRequest(initialRevision, 'POST'), heroContext)).status, 200);
assert.equal(uploadedHero.row.hero_image_url, 'budget-test/new-upload.webp');
assert.deepEqual(uploadedHero.calls.removed, [], 'Trocar capa preserva arquivos anteriores potencialmente compartilhados.');
const pdfDownload = createBudgetHarness();
pdfDownload.row.pdf_storage_path = 'test/current.pdf';
pdfDownload.row.pdf_generated_at = initialRevision;
pdfDownload.row.pdf_revision_hash = getOrcamentoPdfRevision(pdfDownload.row);
assert.equal((await pdfDownload.pdfUrl.GET({}, heroContext)).status, 200);
assert.equal(pdfDownload.calls.signedPdfs, 1);
pdfDownload.row.valor_min += 1;
assert.equal((await pdfDownload.pdfUrl.GET({}, heroContext)).status, 409, 'Download consulta a revisão atual mesmo se a aba permaneceu aberta com o PDF anterior.');
assert.equal(pdfDownload.calls.signedPdfs, 1, 'Documento obsoleto não recebe URL renovada.');

// Same public handlers as production; no browser launch, storage or network.
const pdfRequest = (revision = initialRevision) => new Request('https://admin.example.invalid/api/admin/orcamentos/budget-test/pdf', { method: 'POST', headers: { 'If-Match': `"${revision}"` } });
for (const role of ['owner', 'comercial', 'conteudo', 'viewer']) {
  const h = createBudgetHarness({ role });
  const allowed = ['owner', 'comercial'].includes(role);
  assert.equal((await h.pdfRoute.POST(pdfRequest(), heroContext)).status, allowed ? 200 : 403, `${role}: geração`);
  assert.equal((await h.pdfUrl.GET({}, heroContext)).status, allowed ? 200 : 403, `${role}: download`);
  assert.equal((await h.hero.DELETE(heroRequest(h.row.atualizado_em), heroContext)).status, allowed ? 200 : 403, `${role}: capa`);
  assert.equal((await h.actions.atualizarOrcamento('budget-test', { cliente_nome: 'Revisão' }, h.row.atualizado_em)).ok, allowed, `${role}: edição`);
  if (!allowed) {
    assert.equal(h.calls.privileged, 0, 'Papel sem acesso não chega ao cliente service role');
    assert.equal(h.calls.writes, 0);
    assert.equal(h.calls.launched, 0);
  }
}
for (const options of [{ authenticated: false }, { active: false }]) {
  const h = createBudgetHarness(options);
  assert.equal((await h.pdfRoute.POST(pdfRequest(), heroContext)).status, 401);
  assert.equal((await h.pdfUrl.GET({}, heroContext)).status, 401);
  assert.equal(h.calls.privileged, 0);
}
const access = loadCommonModule(readFileSync(new URL('../lib/admin/access.ts', import.meta.url), 'utf8'), {});
for (const [role, expected] of [['owner', [true, true, true]], ['comercial', [true, false, true]], ['conteudo', [false, true, true]], ['viewer', [false, false, true]]]) {
  assert.deepEqual(['/admin/orcamentos', '/admin/posts', '/admin/analytics'].map((path) => access.roleCanAccessPath(role, path)), expected);
}

const successfulPdf = createBudgetHarness();
successfulPdf.row.pdf_storage_path = 'test/previous.pdf';
successfulPdf.row.cliente_nome = '<Teste & revisão>';
assert.equal((await successfulPdf.pdfRoute.POST(pdfRequest(), heroContext)).status, 200);
assert.equal(isOrcamentoPdfCurrent(successfulPdf.row), true);
assert.equal(successfulPdf.row.status, 'finalizado');
assert.equal(successfulPdf.calls.closed, 1);
assert.deepEqual(successfulPdf.calls.removed, ['test/previous.pdf']);
assert.ok(successfulPdf.calls.pdfOptions.headerTemplate.includes('&lt;Teste &amp; revisão&gt;'));
const signedOnce = await (await successfulPdf.pdfUrl.GET({}, heroContext)).json();
const signedAgain = await (await successfulPdf.pdfUrl.GET({}, heroContext)).json();
assert.notEqual(signedOnce.pdf_url, signedAgain.pdf_url, 'Cada download renova a URL em vez de reutilizar token expirado');
assert.equal((await successfulPdf.pdfUrl.GET({}, heroContext)).headers.get('Cache-Control'), 'private, no-store');
successfulPdf.row.hero_image_url = 'test/changed-cover.webp';
assert.equal((await successfulPdf.pdfUrl.GET({}, heroContext)).status, 409, 'Troca da capa invalida PDF existente');

for (const [patch, revision, expected] of [[{}, 'stale', 409], [{ status: 'arquivado' }, initialRevision, 409], [{ cliente_nome: '' }, initialRevision, 400]]) {
  const h = createBudgetHarness(); Object.assign(h.row, patch);
  assert.equal((await h.pdfRoute.POST(pdfRequest(revision), heroContext)).status, expected);
  assert.equal(h.calls.launched, 0, 'Revisão/estado/campos inválidos falham antes do trabalho pesado');
}
for (const pdf of [{ rendererFails: true }, { wrongId: true }, { brokenImage: true }, { imageTimeout: true }]) {
  const h = createBudgetHarness({ pdf });
  assert.equal((await h.pdfRoute.POST(pdfRequest(), heroContext)).status, 500);
  assert.equal(h.calls.pdfUploads, 0, 'Renderer ou imagem inválida não é persistido como documento válido');
  assert.equal(h.calls.closed, 1, 'Falha fecha o browser da geração');
}
const renderRace = createBudgetHarness({ pdf: { onRender(row, revision) { row.hero_image_url = 'test/newer.webp'; row.atualizado_em = revision(); } } });
assert.equal((await renderRace.pdfRoute.POST(pdfRequest(), heroContext)).status, 409);
assert.equal(renderRace.row.hero_image_url, 'test/newer.webp');
assert.equal(renderRace.row.pdf_storage_path, null);
assert.deepEqual(renderRace.calls.removed, ['test/generated-1.pdf']);

const cleanupFailure = createBudgetHarness({ pdf: { cleanupThrows: true } });
cleanupFailure.row.pdf_storage_path = 'test/previous.pdf';
assert.equal((await cleanupFailure.pdfRoute.POST(pdfRequest(), heroContext)).status, 200, 'Falha na limpeza não transforma commit concluído em erro de geração');
assert.equal(isOrcamentoPdfCurrent(cleanupFailure.row), true);
assert.ok(cleanupFailure.calls.diagnostics.length);
const cleanupConflict = createBudgetHarness({ pdf: { cleanupThrows: true }, onUpdate(row, { nextRevision }) { row.atualizado_em = nextRevision(); } });
assert.equal((await cleanupConflict.pdfRoute.POST(pdfRequest(), heroContext)).status, 409, 'Conflito continua identificado mesmo se a limpeza falhar');
const lostPdfResponse = createBudgetHarness({ pdf: { loseResponse: true } });
assert.equal((await lostPdfResponse.pdfRoute.POST(pdfRequest(), heroContext)).status, 200, 'Resposta perdida é conciliada com o arquivo gravado');
assert.deepEqual(lostPdfResponse.calls.removed, [], 'PDF confirmado nunca é removido após resposta perdida');
const unknownPdfResult = createBudgetHarness({ pdf: { loseResponse: true, failConfirmation: true } });
assert.equal((await unknownPdfResult.pdfRoute.POST(pdfRequest(), heroContext)).status, 503);
assert.deepEqual(unknownPdfResult.calls.removed, [], 'Resultado incerto preserva arquivo potencialmente referenciado');
assert.equal(unknownPdfResult.calls.closed, 1);
const failedPdfWrite = createBudgetHarness({ pdf: { failUpdate: true } });
assert.equal((await failedPdfWrite.pdfRoute.POST(pdfRequest(), heroContext)).status, 503);
assert.deepEqual(failedPdfWrite.calls.removed, ['test/generated-1.pdf'], 'Leitura confirma que upload rejeitado não está referenciado');

if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
const storage = new Map();
Object.defineProperty(globalThis, 'sessionStorage', {
  configurable: true,
  value: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
});
const originalFetch = globalThis.fetch;
const requests = [];
const outcomes = ['network', 'server', 'invalid-body', 'success', 'success'];
globalThis.fetch = async (url, options) => {
  assert.equal(url, '/api/leads');
  requests.push(JSON.parse(options.body));
  const outcome = outcomes.shift();
  if (outcome === 'network') throw new TypeError('Falha de rede simulada');
  if (outcome === 'server') return Response.json({ success: false }, { status: 503 });
  if (outcome === 'invalid-body') return new Response('{');
  return Response.json({ success: true, leadId: 'synthetic-id' });
};
const input = { name: 'Pessoa sintética', email: 'crm-test@example.invalid', phone: '11999999999', segment: 'residencial', message: 'Mensagem sintética privada', startedAt: 1 };
assert.equal(getLeadSubmissionContent(input), getLeadSubmissionContent({ ...Object.fromEntries(Object.entries(input).reverse()), startedAt: 2, submissionId: 'uuid-ignorado', website: '' }), 'Metadados de retry e ordem das chaves não alteram o conteúdo.');
assert.notEqual(getLeadSubmissionContent(input), getLeadSubmissionContent({ ...input, message: 'Outro pedido' }));
try {
  await assert.rejects(submitLeadInput(input), /Falha de rede/);
  assert.equal(storage.size, 1);
  for (const [key, value] of storage) {
    assert.match(key, /^berkahn-lead-submit:[a-f0-9]{64}$/);
    assert.match(value, /^[a-f0-9-]{36}$/);
    assert.doesNotMatch(`${key}:${value}`, /sintética|crm-test|99999999|privada/);
  }
  assert.equal((await submitLeadInput({ ...input, startedAt: 2 })).status, 503);
  await submitLeadInput(input); // 200 sem corpo confirmável deve preservar a idempotência.
  assert.equal(storage.size, 1);
  const success = await submitLeadInput(input);
  assert.equal((await success.json()).success, true, 'A leitura do corpo pelo chamador continua disponível.');
  assert.equal(storage.size, 0);
  assert.equal(new Set(requests.slice(0, 4).map((request) => request.submissionId)).size, 1);
  await submitLeadInput(input);
  assert.notEqual(requests[4].submissionId, requests[0].submissionId, 'Novo envio após sucesso precisa de outro UUID.');
} finally {
  globalThis.fetch = originalFetch;
}

// Executa o módulo inteiro do dispatcher com transporte e relógio controlados.
// O mock persiste claims/recibos como o outbox; não substitui a lógica de envio.
const dispatchSource = readFileSync(new URL('../lib/push/dispatch.ts', import.meta.url), 'utf8');
const dispatchModule = ts.transpileModule(dispatchSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const pushPayload = { title: 'Lead recebido', body: 'Consulte o painel.', url: '/admin/leads', tag: 'lead-test' };
const testMember = (id, role = 'comercial') => ({ id, user_id: `user-${id}`, role, ativo: true, notificar_novos_leads: true, notificar_acoes_vencidas: true });
const testSubscription = (id, memberId) => ({ id, user_id: `user-${memberId}`, endpoint: `https://push.example.invalid/${id}`, p256dh: 'test-key', auth_key: 'test-auth', ativo: true });
const testLead = (id, extra = {}) => ({ id, responsavel_id: 'assigned', status: 'em_contato', proxima_acao_em: '2026-09-28T12:00:00.000Z', arquivado_em: null, anonimizado_em: null, ...extra });
const testNotification = (id, leadId, extra = {}) => ({ id, lead_id: leadId, tipo: 'proxima_acao_vencida', payload: pushPayload, tentativas: 0, delivered_subscription_ids: [], estado: 'pending', proxima_tentativa_em: '2026-09-28T12:00:00.000Z', ...extra });

function createPushHarness({ leads, notifications, subscriptions = [testSubscription('device-a', 'assigned')], members = [testMember('assigned')], onSend, onRead } = {}) {
  let clock = Date.parse('2026-09-29T12:00:00.000Z');
  const tables = structuredClone({ leads, lead_notification_outbox: notifications, admin_push_subscriptions: subscriptions, lead_responsaveis: members });
  const calls = { claims: [], sends: [], updates: [] };
  const advance = (milliseconds) => { clock += milliseconds; };
  class FakeDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const supabase = {
    async rpc(name, args) {
      assert.equal(name, 'claim_lead_push_notifications');
      assert.equal(args.p_limit, 1, 'Não reservar uma cauda que pode expirar antes de ser enviada.');
      calls.claims.push({ ...args });
      const row = tables.lead_notification_outbox.find((item) => ['pending', 'failed'].includes(item.estado)
        && Date.parse(item.proxima_tentativa_em) <= clock && item.tentativas < 6);
      if (!row) return { data: [], error: null };
      row.estado = 'sending';
      row.tentativas += 1;
      return { data: [structuredClone(row)], error: null };
    },
    from(table) {
      assert.ok(Object.hasOwn(tables, table), `Tabela inesperada: ${table}`);
      const predicates = [];
      let patch;
      let single = false;
      const execute = async () => {
        if (!patch) await onRead?.(table, { advance });
        const rows = tables[table].filter((row) => predicates.every((predicate) => predicate(row)));
        if (patch) {
          for (const row of rows) {
            calls.updates.push({ table, id: row.id, patch: structuredClone(patch) });
            Object.assign(row, structuredClone(patch));
          }
          return { data: null, error: null };
        }
        return { data: structuredClone(single ? rows[0] ?? null : rows), error: null };
      };
      const query = {
        select() { return query; },
        eq(field, value) { predicates.push((row) => row[field] === value); return query; },
        in(field, values) { predicates.push((row) => values.includes(row[field])); return query; },
        update(value) { patch = value; return query; },
        maybeSingle() { single = true; return execute(); },
        then(resolve, reject) { return execute().then(resolve, reject); },
      };
      return query;
    },
  };
  const webpush = {
    setVapidDetails() {},
    async sendNotification(subscription, payload, options) {
      calls.sends.push({ endpoint: subscription.endpoint, payload: JSON.parse(payload), options });
      return onSend?.(subscription, { advance, calls });
    },
  };
  const testModule = { exports: {} };
  const requireStub = (name) => {
    if (name === 'server-only') return {};
    if (name === 'web-push') return webpush;
    if (name === '@/lib/supabase/admin') return { createServiceClient: () => supabase };
    throw new Error(`Import inesperado no dispatcher: ${name}`);
  };
  new Function('require', 'module', 'exports', 'process', 'Date', dispatchModule)(requireStub, testModule, testModule.exports, {
    env: { NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'test-public-key', VAPID_PRIVATE_KEY: 'test-private-key' },
  }, FakeDate);
  return { dispatch: testModule.exports.dispatchLeadPushNotifications, tables, calls, advance };
}

const routing = createPushHarness({
  leads: [testLead('assigned-lead'), testLead('unassigned-lead', { responsavel_id: null })],
  notifications: [testNotification('assigned-notification', 'assigned-lead'), testNotification('owner-notification', 'unassigned-lead')],
  members: [testMember('assigned'), testMember('other'), testMember('owner', 'owner')],
  subscriptions: [testSubscription('device-a', 'assigned'), testSubscription('device-other', 'other'), testSubscription('device-owner', 'owner')],
});
assert.equal((await routing.dispatch()).sent, 2);
assert.deepEqual(routing.calls.sends.map((call) => call.endpoint), ['https://push.example.invalid/device-a', 'https://push.example.invalid/device-owner'], 'Ação vencida vai ao responsável; sem responsável vai ao owner.');
assert.ok(routing.calls.claims.length >= 2);

const feedback = createPushHarness({
  leads: [],
  notifications: [testNotification('feedback-notification', null, { tipo: 'novo_feedback' })],
  members: [testMember('assigned'), { ...testMember('owner', 'owner'), notificar_novos_leads: false, notificar_acoes_vencidas: false }],
  subscriptions: [testSubscription('device-a', 'assigned'), testSubscription('device-owner', 'owner')],
});
assert.equal((await feedback.dispatch()).sent, 1, 'Feedback sem lead deve continuar elegivel.');
assert.deepEqual(feedback.calls.sends.map((call) => call.endpoint), ['https://push.example.invalid/device-owner'], 'Feedback respeita owner-only, independente das preferencias de leads.');
const resolvedLeads = [
  testLead('converted', { status: 'convertido' }),
  testLead('discarded', { status: 'desqualificado' }),
  testLead('no-action', { proxima_acao_em: null }),
  testLead('rescheduled', { proxima_acao_em: '2026-10-01T12:00:00.000Z' }),
  testLead('archived', { arquivado_em: '2026-09-29T00:00:00.000Z' }),
  testLead('anonymized', { anonimizado_em: '2026-09-29T00:00:00.000Z' }),
];
const resolved = createPushHarness({
  leads: resolvedLeads,
  notifications: [...resolvedLeads.map((lead) => testNotification(`notification-${lead.id}`, lead.id)), testNotification('notification-deleted', 'missing')],
});
assert.equal((await resolved.dispatch()).skipped, 7);
assert.equal(resolved.calls.sends.length, 0, 'Pendências resolvidas ou leads removidos não devem gerar push.');
assert.ok(resolved.tables.lead_notification_outbox.every((row) => row.estado === 'skipped_resolved'));

let deviceBUnavailable = true;
const retry = createPushHarness({
  leads: [testLead('retry-lead')],
  notifications: [testNotification('retry-notification', 'retry-lead')],
  subscriptions: [testSubscription('device-a', 'assigned'), testSubscription('device-b', 'assigned')],
  onSend(subscription) {
    if (deviceBUnavailable && subscription.endpoint.endsWith('/device-b')) throw Object.assign(new Error('Serviço indisponível'), { statusCode: 503 });
  },
});
assert.equal((await retry.dispatch()).failed, 1);
assert.deepEqual(retry.tables.lead_notification_outbox[0].delivered_subscription_ids, ['device-a']);
assert.equal(retry.tables.lead_notification_outbox[0].estado, 'failed');
deviceBUnavailable = false;
retry.advance(120_000);
assert.equal((await retry.dispatch()).sent, 1);
assert.deepEqual(retry.calls.sends.map((call) => call.endpoint.split('/').at(-1)), ['device-a', 'device-b', 'device-b'], 'Retry não repete dispositivo cujo recibo já foi persistido.');
assert.deepEqual(retry.tables.lead_notification_outbox[0].delivered_subscription_ids, ['device-a', 'device-b']);

const deferred = createPushHarness({
  leads: [testLead('slow-lead'), testLead('tail-lead')],
  notifications: [testNotification('slow-notification', 'slow-lead'), testNotification('tail-notification', 'tail-lead')],
  subscriptions: [testSubscription('device-a', 'assigned'), testSubscription('device-b', 'assigned'), testSubscription('device-c', 'assigned')],
  onSend(_subscription, { advance, calls }) { if (calls.sends.length === 1) advance(4_000); },
});
assert.equal((await deferred.dispatch({ budgetMs: 5_000 })).claimed, 1);
const [deferredRow, untouchedRow] = deferred.tables.lead_notification_outbox;
assert.equal(deferredRow.estado, 'pending');
assert.equal(deferredRow.tentativas, 0, 'Adiar dispositivos por prazo não consome uma tentativa da notificação.');
assert.deepEqual(deferredRow.delivered_subscription_ids, ['device-a', 'device-b']);
assert.equal(deferred.calls.sends.length, 2, 'O terceiro dispositivo deve aguardar outra execução.');
assert.equal(untouchedRow.estado, 'pending');
assert.equal(untouchedRow.tentativas, 0, 'A cauda não pode ser reivindicada antecipadamente.');
assert.equal(deferred.calls.claims.length, 1);

const slowRead = createPushHarness({
  leads: [testLead('slow-read-lead')],
  notifications: [testNotification('slow-read-notification', 'slow-read-lead', { tentativas: 4 })],
  onRead(table, { advance }) { if (table === 'leads') advance(4_000); },
});
await slowRead.dispatch({ budgetMs: 5_000 });
assert.equal(slowRead.calls.sends.length, 0);
assert.equal(slowRead.tables.lead_notification_outbox[0].estado, 'pending');
assert.equal(slowRead.tables.lead_notification_outbox[0].tentativas, 4, 'Consulta lenta não deve esgotar tentativas antes do primeiro envio.');

let firstBatchUnavailable = true;
const rotatingRetry = createPushHarness({
  leads: [testLead('rotating-lead')],
  notifications: [testNotification('rotating-notification', 'rotating-lead', { delivered_subscription_ids: ['device-e'] })],
  // Ordem recebida do banco não pode decidir quem fica sem tentativa.
  subscriptions: ['d', 'e', 'b', 'c', 'a'].map((suffix) => testSubscription(`device-${suffix}`, 'assigned')),
  onSend(subscription, { advance, calls }) {
    if (calls.sends.length === 1 || calls.sends.length === 3) advance(4_000);
    if (firstBatchUnavailable && /\/device-[ab]$/.test(subscription.endpoint)) {
      throw Object.assign(new Error('Timeout simulado no primeiro lote'), { statusCode: 503 });
    }
  },
});
assert.equal((await rotatingRetry.dispatch({ budgetMs: 5_000 })).failed, 1);
const rotatingRow = rotatingRetry.tables.lead_notification_outbox[0];
assert.equal(rotatingRow.estado, 'failed', 'Falha real continua falha mesmo se o prazo adiar outros dispositivos.');
assert.equal(rotatingRow.tentativas, 1, 'Falha real consome tentativa; não pode permanecer em retry infinito.');
assert.equal(Date.parse(rotatingRow.proxima_tentativa_em) - Date.parse(rotatingRow.atualizado_em), 120_000, 'Falha real mantém o backoff normal.');
assert.deepEqual(rotatingRow.delivered_subscription_ids, ['device-e']);
rotatingRetry.advance(120_000);
assert.equal((await rotatingRetry.dispatch({ budgetMs: 5_000 })).failed, 0);
assert.deepEqual(rotatingRetry.calls.sends.map((call) => call.endpoint.split('/').at(-1)), ['device-a', 'device-b', 'device-c', 'device-d'], 'O retry inicia pela cauda pendente e ignora recibos anteriores.');
assert.equal(rotatingRow.estado, 'pending');
assert.equal(rotatingRow.tentativas, 1, 'Adiamento sem nova falha preserva o contador anterior.');
assert.equal(Date.parse(rotatingRow.proxima_tentativa_em) - Date.parse(rotatingRow.atualizado_em), 60_000);
assert.deepEqual(rotatingRow.delivered_subscription_ids, ['device-e', 'device-c', 'device-d']);
firstBatchUnavailable = false;
rotatingRetry.advance(60_000);
assert.equal((await rotatingRetry.dispatch({ budgetMs: 5_000 })).sent, 1);
assert.deepEqual(rotatingRetry.calls.sends.map((call) => call.endpoint.split('/').at(-1)), ['device-a', 'device-b', 'device-c', 'device-d', 'device-a', 'device-b']);
assert.deepEqual(new Set(rotatingRow.delivered_subscription_ids), new Set(['device-a', 'device-b', 'device-c', 'device-d', 'device-e']));

// Estes casos validam recibos duráveis, não exactly-once: queda entre aceitação
// pelo provedor e persistência do recibo ainda permite reenvio na execução seguinte.
console.log('PASSOU: DDI, save concorrente, revisão PDF, retry idempotente e dispatcher com responsável, recibos e prazo.');
