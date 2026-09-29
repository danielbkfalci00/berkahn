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
const hashStart = pdfSource.indexOf('const DOCUMENT_FIELDS =');
const hashEnd = pdfSource.indexOf('const BUCKET_PDFS =', hashStart);
assert.ok(hashStart >= 0 && hashEnd > hashStart, 'Hash real não encontrado.');
const { getOrcamentoPdfRevision, isOrcamentoPdfCurrent } = await loadTypeScript(
  `import { createHash } from 'node:crypto';\n${pdfSource.slice(hashStart, hashEnd)}`
);
const budget = { numero: 'TEST-001', cliente_nome: 'Cliente sintético', valor_min: 100, hero_image_url: 'test/hero.webp' };
const revision = getOrcamentoPdfRevision(budget);
assert.equal(getOrcamentoPdfRevision({ ...budget, atualizado_em: '2026-09-29', pdf_url: 'https://example.invalid/new-token', lead_id: 'other' }), revision);
assert.notEqual(getOrcamentoPdfRevision({ ...budget, valor_min: 101 }), revision);
assert.notEqual(getOrcamentoPdfRevision({ ...budget, hero_image_url: 'test/new-hero.webp' }), revision);
assert.equal(isOrcamentoPdfCurrent({ ...budget, pdf_revision_hash: revision, pdf_storage_path: 'test/document.pdf' }), true);
assert.equal(isOrcamentoPdfCurrent({ ...budget, valor_min: 101, pdf_revision_hash: revision, pdf_storage_path: 'test/document.pdf' }), false);

// Executa as actions e a rota reais, substituindo apenas banco, storage e Next.
function loadCommonModule(source, imports) {
  const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const testModule = { exports: {} };
  new Function('require', 'module', 'exports', output)((name) => {
    assert.ok(Object.hasOwn(imports, name), `Import inesperado: ${name}`);
    return imports[name];
  }, testModule, testModule.exports);
  return testModule.exports;
}
const budgetTypes = loadCommonModule(readFileSync(new URL('../types/orcamento-estimativa.ts', import.meta.url), 'utf8'), {});
const wizardModule = loadCommonModule(wizardSource, { '@/types/orcamento-estimativa': budgetTypes });
const planilhaModule = loadCommonModule(readFileSync(new URL('../lib/orcamento-planilha.ts', import.meta.url), 'utf8'), { papaparse: Papa, '@/types/orcamento-estimativa': budgetTypes, '@/components/admin/orcamentos/wizard-state': wizardModule });
const actionsSource = readFileSync(new URL('../app/admin/orcamentos/actions.ts', import.meta.url), 'utf8');
const heroSource = readFileSync(new URL('../app/api/admin/orcamentos/[id]/hero/route.ts', import.meta.url), 'utf8');
const pdfUrlSource = readFileSync(new URL('../app/api/admin/orcamentos/[id]/pdf-url/route.ts', import.meta.url), 'utf8');
const initialRevision = '2026-09-29T16:00:00.000000+00:00';
function createBudgetHarness({ onUpdate, signingFails = false, loseFirstCreateResponse = false, normalizeStoredValues = (value) => value } = {}) {
  let version = 0;
  let responseLost = false;
  const row = { ...wizardModule.initialState().dados, id: 'budget-test', numero: 'TEST-001', atualizado_em: initialRevision, cliente_nome: 'Cliente sintético', obra_endereco: 'Endereço sintético', obra_cidade: 'Cidade', projeto_area_m2: 100, valor_min: 100, valor_max: 200, valor_m2_min: 1, valor_m2_max: 2, hero_image_url: 'budget-test/old.webp' };
  const calls = { writes: 0, logs: 0, signedPdfs: 0, uploaded: [], removed: [] };
  const nextRevision = () => `2026-09-29T16:00:00.${String(++version).padStart(6, '0')}+00:00`;
  const supabase = {
    from(table) {
      assert.ok(['orcamentos', 'activity_logs'].includes(table));
      const filters = [];
      let patch;
      let insertion = false;
      const execute = async () => {
        if (table === 'activity_logs') { calls.logs++; return { error: null }; }
        if (insertion && patch.id && patch.id === row.id) return { data: null, error: { code: '23505', message: 'Chave já existente' } };
        if (patch && !insertion) await onUpdate?.(row, { nextRevision });
        if (!filters.every(([key, value]) => row[key] === value)) return { data: null, error: null };
        if (patch) { Object.assign(row, normalizeStoredValues(patch), { atualizado_em: nextRevision() }); calls.writes++; }
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
      assert.equal(bucket, 'orcamento-heroes');
      return {
        async upload(path) { calls.uploaded.push(path); return { error: null }; },
        async createSignedUrl(path) { return signingFails ? { data: null, error: { message: 'Assinatura indisponível' } } : { data: { signedUrl: `https://example.invalid/${path}` }, error: null }; },
        async remove(paths) { calls.removed.push(...paths); return { error: null }; },
      };
    } },
  };
  const cache = { revalidatePath() {} };
  const session = { async getAdminSession() { return { supabase, user: { id: 'synthetic-user', email: 'test@example.invalid' }, membership: { role: 'owner' } }; }, async exigirSessao() { return null; } };
  const actions = loadCommonModule(actionsSource, { 'next/cache': cache, 'node:util': { isDeepStrictEqual }, '@/lib/supabase/sessao': session, '@/components/admin/orcamentos/wizard-state': wizardModule, '@/lib/orcamento-planilha': planilhaModule });
  const sharp = () => { const image = { resize() { return image; }, webp() { return image; }, async toBuffer() { return Buffer.from('synthetic-image'); } }; return image; };
  const hero = loadCommonModule(heroSource, { 'next/cache': cache, 'next/server': { NextResponse: Response }, sharp, 'node:crypto': { randomUUID: () => 'new-upload' }, '@/lib/supabase/admin': { createServiceClient: () => supabase }, '@/lib/supabase/sessao': session });
  const pdfUrl = loadCommonModule(pdfUrlSource, { 'next/server': { NextResponse: Response }, '@/lib/supabase/admin': { createServiceClient: () => supabase }, '@/lib/supabase/sessao': session, '@/lib/orcamento-pdf-storage': { isOrcamentoPdfCurrent, async gerarSignedUrlPdf() { calls.signedPdfs++; return 'https://example.invalid/current.pdf'; } } });
  return { row, calls, actions, hero, pdfUrl };
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
