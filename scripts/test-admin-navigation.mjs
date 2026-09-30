import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual shared hook, without Next, a server, or a database.
// Separate from editorial tests: the guard is also used by leads and budgets.
const filename = new URL('../hooks/use-unsaved-changes.ts', import.meta.url);
const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const origin = 'https://admin.example.test';
const returnHelpers = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/admin/return-to.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: returnHelpers, URL, URLSearchParams });
const nextState = (page) => ({ __NA: true, __PRIVATE_NEXTJS_INTERNALS_TREE: { page }, other: 'preserved' });

class Hub {
  listeners = new Map();
  addEventListener(type, listener, options = false) {
    const list = this.listeners.get(type) ?? [];
    const capture = options === true || options?.capture === true;
    if (!list.some((entry) => entry.listener === listener && entry.capture === capture)) list.push({ listener, capture });
    this.listeners.set(type, list);
  }
  removeEventListener(type, listener, options = false) {
    const capture = options === true || options?.capture === true;
    this.listeners.set(type, (this.listeners.get(type) ?? []).filter((entry) => entry.listener !== listener || entry.capture !== capture));
  }
  count(type) { return (this.listeners.get(type) ?? []).length; }
  emit(type, properties = {}) {
    const event = {
      type, cancelable: true, defaultPrevented: false, stopped: false,
      preventDefault() { if (this.cancelable) this.defaultPrevented = true; },
      stopImmediatePropagation() { this.stopped = true; },
      ...properties,
    };
    const list = [...(this.listeners.get(type) ?? [])].sort((a, b) => Number(b.capture) - Number(a.capture));
    for (const { listener } of list) {
      listener(event);
      if (event.stopped) break;
    }
    return event;
  }
}

function harness({ navigationApi = false, cancelable = true, pages = ['/admin'] } = {}) {
  const window = new Hub();
  const document = new Hub();
  const navigation = navigationApi ? new Hub() : undefined;
  const location = { href: `${origin}${pages.at(-1)}` };
  const tasks = [];
  const timers = [];
  const answers = [];
  const prompts = [];
  const observedPops = [];

  class MockHistory {
    entries = pages.map((page) => ({ url: `${origin}${page}`, state: nextState(page) }));
    index = pages.length - 1;
    get state() { return this.entries[this.index].state; }
    pushState(state, _unused, url) {
      const entry = { state: structuredClone(state), url: new URL(url ?? location.href, location.href).href };
      this.entries.splice(this.index + 1, Infinity, entry);
      this.index += 1;
      location.href = entry.url;
    }
    replaceState(state, _unused, url) {
      const entry = { state: structuredClone(state), url: new URL(url ?? location.href, location.href).href };
      this.entries[this.index] = entry;
      location.href = entry.url;
    }
    go(delta) {
      tasks.push(() => {
        const index = this.index + delta;
        if (index < 0 || index >= this.entries.length) return;
        const entry = this.entries[index];
        const event = navigation?.emit('navigate', {
          navigationType: 'traverse', cancelable,
          destination: { url: entry.url, sameDocument: true },
          signal: new AbortController().signal,
        });
        if (event?.defaultPrevented) return;
        this.index = index;
        location.href = entry.url;
        window.emit('popstate', { state: this.state, cancelable: false });
      });
    }
  }
  class Element {
    constructor(href, options = {}) {
      this.href = new URL(href, location.href).href;
      this.target = options.target ?? '';
      this.download = options.download ?? false;
    }
    closest(selector) { return selector === 'a[href]' ? this : null; }
    hasAttribute(name) { return name === 'download' && this.download; }
  }
  const history = new MockHistory();
  Object.assign(window, {
    history, location, navigation,
    confirm(message) {
      prompts.push(message);
      assert.ok(answers.length, 'An unexpected confirmation was requested');
      return answers.shift();
    },
    setTimeout(callback) { timers.push(callback); return timers.length; },
  });

  // Keep refs and effect dependencies across renders, and run real cleanups.
  const components = new Map();
  let rendering;
  const react = {
    useRef(initial) {
      const index = rendering.cursor++;
      rendering.slots[index] ??= { current: initial };
      return rendering.slots[index];
    },
    useEffect(effect, deps) {
      const index = rendering.cursor++;
      const previous = rendering.slots[index];
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        const component = rendering;
        component.pending.push(() => {
          previous?.cleanup?.();
          component.slots[index] = { deps, cleanup: effect() };
        });
      }
    },
    useCallback(callback) { rendering.cursor++; return callback; },
  };
  const testModule = { exports: {} };
  vm.runInNewContext(source, {
    module: testModule, exports: testModule.exports,
    require(name) { assert.equal(name, 'react'); return react; },
    window, document, History: MockHistory, Element, URL,
  }, { filename: filename.pathname });
  const api = testModule.exports;

  // Next registers a bubbling popstate listener. Our capture listener must
  // protect the mounted editor even when Next registered first.
  window.addEventListener('popstate', () => observedPops.push(location.href));

  return {
    api, history, window, document, location, prompts, answers, observedPops,
    render(id, dirty) {
      rendering = components.get(id) ?? { slots: [], pending: [], cursor: 0 };
      rendering.cursor = 0;
      components.set(id, rendering);
      const confirmLeave = api.useUnsavedChanges(dirty);
      for (const effect of rendering.pending.splice(0)) effect();
      rendering = null;
      return confirmLeave;
    },
    unmount(id) {
      const component = components.get(id);
      for (const slot of component?.slots ?? []) slot?.cleanup?.();
      components.delete(id);
    },
    click(path, options = {}) {
      return document.emit('click', {
        button: options.button ?? 0, target: new Element(path, options),
        ctrlKey: options.ctrlKey, metaKey: options.metaKey,
        shiftKey: options.shiftKey, altKey: options.altKey,
      });
    },
    flushTraversal() {
      let count = 0;
      while (tasks.length) {
        assert.ok(count++ < 10, 'History rollback must not loop');
        tasks.shift()();
      }
    },
    flushTimers() { while (timers.length) timers.shift()(); },
  };
}

{
  const h = harness();
  h.render('post', false);
  h.render('lead', false);
  assert.equal(h.window.count('beforeunload'), 0);
  h.render('post', true);
  const confirmLeave = h.render('lead', true);
  assert.equal(h.window.count('beforeunload'), 1);
  assert.equal(h.document.count('click'), 1);

  h.answers.push(false);
  const cancelled = h.click('/admin/leads');
  assert.equal(cancelled.defaultPrevented, true);
  assert.equal(cancelled.stopped, true);
  assert.equal(h.prompts.length, 1, 'Multiple dirty editors share one link confirmation');
  h.answers.push(true);
  assert.equal(h.click('/admin/leads').defaultPrevented, false);
  assert.equal(h.prompts.length, 2);
  assert.equal(h.window.emit('beforeunload').defaultPrevented, false, 'Accepted native link does not ask twice');
  h.flushTimers();
  assert.equal(h.window.emit('beforeunload').defaultPrevented, true);

  h.answers.push(false, true);
  assert.equal(h.api.confirmUnsavedChanges(), false, 'Logout can be cancelled');
  assert.equal(confirmLeave(), true, 'Imperative navigation uses the same registry');
  assert.equal(h.prompts.length, 4);
  for (const options of [{ target: '_blank' }, { ctrlKey: true }, { metaKey: true }, { download: true }]) h.click('/admin/leads', options);
  h.click('/admin#section');
  assert.equal(h.prompts.length, 4, 'New tabs, downloads and hash changes keep the editor');

  h.render('post', false);
  assert.equal(h.window.count('beforeunload'), 1, 'The second dirty editor is still protected');
  h.unmount('lead');
  assert.equal(h.window.count('beforeunload'), 0);
  assert.equal(h.api.confirmUnsavedChanges(), true);
  h.unmount('post');
  h.render('post', true);
  assert.equal(h.document.count('click'), 1, 'Strict-mode remount does not duplicate global listeners');
  h.unmount('post');
  assert.equal(h.window.count('beforeunload'), 0);
}

{
  const h = harness({ navigationApi: true });
  h.api.installUnsavedNavigationGuard();
  h.history.pushState(nextState('/admin/posts/1'), '', '/admin/posts/1');
  h.render('post', true);
  h.answers.push(false);
  h.history.go(-1);
  h.flushTraversal();
  assert.equal(h.location.href, `${origin}/admin/posts/1`);
  assert.equal(h.observedPops.length, 0, 'Navigation API cancels before the router receives a traversal');
  assert.equal(h.prompts.length, 1);
  h.answers.push(true);
  h.history.go(-1);
  h.flushTraversal();
  assert.equal(h.location.href, `${origin}/admin`);
  assert.equal(h.observedPops.length, 1);
  assert.equal(h.prompts.length, 2, 'Accepted Navigation API traversal skips a second popstate prompt');
}

for (const navigationApi of [false, true]) {
  // Also cover a browser exposing Navigation API with a noncancelable event.
  const h = harness({ navigationApi, cancelable: false });
  h.api.installUnsavedNavigationGuard();
  h.history.pushState(nextState('/admin/posts/1'), '', '/admin/posts/1');
  const originalState = structuredClone(h.history.state);
  h.render('post', true);
  h.answers.push(false);
  h.history.go(-1);
  h.flushTraversal();
  assert.equal(h.location.href, `${origin}/admin/posts/1`);
  assert.deepEqual(h.history.state, originalState, 'Rollback preserves all Next state and its original marker');
  assert.equal(h.history.entries.length, 2, 'Tracked rollback preserves the forward branch');
  assert.equal(h.prompts.length, 1, 'Our rollback never asks a second time');
  assert.equal(h.observedPops.length, 0, 'Neither cancelled traversal nor rollback reaches Next');

  // A saved-version push/replace must not ask about the previous dirty render.
  h.history.pushState(nextState('/admin/leads'), '', '/admin/leads');
  h.history.replaceState(nextState('/admin/leads'), '', '/admin/leads');
  assert.equal(h.prompts.length, 1);
  h.render('post', false);
  h.history.go(-1);
  h.flushTraversal();
  h.observedPops.length = 0;
  h.render('post', true);
  h.answers.push(false);
  h.history.go(1);
  h.flushTraversal();
  assert.equal(h.location.href, `${origin}/admin/posts/1`);
  assert.equal(h.history.entries.length, 3);
  assert.equal(h.observedPops.length, 0);
  assert.equal(h.prompts.length, 2);
  h.answers.push(true);
  h.history.go(1);
  h.flushTraversal();
  assert.equal(h.location.href, `${origin}/admin/leads`);
  assert.equal(h.observedPops.length, 1);
  assert.equal(h.prompts.length, 3);
}

{
  const h = harness({ pages: ['/legacy', '/admin/posts/1'] });
  h.render('post', true);
  h.answers.push(false);
  h.history.go(-1);
  h.flushTraversal();
  assert.equal(h.location.href, `${origin}/admin/posts/1`, 'Unindexed legacy entry still cannot discard the editor');
  assert.equal(h.history.state.__NA, true);
  assert.equal(h.history.state.__PRIVATE_NEXTJS_INTERNALS_TREE.page, '/admin/posts/1');
  assert.equal(h.history.state.other, 'preserved');
  assert.equal(h.observedPops.length, 0);
  assert.equal(h.prompts.length, 1);
  h.unmount('post');
  assert.equal(h.window.count('beforeunload'), 0);
}

// Local, ignored harness pages must never become public through a local production build.
{
  const proxyCode = ts.transpileModule(readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  class ResponseStub {
    constructor(body, init = {}) { this.body = body; this.status = init.status ?? 200; }
    static next() { return { status: 200 }; }
    static redirect(url, status = 307) { return { status, url: String(url) }; }
    static json(body, init) { return new ResponseStub(body, init); }
  }
  const output = {};
  const environment = { env: { NODE_ENV: 'production' } };
  let sessionCalls = 0;
  vm.runInNewContext(proxyCode, {
    exports: output, URL, process: environment,
    require: (name) => {
      if (name === 'next/server') return { NextResponse: ResponseStub };
      if (name === '@/lib/supabase/middleware') return { updateSession: async () => { sessionCalls++; return { status: 200 }; } };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  const request = (path) => ({ url: `https://localhost${path}`, headers: { get: () => 'localhost' }, nextUrl: new URL(`https://localhost${path}`) });
  assert.ok(output.config.matcher.includes('/dev-harness/:path*'));
  for (const path of ['/dev-harness', '/dev-harness/pauta', '/dev-harness/documento?slug=test']) {
    assert.equal((await output.proxy(request(path))).status, 404);
  }
  assert.equal(sessionCalls, 0, 'Harness is blocked before any privileged lookup');
  assert.equal((await output.proxy(request('/admin/leads'))).status, 200);
  assert.equal(sessionCalls, 1, 'Administrative session checks remain active');
  environment.env.NODE_ENV = 'development';
  assert.equal((await output.proxy(request('/dev-harness/pauta'))).status, 200);
}

// Editorial navigation keeps the list context through pauta and post editors,
// without allowing a query-string destination to escape the editorial routes.
{
  const helperFilename = new URL('../lib/admin/return-to.ts', import.meta.url);
  const helpers = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(helperFilename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports: helpers, URL, URLSearchParams });
  const { editorialReturnTo, editorialHref, postsListHref } = helpers;
  const list = postsListHref('steel frame', 'draft', 3);
  assert.equal(list, '/admin/posts?q=steel+frame&status=draft&page=3');
  assert.equal(postsListHref('', 'all', 1), '/admin/posts');
  assert.equal(editorialReturnTo(list, '/admin/posts'), list);
  const newPost = new URL(editorialHref('/admin/posts/new', list), origin);
  assert.equal(editorialReturnTo(newPost.searchParams.get('returnTo'), '/admin/posts'), list);

  const board = '/admin/conteudo?conteudo_visao=linkedin&conteudo_q=steel+frame&conteudo_prazo=atrasadas';
  const pautaPath = '/admin/conteudo/12345678-1234-1234-1234-123456789abc';
  const pauta = editorialHref(pautaPath, board);
  const editor = new URL(editorialHref('/admin/posts/123', pauta), origin);
  const backToPauta = editorialReturnTo(editor.searchParams.get('returnTo'), '/admin/posts');
  assert.equal(backToPauta, pauta);
  const backToBoard = editorialReturnTo(new URL(backToPauta, origin).searchParams.get('returnTo'), '/admin/conteudo');
  assert.equal(backToBoard, board, 'Pauta → editor → pauta preserves the board filters');
  const guarded = harness({ pages: [pauta] });
  guarded.render('pauta', true);
  guarded.answers.push(false);
  assert.equal(guarded.click(editor.pathname + editor.search).defaultPrevented, true, 'Editorial links still prompt before discarding unsaved changes');
  guarded.unmount('pauta');
  assert.equal(editorialReturnTo(`${board}&nova=1`, '/admin/conteudo'), board, 'Returning does not reopen the transient creation form');
  assert.equal(editorialReturnTo(`${pautaPath}?returnTo=${encodeURIComponent(pauta)}`, '/admin/conteudo'), pautaPath, 'Detail chains cannot loop');

  for (const destination of [
    undefined, null, ['/admin/posts'], 123, 'https://example.test/admin/posts',
    '//example.test/admin/posts', '/\\example.test/admin/posts',
    '/admin/posts-malicioso', '/admin/posts/123', '/admin/login', '/admin/logout',
    '/admin/conteudo/invalid', '/admin/conteudo/../posts', '/admin/%70osts',
    '/admin/posts\n', 'javascript:alert(1)', '/admin/posts?' + 'q'.repeat(4096),
  ]) {
    assert.equal(editorialReturnTo(destination, '/admin/conteudo'), '/admin/conteudo');
  }
  assert.equal(editorialReturnTo(`${pautaPath}?returnTo=https%3A%2F%2Fexample.test`, '/admin/conteudo'), pautaPath);

  // A stale/deleted final page must recover while preserving search and status.
  // Exercise the server page against successful, empty and failed queries.
  const postsSource = ts.transpileModule(readFileSync(new URL('../app/admin/posts/page.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  let response;
  const calls = [];
  const query = {
    select() { return this; },
    eq(...args) { calls.push(['eq', ...args]); return this; },
    or(...args) { calls.push(['or', ...args]); return this; },
    order() { return this; },
    async range(...args) { calls.push(['range', ...args]); return response; },
  };
  const pageModule = {};
  const element = (type, props) => ({ type, props });
  vm.runInNewContext(postsSource, {
    exports: pageModule, URLSearchParams, console: { error() {} },
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element };
      if (name === '@/lib/supabase/server') return { createClient: async () => ({ from: () => query }) };
      if (name === '@/lib/admin/return-to') return helpers;
      if (name === 'next/navigation') return { redirect(path) { throw Object.assign(new Error('redirect'), { destination: path }); } };
      if (name === 'next/link') return { default: 'Link' };
      if (name === '@/components/admin/posts/PostsTable') return { PostsTable: 'PostsTable' };
      if (name === '@/components/ui/button') return { Button: 'Button' };
      if (name === 'lucide-react') return { Plus: 'Plus' };
      throw new Error(`Unexpected posts import: ${name}`);
    },
  });
  const renderPosts = (page = '3') => pageModule.default({ searchParams: Promise.resolve({ q: 'steel frame', status: 'draft', page }) });
  response = { data: [], error: null, count: 31 };
  await assert.rejects(renderPosts(), (error) => error.destination === postsListHref('steel frame', 'draft', 2));
  response = { data: [], error: null, count: 0 };
  await assert.rejects(renderPosts(), (error) => error.destination === postsListHref('steel frame', 'draft', 1));
  response = { data: null, error: { code: 'PGRST103', message: 'Range not satisfiable' }, count: null };
  await assert.rejects(renderPosts(), (error) => error.destination === postsListHref('steel frame', 'draft', 1));
  response = { data: null, error: { code: 'unavailable', message: 'Offline' }, count: null };
  const failure = await renderPosts();
  assert.equal(failure.props.children[1].props.role, 'alert', 'A connection error is not treated as an empty collection');
  response = { data: [{ id: '1' }], error: null, count: 61 };
  const valid = await renderPosts();
  const createLink = valid.props.children[0].props.children[1];
  assert.equal(new URL(createLink.props.href, origin).searchParams.get('returnTo'), list);
  assert.equal(valid.props.children[1].props.page, 3);
  assert.ok(calls.some((call) => call[0] === 'eq' && call[1] === 'status' && call[2] === 'draft'));
  const duplicatedParams = await pageModule.default({ searchParams: Promise.resolve({ q: ['steel', 'frame'], status: ['draft', 'published'], page: ['3', '4'] }) });
  assert.equal(duplicatedParams.props.children[1].props.search, '');
  assert.equal(duplicatedParams.props.children[1].props.statusFilter, 'all');
  assert.equal(duplicatedParams.props.children[1].props.page, 1);
}

// Render the actual CRM components with minimal hooks and deferred actions.
// No browser, server or database is needed to exercise request ordering.
{
  const crmSource = ts.transpileModule(readFileSync(new URL('../components/admin/analytics/LeadsQueue.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
  };
  function crmHarness(actions = {}, search = "") {
    const slots = [], effects = [], transitions = [];
    let cursor = 0, changed = false, component, props;
    const react = {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = { value: typeof initial === 'function' ? initial() : initial };
        return [slots[index].value, (next) => {
          const value = typeof next === 'function' ? next(slots[index].value) : next;
          if (!Object.is(value, slots[index].value)) { slots[index].value = value; changed = true; }
        }];
      },
      useRef(initial) { const index = cursor++; slots[index] ??= { current: initial }; return slots[index]; },
      useEffect(effect, deps) {
        const index = cursor++, previous = slots[index];
        if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
          slots[index] = { deps };
          effects.push(() => { previous?.cleanup?.(); slots[index].cleanup = effect(); });
        }
      },
      useMemo(compute) { cursor++; return compute(); },
      useTransition() { cursor++; return [false, (callback) => { transitions.push(Promise.resolve(callback())); }]; },
    };
    const element = (type, elementProps, key) => ({ type, props: elementProps, key });
    const symbols = new Proxy({}, { get: (_, name) => String(name) });
    const api = {};
    vm.runInNewContext(crmSource, {
      exports: api, URLSearchParams, console,
      require(name) {
        if (name === 'react') return react;
        if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element, Fragment: 'Fragment' };
        if (name === 'next/link') return { default: 'Link' };
        if (name === 'next/navigation') return { useRouter: () => ({ refresh() {}, push() {} }), useSearchParams: () => new URLSearchParams(search) };
        if (name === '@/app/admin/leads/actions') return { getLeadPreview: async () => ({ status: 'ok', data: {} }), markLeadViewed: async () => ({ ok: true }), ...actions };
        if (name === '@/hooks/use-unsaved-changes') return { useUnsavedChanges: () => () => true };
        if (name === '@/lib/admin/return-to') return returnHelpers;
        if (name === '@/lib/contact') return { normalizeLeadPhone: () => '' };
        if (name === '@/lib/supabase/client') return { createClient() { throw new Error('Unexpected database access'); } };
        if (['lucide-react', '@radix-ui/react-dialog', '@dnd-kit/core', '@dnd-kit/utilities'].includes(name)) return symbols;
        throw new Error(`Unexpected CRM import: ${name}`);
      },
    });
    return {
      transitions,
      render(name, nextProps) {
        component = api[name]; props = nextProps;
        let tree, count = 0;
        do {
          assert.ok(count++ < 10, 'CRM effects should settle');
          changed = false; cursor = 0;
          tree = component(props);
          for (const effect of effects.splice(0)) effect();
        } while (changed);
        return tree;
      },
      unmount() { for (const slot of slots) slot?.cleanup?.(); },
    };
  }
  function nodes(tree, predicate) {
    if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, predicate));
    if (!tree || typeof tree !== 'object' || !tree.props) return [];
    return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props.children, predicate)];
  }
  const componentProps = (tree, name) => nodes(tree, (node) => node.type?.name === name)[0]?.props;
  const leadA = { id: 'a', nome: 'Lead A', status: 'novo', prioridade: 'normal', tipo_captacao: 'contato', visualizado_em: '2026-09-29T10:00:00Z' };
  const leadB = { ...leadA, id: 'b', nome: 'Lead B', visualizado_em: null };
  const queueProps = { initialLeads: [leadA, leadB], allStageLeads: [leadA, leadB], total: 2, page: 1, pageCount: 1, kpis: { status: 'ok', data: {} }, responsibles: [], view: 'inbox' };
  const trigger = { isConnected: false, focus() {} };

  for (const nextSelection of ['other', 'closed']) {
    const mutation = deferred();
    const h = crmHarness({ updateLeadStatus: () => mutation.promise });
    let tree = h.render('LeadsQueue', queueProps);
    componentProps(tree, 'LeadInbox').onOpen(leadA, trigger);
    tree = h.render('LeadsQueue', queueProps);
    componentProps(tree, 'LeadQuickView').onStatusChange('a', 'em_contato');
    tree = h.render('LeadsQueue', queueProps);
    assert.equal(componentProps(tree, 'LeadQuickView').lead.status, 'em_contato');
    componentProps(tree, 'LeadQuickView').onClose();
    if (nextSelection === 'other') componentProps(tree, 'LeadInbox').onOpen(leadB, trigger);
    tree = h.render('LeadsQueue', queueProps);
    assert.equal(componentProps(tree, 'LeadQuickView').savingStatus, false, 'A pending mutation is not presented as saving B');
    mutation.resolve({ ok: false, error: 'Falha simulada.' });
    await Promise.all(h.transitions);
    tree = h.render('LeadsQueue', queueProps);
    const quickView = componentProps(tree, 'LeadQuickView');
    assert.equal(quickView.lead?.id ?? null, nextSelection === 'other' ? 'b' : null, 'Rollback never reopens or replaces the selected lead');
    assert.equal(quickView.error, null, 'A failure for A is not attributed to B');
    const inbox = componentProps(tree, 'LeadInbox');
    assert.equal(inbox.leads.find((lead) => lead.id === 'a').status, 'novo');
    if (nextSelection === 'other') assert.ok(inbox.leads.find((lead) => lead.id === 'b').visualizado_em, 'Rollback preserves B’s newer viewed state');
    assert.ok(nodes(tree, (node) => node.props.role === 'alert').some((node) => node.props.children.includes('Lead A')));
    h.unmount();
  }

  for (const withStageCache of [true, false]) {
    const mutation = deferred();
    const h = crmHarness({ updateLeadStatus: () => mutation.promise });
    const initialProps = { ...queueProps, allStageLeads: withStageCache ? queueProps.allStageLeads : null };
    let tree = h.render('LeadsQueue', initialProps);
    componentProps(tree, 'LeadInbox').onOpen(leadA, trigger);
    tree = h.render('LeadsQueue', initialProps);
    componentProps(tree, 'LeadQuickView').onStatusChange('a', 'em_contato');
    tree = h.render('LeadsQueue', initialProps);
    assert.equal(componentProps(tree, 'LeadQuickView').lead.status, 'em_contato');
    const freshLead = { ...leadA, status: 'em_contato', nome: 'Lead A atualizado' };
    const freshProps = { ...initialProps, initialLeads: [freshLead, leadB], allStageLeads: withStageCache ? [freshLead, leadB] : null };
    h.render('LeadsQueue', freshProps);
    mutation.resolve({ ok: false, error: 'Falha anterior ao refresh.' });
    await Promise.all(h.transitions);
    tree = h.render('LeadsQueue', freshProps);
    const currentLead = componentProps(tree, 'LeadInbox').leads.find((lead) => lead.id === 'a');
    assert.equal(currentLead.status, 'em_contato', 'A failed optimistic request cannot revert the same status received later from the server');
    assert.equal(currentLead.nome, 'Lead A atualizado');
    assert.equal(componentProps(tree, 'LeadQuickView').lead.status, 'em_contato', 'The preview preserves the refreshed status');
    h.unmount();
  }

  for (const viewedOk of [true, false]) {
    const mutation = deferred(), viewed = deferred();
    const h = crmHarness({ updateLeadStatus: () => mutation.promise, markLeadViewed: () => viewed.promise });
    const unreadLead = { ...leadA, visualizado_em: null };
    const unreadProps = { ...queueProps, initialLeads: [unreadLead, leadB], allStageLeads: [unreadLead, leadB] };
    let tree = h.render('LeadsQueue', unreadProps);
    componentProps(tree, 'LeadInbox').onStatusChange('a', 'em_contato');
    tree = h.render('LeadsQueue', unreadProps);
    const inbox = componentProps(tree, 'LeadInbox');
    inbox.onOpen(inbox.leads.find((lead) => lead.id === 'a'), trigger);
    tree = h.render('LeadsQueue', unreadProps);
    assert.ok(componentProps(tree, 'LeadQuickView').lead.visualizado_em);
    viewed.resolve({ ok: viewedOk });
    await viewed.promise;
    mutation.resolve({ ok: false, error: 'Falha depois de abrir o lead.' });
    await Promise.all(h.transitions);
    tree = h.render('LeadsQueue', unreadProps);
    const currentLead = componentProps(tree, 'LeadInbox').leads.find((lead) => lead.id === 'a');
    assert.equal(currentLead.status, 'novo', 'Local viewed-state changes retain the identity needed to roll back the pending status');
    assert.equal(Boolean(currentLead.visualizado_em), viewedOk, 'Status rollback preserves the result of marking the lead viewed');
    assert.equal(componentProps(tree, 'LeadQuickView').lead.status, 'novo');
    assert.equal(Boolean(componentProps(tree, 'LeadQuickView').lead.visualizado_em), viewedOk);
    h.unmount();
  }

  const activity = (number) => ({ id: `activity-${number}`, action: `Registro ${number}`, created_at: new Date(Date.UTC(2026, 8, 29, 12, 0, -number)).toISOString(), details: {}, user_name: 'Admin' });
  const detailLead = { ...leadA, email: null, telefone: null, segmento: 'nao_definido', utm: {}, criado_em: '2026-09-29T10:00:00Z' };
  const detailProps = { lead: detailLead, activities: Array.from({ length: 25 }, (_, i) => activity(i + 1)), hasMoreActivities: true, budgets: [], proposals: [], artifacts: [], responsibles: [], contextLinks: {} };
  {
    const originalTimezone = process.env.TZ;
    const output = [];
    try {
      for (const timezone of ['UTC', 'America/Sao_Paulo', 'Asia/Tokyo']) {
        process.env.TZ = timezone;
        const h = crmHarness();
        const tree = h.render('LeadDetail', { ...detailProps, lead: { ...detailLead, criado_em: '2026-09-29T01:30:00Z', proxima_acao_em: '2030-01-01T01:00:00Z' } });
        const text = (value) => Array.isArray(value) ? value.map(text).join('') : value?.props ? text(value.props.children) : typeof value === 'string' ? value : '';
        output.push(text(tree));
        h.unmount();
      }
    } finally {
      if (originalTimezone === undefined) delete process.env.TZ;
      else process.env.TZ = originalTimezone;
    }
    assert.equal(output[0], output[1], 'SSR and browser timezones must not change CRM timestamp text');
    assert.equal(output[0], output[2]);
    assert.ok(output[0].includes('22:30'), 'Received timestamp uses the same Brasilia timezone as the dashboard');
  }
  {
    const queue = '/admin/leads?q=Casa+azul&status=qualificado&page=3&view=inbox';
    const leadId = '12345678-1234-1234-1234-123456789abc';
    const context = returnHelpers.leadHref(leadId, queue);
    const h = crmHarness({}, new URLSearchParams({ returnTo: queue, atendimento: 'envio', orcamento: 'TEST-1' }).toString());
    const tree = h.render('LeadDetail', { ...detailProps, lead: { ...detailLead, id: leadId }, activities: [{ ...activity(1), details: { orcamento_id: 'budget' } }], budgets: [{ id: 'budget', label: 'TEST-1', status: 'rascunho', href: '/admin/orcamentos/budget' }] });
    const create = nodes(tree, (node) => node.type === 'Link' && node.props.children === 'Criar orçamento')[0];
    assert.equal(new URL(create.props.href, origin).searchParams.get('lead'), leadId);
    assert.equal(new URL(create.props.href, origin).searchParams.get('returnTo'), context, 'Creating from a lead preserves the filtered queue, without replaying the send form');
    for (const name of ['CommercialLinks', 'ActivityDetails']) {
      const component = nodes(tree, (node) => node.type?.name === name)[0];
      const rendered = component.type(component.props);
      const link = nodes(rendered, (node) => node.type === 'Link')[0];
      assert.equal(new URL(link.props.href, origin).searchParams.get('returnTo'), context, `${name} preserves the lead context`);
    }
    h.unmount();
  }
  const oldPage = deferred(), currentPage = deferred(), historyCalls = [];
  const h = crmHarness({ loadLeadActivities: (id, cursor) => { historyCalls.push({ id, cursor }); return historyCalls.length === 1 ? oldPage.promise : currentPage.promise; } });
  const historyButton = (tree) => nodes(tree, (node) => node.type === 'button' && ['Carregar anteriores', 'Carregando…'].includes(node.props.children))[0];
  let tree = h.render('LeadDetail', detailProps);
  const oldRequest = historyButton(tree).props.onClick();
  await historyButton(tree).props.onClick();
  assert.equal(historyCalls.length, 1, 'Repeated clicks share the same history request');
  assert.equal(historyCalls[0].cursor.id, 'activity-25');
  const refreshed = { ...detailProps, activities: Array.from({ length: 25 }, (_, i) => activity(i)) };
  tree = h.render('LeadDetail', refreshed);
  assert.equal(historyButton(tree).props.disabled, false, 'Refresh invalidates the old request and permits the new cursor');
  const currentRequest = historyButton(tree).props.onClick();
  assert.equal(historyCalls[1].cursor.id, 'activity-24');
  oldPage.resolve({ ok: true, activities: [activity(26)], hasMore: false });
  await oldRequest;
  tree = h.render('LeadDetail', refreshed);
  assert.equal(historyButton(tree).props.disabled, true, 'An old finally cannot release the current request');
  assert.ok(!nodes(tree, (node) => node.key === 'activity-26').length, 'Stale records and hasMore are ignored');
  currentPage.resolve({ ok: true, activities: [activity(25), activity(26)], hasMore: false });
  await currentRequest;
  tree = h.render('LeadDetail', refreshed);
  assert.equal(nodes(tree, (node) => node.key === 'activity-25').length, 1, 'The refreshed cursor fills the intervening activity');
  assert.equal(historyButton(tree), undefined);
  h.unmount();
}

// Follow the commercial journey through the actual server pages and links.
{
  const { commercialReturnTo, commercialHref, leadHref, leadsReturnTo } = returnHelpers;
  const leadId = '12345678-1234-1234-1234-123456789abc';
  const budgetId = '87654321-1234-1234-1234-123456789abc';
  const queue = '/admin/leads?q=Casa+azul&page=3&status=qualificado&prioridade=alta&view=inbox';
  const context = leadHref(leadId, queue);
  assert.equal(commercialReturnTo(context), context);
  assert.equal(leadHref(leadId, context), context);
  assert.equal(leadsReturnTo(new URL(context, origin).searchParams.get('returnTo')), queue);
  assert.equal(leadHref(budgetId, context), leadHref(budgetId, '/admin/leads'), 'Another lead does not inherit unrelated context');
  assert.equal(commercialReturnTo(`${context}&atendimento=envio&orcamento=TEST#atendimento`), context);
  assert.equal(commercialReturnTo(`/admin/leads/${leadId}?returnTo=${encodeURIComponent(context)}`), leadHref(leadId, '/admin/leads'), 'Detail chains are bounded');
  for (const invalid of [undefined, null, [], 1, 'https://evil.test/admin/leads', '//evil.test/admin/leads', '/\\evil.test/admin/leads', '/admin/leads/../orcamentos', '/admin/%6ceads', '/admin/leads\n', '/admin/leads-evil', '/admin/leads/invalid', `/admin/orcamentos/${budgetId}`, '/admin/login', '/admin/posts', '/admin/leads?' + 'q'.repeat(4096)]) {
    assert.equal(commercialReturnTo(invalid), '/admin/orcamentos');
    assert.equal(leadsReturnTo(invalid), '/admin/leads');
  }
  const element = (type, props) => ({ type, props });
  const symbols = new Proxy({}, { get: (_, name) => String(name) });
  function nodes(tree, predicate) {
    if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, predicate));
    if (!tree?.props) return [];
    return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props.children, predicate)];
  }
  const links = (tree) => nodes(tree, (node) => node.type === 'Link');
  const linkWithText = (tree, text) => links(tree).find((node) => JSON.stringify(node.props.children).includes(text));
  const component = (tree, name) => nodes(tree, (node) => node.type === name)[0];
  let row = { id: budgetId, lead_id: leadId, numero: 'TEST-1', status: 'finalizado', cliente_nome: 'Cliente sintético', data_cotacao: '2026-09-29', data_elaboracao: '2026-09-29', pdf_url: null, pdf_storage_path: 'test/document.pdf' };
  let leadReads = 0, listError = null, countError = null, count = 30;
  const supabase = { from(table) {
    if (table === 'leads') leadReads++;
    let counting = false;
    const query = {
      select(_columns, options) { counting = Boolean(options?.head); return this; },
      eq() { return this; }, in() { return this; }, ilike() { return this; }, order() { return this; }, range() { return this; },
      async single() { return { data: row }; },
      async maybeSingle() { return { data: { id: leadId, nome: 'Lead sintético' } }; },
      then(resolve, reject) { return Promise.resolve(counting ? { count, error: countError } : { data: [], error: listError }).then(resolve, reject); },
    };
    return query;
  } };
  function load(file, overrides = {}) {
    const api = {};
    vm.runInNewContext(ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText, {
      exports: api, URL, URLSearchParams, console: { error() {} },
      require(name) {
        if (Object.hasOwn(overrides, name)) return overrides[name];
        if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element, Fragment: 'Fragment' };
        if (name === 'next/link') return { default: 'Link' };
        if (name === 'next/navigation') return { redirect(destination) { throw Object.assign(new Error('redirect'), { destination }); }, notFound() { throw new Error('not found'); } };
        if (name === '@/lib/admin/return-to') return returnHelpers;
        if (name === '@/lib/supabase/server') return { createClient: async () => supabase };
        if (name === '@/lib/orcamento-estimativa-data') return { PADROES_ACABAMENTO: [], REGIMES_COMERCIAIS: [] };
        if (name === '@/lib/orcamento-pdf-storage') return { isOrcamentoPdfCurrent: () => false };
        if (name === 'lucide-react' || name.startsWith('@/components/') || name === './BaixarPdfButton') return symbols;
        throw new Error(`Unexpected commercial import: ${name}`);
      },
    });
    return api;
  }
  const pageProps = { params: Promise.resolve({ id: budgetId }), searchParams: Promise.resolve({ returnTo: context }) };
  const form = load('app/admin/orcamentos/novo/form/page.tsx').default;
  const formTree = await form({ searchParams: Promise.resolve({ lead: leadId, returnTo: context }) });
  assert.equal(linkWithText(formTree, 'Voltar para lead').props.href, context);
  assert.equal(component(formTree, 'OrcamentoWizard').props.returnTo, context);
  assert.equal(component(formTree, 'OrcamentoWizard').props.dadosIniciais.lead_id, leadId);
  for (const lead of [[leadId], 'invalid']) await form({ searchParams: Promise.resolve({ lead, returnTo: ['bad'] }) });
  assert.equal(leadReads, 1, 'Malformed or repeated lead IDs do not reach the database');

  const detail = load('app/admin/orcamentos/[id]/page.tsx').default;
  const detailTree = await detail(pageProps);
  assert.equal(linkWithText(detailTree, 'Voltar para lead').props.href, context);
  assert.equal(linkWithText(detailTree, 'Abrir lead vinculado').props.href, context);
  const send = new URL(linkWithText(detailTree, 'Registrar envio').props.href, origin);
  assert.equal(send.searchParams.get('returnTo'), queue);
  assert.equal(send.searchParams.get('atendimento'), 'envio');
  assert.equal(send.searchParams.get('orcamento'), 'TEST-1');
  assert.equal(send.hash, '#atendimento');
  const editLink = new URL(linkWithText(detailTree, 'Editar').props.href, origin);
  assert.equal(editLink.searchParams.get('returnTo'), context);
  const edit = load('app/admin/orcamentos/[id]/edit/page.tsx').default;
  const editTree = await edit(pageProps);
  assert.equal(component(editTree, 'OrcamentoWizard').props.returnTo, context);
  assert.equal(new URL(linkWithText(editTree, 'Voltar para detalhe').props.href, origin).searchParams.get('returnTo'), context);
  row = { ...row, status: 'arquivado' };
  const archived = await detail(pageProps);
  assert.ok(component(archived, 'BaixarPdfButton'), 'Archived legacy PDF remains downloadable without a cached signed URL');
  assert.equal(component(archived, 'GerarPdfButton'), undefined);
  await assert.rejects(edit(pageProps), (error) => error.destination === commercialHref(`/admin/orcamentos/${budgetId}`, context));

  const list = '/admin/orcamentos?status=rascunho&q=Casa&page=2';
  const listProps = { searchParams: Promise.resolve({ returnTo: list }) };
  const chooser = await load('app/admin/orcamentos/novo/page.tsx').default(listProps);
  for (const link of links(chooser).filter((node) => node.props.href.includes('/novo/'))) {
    assert.equal(new URL(link.props.href, origin).searchParams.get('returnTo'), list);
  }
  const upload = await load('app/admin/orcamentos/novo/upload/page.tsx').default(listProps);
  assert.equal(component(upload, 'PlanilhaUpload').props.returnTo, list);
  const table = load('components/admin/orcamentos/OrcamentosTable.tsx').OrcamentosTable({ orcamentos: [row], returnTo: list });
  for (const link of links(table)) assert.equal(new URL(link.props.href, origin).searchParams.get('returnTo'), list);
  const listPage = load('app/admin/orcamentos/page.tsx').default;
  const listTree = await listPage({ searchParams: Promise.resolve({ status: 'rascunho', q: 'Casa', page: '2' }) });
  assert.equal(component(listTree, 'OrcamentosTable').props.returnTo, list);
  assert.equal(new URL(linkWithText(listTree, 'Novo Orçamento').props.href, origin).searchParams.get('returnTo'), list);
  count = 25;
  await assert.rejects(listPage({ searchParams: Promise.resolve({ status: 'rascunho', q: 'Casa', page: '2' }) }), (error) => error.destination === list.replace('page=2', 'page=1'));
  listError = { code: 'PGRST103' }; count = 0;
  await assert.rejects(listPage({ searchParams: Promise.resolve({ page: '99' }) }), (error) => error.destination.includes('page=1'));
  countError = { code: 'offline' };
  const failed = await listPage({ searchParams: Promise.resolve({ page: '99' }) });
  assert.ok(nodes(failed, (node) => node.props.role === 'alert').length, 'Count failures do not redirect as an empty list');
  countError = null; listError = null;
  const duplicated = await listPage({ searchParams: Promise.resolve({ q: ['a', 'b'], status: ['ativos'], page: ['2'] }) });
  assert.equal(component(duplicated, 'OrcamentosTable').props.returnTo, '/admin/orcamentos?status=ativos&q=&page=1');
}

// Export the real Analytics component, including deferred modules and print lifecycle.
{
  const element = (type, props) => ({ type, props });
  const symbols = new Proxy({}, { get: (_, name) => String(name) });
  function nodes(tree, predicate) {
    if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, predicate));
    if (!tree?.props) return [];
    return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props.children, predicate)];
  }
  function hooks() {
    const slots = [], effects = [];
    let cursor = 0;
    const changed = (previous, deps) => !previous || deps.some((value, index) => !Object.is(value, previous.deps[index]));
    return {
      begin() { cursor = 0; },
      commit() { for (const effect of effects.splice(0)) effect(); },
      unmount() { for (const slot of slots) slot?.cleanup?.(); },
      react: {
        useState(initial) {
          const index = cursor++;
          slots[index] ??= { value: typeof initial === 'function' ? initial() : initial };
          return [slots[index].value, (next) => { slots[index].value = typeof next === 'function' ? next(slots[index].value) : next; }];
        },
        useRef(initial) { const index = cursor++; slots[index] ??= { current: initial }; return slots[index]; },
        useCallback(callback, deps) {
          const index = cursor++;
          if (changed(slots[index], deps)) slots[index] = { deps, value: callback };
          return slots[index].value;
        },
        useMemo(compute, deps) {
          const index = cursor++;
          if (changed(slots[index], deps)) slots[index] = { deps, value: compute() };
          return slots[index].value;
        },
        useEffect(effect, deps) {
          const index = cursor++, previous = slots[index];
          if (changed(previous, deps)) {
            slots[index] = { deps };
            effects.push(() => { previous?.cleanup?.(); slots[index].cleanup = effect(); });
          }
        },
      },
    };
  }
  function load(path, imports, globals = {}) {
    const api = {};
    vm.runInNewContext(ts.transpileModule(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText, {
      exports: api, console, URLSearchParams, AbortController,
      require(name) {
        if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element, Fragment: 'Fragment' };
        return imports(name);
      }, ...globals,
    });
    return api;
  }
  const tick = () => new Promise((resolve) => setImmediate(resolve));
  function printHarness(search = '', { failChunk = false, deferredChunk = null, blockingPrint = false } = {}) {
    const state = hooks(), window = new Hub(), frames = new Map(), timers = new Map();
    let id = 0, prints = 0, loads = 0, tree;
    const details = [{ open: false }, { open: true }];
    const report = {
      isConnected: true, pending: false, chartWidth: 100,
      querySelector: () => report.pending ? {} : null,
      querySelectorAll(selector) {
        if (selector === 'details:not([open])') return details.filter((detail) => !detail.open);
        assert.equal(selector, '.recharts-responsive-container');
        return [{ querySelector: () => ({ getBoundingClientRect: () => ({ width: report.chartWidth }) }) }];
      },
    };
    const document = { fonts: { status: 'loaded' } };
    Object.assign(window, {
      setTimeout(callback) { const key = ++id; timers.set(key, callback); return key; },
      clearTimeout(key) { timers.delete(key); },
      print() { prints++; window.emit('beforeprint'); if (blockingPrint) window.emit('afterprint'); },
    });
    const props = {
      snapshot: { context: { ga4: { users: 1, sessions: 2, pageviews: 3 }, gsc: { clicks: 4, impressions: 5, topQueries: [] }, insights: [], actionsP0: [], actionsP1: [], actionsP2: [] } },
      previousSnapshot: { context: {} }, sectionErrors: {}, currentMonth: '2026-08', trendPoints: [],
    };
    const component = load('app/admin/analytics/AnalyticsContent.tsx', (name) => {
      if (name === 'react') return state.react;
      if (name === 'react-dom') return { flushSync(callback) { callback(); render(); } };
      if (name === 'next/navigation') return { usePathname: () => '/admin/analytics', useSearchParams: () => new URLSearchParams(search) };
      if (name === 'next/dynamic') return { default: () => 'LazySection' };
      if (name === '@/lib/analytics/goals') return { computeMonthlyGoals: () => ({}), computeGoalProgress: () => ({}), formatGoalLabel: () => '', formulaLabel: () => '', goalStatusColor: () => '' };
      if (name === '@/lib/analytics/red-flags') return { detectRedFlags: () => [] };
      if (name === '@/lib/analytics/comparability') return { comparisonAvailability: () => ({ ga4MoM: true, gscMoM: true }) };
      if (name.endsWith('AnalyticsHeader') || name.endsWith('Act0Status') || name.endsWith('ConversionEvents') || name.endsWith('KpiCardGrid')) return symbols;
      if (name.startsWith('@/components/admin/analytics/')) {
        loads++;
        if (failChunk) throw new Error('Chunk indisponível');
        return deferredChunk ?? symbols;
      }
      throw new Error(`Unexpected report import: ${name}`);
    }, { window, document, requestAnimationFrame(callback) { const key = ++id; frames.set(key, callback); return key; }, cancelAnimationFrame(key) { frames.delete(key); } }).AnalyticsContent;
    function render(next = {}) {
      Object.assign(props, next);
      state.begin(); tree = component(props);
      tree.props.ref.current = report;
      state.commit();
      return tree;
    }
    render();
    return {
      render, window, document, report, details, timers, frames,
      header: () => nodes(render(), (node) => node.type === 'AnalyticsHeader')[0].props,
      panels: () => nodes(render(), (node) => node.props.role === 'tabpanel'),
      get prints() { return prints; }, get loads() { return loads; },
      retryChunks() { failChunk = false; },
      async frame() { const callbacks = [...frames.values()]; frames.clear(); for (const callback of callbacks) callback(); await tick(); },
      unmount() { state.unmount(); report.isConnected = false; },
    };
  }

  for (const search of ['', 'compare=1']) {
    const h = printHarness(search);
    assert.equal(h.panels().length, search ? 0 : 4);
    const print = h.header().onPrint;
    const pending = print();
    await print();
    await tick();
    assert.equal(h.loads, 6, 'Duplo clique não prepara duas exportações');
    assert.equal(h.panels().length, 4, 'Modo comparativo também exporta todas as abas');
    assert.equal(nodes(h.render(), (node) => node.props.printMode === true).length, 2);
    h.report.pending = true;
    await h.frame(); await h.frame();
    assert.equal(h.prints, 0, 'Fallback de seção impede impressão parcial');
    h.report.pending = false; h.document.fonts.status = 'loading';
    await h.frame(); assert.equal(h.prints, 0);
    h.document.fonts.status = 'loaded'; h.report.chartWidth = 0;
    await h.frame(); assert.equal(h.prints, 0, 'Gráfico sem dimensões ainda não está pronto');
    h.report.chartWidth = 100;
    await h.frame(); await h.frame(); await pending;
    assert.equal(h.prints, 1);
    assert.equal(h.header().preparingPrint, true, 'Retorno não bloqueante de print mantém relatório montado');
    assert.ok(h.panels().every((panel) => !panel.props.className.startsWith('hidden')));
    assert.equal(h.details[0].open, true);
    h.window.emit('afterprint');
    assert.equal(h.header().preparingPrint, false);
    assert.deepEqual(h.details.map((detail) => detail.open), [false, true], 'Restaura somente os detalhes abertos pela impressão');
    assert.equal(h.timers.size + h.frames.size, 0);
    h.unmount();
    assert.equal(h.window.count('keydown') + h.window.count('afterprint') + h.window.count('beforeprint'), 0);
  }
  const failed = printHarness('', { failChunk: true });
  await failed.header().onPrint();
  assert.equal(nodes(failed.render(), (node) => node.props.role === 'alert').length, 1);
  assert.equal(failed.header().preparingPrint, false);
  failed.retryChunks();
  const retry = failed.header().onPrint(); await tick();
  await failed.frame(); await failed.frame(); await retry;
  assert.equal(failed.prints, 1, 'Falha de chunk libera uma nova tentativa');
  failed.window.emit('afterprint'); failed.unmount();

  for (const cancel of ['timeout', 'button', 'unmount', 'month']) {
    const h = printHarness();
    h.report.pending = true;
    const pending = h.header().onPrint(); await tick(); await h.frame();
    if (cancel === 'timeout') for (const callback of [...h.timers.values()]) callback();
    if (cancel === 'button') nodes(h.render(), (node) => node.type === 'button' && node.props.children === 'Cancelar exportação')[0].props.onClick();
    if (cancel === 'unmount') h.unmount();
    if (cancel === 'month') h.render({ currentMonth: '2026-09' });
    await pending;
    assert.equal(h.prints, 0);
    assert.equal(h.timers.size + h.frames.size, 0, `${cancel}: não deixa espera ativa`);
    assert.deepEqual(h.details.map((detail) => detail.open), [false, true]);
    if (cancel !== 'unmount') { assert.equal(h.header().preparingPrint, false); h.unmount(); }
  }
  let resolveChunk;
  const h = printHarness('', { deferredChunk: new Promise((resolve) => { resolveChunk = resolve; }) });
  const stale = h.header().onPrint(); await tick(); h.unmount(); resolveChunk(symbols); await stale;
  assert.equal(h.prints, 0, 'Importação tardia não abre impressão depois de sair da página');
  for (const modifier of ['ctrlKey', 'metaKey']) {
    const shortcut = printHarness('', { blockingPrint: true });
    const event = shortcut.window.emit('keydown', { key: 'p', [modifier]: true });
    assert.ok(event.defaultPrevented);
    await tick(); await shortcut.frame(); await shortcut.frame();
    assert.equal(shortcut.prints, 1);
    assert.equal(shortcut.header().preparingPrint, false, 'afterprint síncrono também conclui exportação');
    shortcut.unmount();
  }

  // Use the real TanStack row models to verify export scope and restored preferences.
  const engine = await import('@tanstack/react-table');
  const state = hooks(), saved = new Map();
  let table;
  const data = Array.from({ length: 23 }, (_, index) => ({ name: `Artigo ${index}`, count: index }));
  const columns = [{ id: 'name', accessorKey: 'name' }, { id: 'count', accessorKey: 'count' }];
  const component = load('components/admin/analytics/DataTable.tsx', (name) => {
    if (name === 'react') return state.react;
    if (name === '@tanstack/react-table') return { ...engine, useReactTable(options) {
      table ??= engine.createTable(options);
      table.setOptions({ ...options, state: { ...table.initialState, ...options.state } });
      return table;
    } };
    if (name === '@dnd-kit/core') return { ...symbols, useSensor() {}, useSensors() {} };
    if (name === '@/lib/utils') return { cn: (...classes) => classes.filter(Boolean).join(' ') };
    return symbols;
  }, { window: { localStorage: { getItem: (key) => saved.get(key), setItem: (key, value) => saved.set(key, value) } } }).DataTable;
  const renderTable = (printMode = false) => {
    state.begin();
    const tree = component({ data, columns, printMode, storageKey: 'test-report' });
    state.commit(); return tree;
  };
  const bodyRows = (tree) => nodes(tree, (node) => node.type === 'TableBody')[0].props.children;
  assert.equal(bodyRows(renderTable()).length, 15);
  table.setGlobalFilter('Artigo 22');
  table.setColumnVisibility({ count: false });
  table.setColumnSizing({ name: 500 });
  table.setColumnOrder(['count', 'name']);
  assert.equal(bodyRows(renderTable()).length, 1);
  const savedBefore = JSON.stringify([...saved]);
  const exported = bodyRows(renderTable(true));
  assert.equal(exported.length, 23, 'Exporta todas as linhas coletadas, inclusive depois do corte de 15');
  assert.equal(exported[0].props.children.length, 2, 'Colunas ocultas na tela são incluídas na exportação');
  assert.equal(JSON.stringify([...saved]), savedBefore, 'Exportação não grava preferências temporárias');
  const restored = bodyRows(renderTable());
  assert.equal(restored.length, 1);
  assert.equal(restored[0].props.children.length, 1);
  assert.equal(table.getState().columnSizing.name, 500);
  assert.equal(table.getState().columnOrder[0], 'count');
  state.unmount();

  // Exercise URL -> toolbar -> real table, including Next's internal-state bypass.
  for (const kind of ['posts', 'queries']) {
    const wrapperState = hooks(), tableState = hooks(), toolbarState = hooks();
    const keys = kind === 'posts' ? ['posts_q', 'posts_status', 'posts_cat'] : ['queries_q', 'queries_pos', 'queries_opp'];
    const location = new URL(`${origin}/admin/analytics?month=2026-08&tab=${kind === 'posts' ? 'conteudo' : 'aquisicao'}&${keys[0]}=financiar`);
    let searchParams = new URLSearchParams(location.search), actualTable, toolbarTree, filterApi;
    const history = {
      state: nextState('/admin/analytics'),
      replaceState(data, _unused, url) {
        location.href = new URL(url, location).href;
        // This is the installed App Router contract: internal writes skip hook updates.
        if (!data?.__NA && !data?._N) searchParams = new URLSearchParams(location.search);
        this.state = { ...data, __NA: true, __PRIVATE_NEXTJS_INTERNALS_TREE: this.state.__PRIVATE_NEXTJS_INTERNALS_TREE };
      },
    };
    const window = { location, history, localStorage: { getItem: () => null, setItem() {} } };
    const { useUrlFilters } = load('lib/analytics/use-url-filters.ts', (name) => {
      if (name === 'react') return wrapperState.react;
      if (name === 'next/navigation') return { usePathname: () => location.pathname, useSearchParams: () => searchParams };
      throw new Error(`Unexpected URL hook import: ${name}`);
    }, { window });
    const columnModule = load(`lib/analytics/${kind === 'posts' ? 'post' : 'query'}-columns.tsx`, () => symbols);
    // TanStack uses instanceof Function; bridge VM callbacks to its Node realm.
    const globalName = kind === 'posts' ? 'postsGlobalFilterFn' : 'queriesGlobalFilterFn';
    const globalFilter = columnModule[globalName];
    columnModule[globalName] = (...args) => globalFilter(...args);
    for (const column of columnModule[kind === 'posts' ? 'postColumns' : 'queryColumns']) {
      for (const key of ['filterFn', 'sortingFn']) {
        if (typeof column[key] === 'function') {
          const callback = column[key]; column[key] = (...args) => callback(...args);
        }
      }
    }
    const Wrapper = load(`components/admin/analytics/${kind === 'posts' ? 'PostPerformanceTable' : 'TopQueriesTable'}.tsx`, (name) => {
      if (name === 'react') return { ...wrapperState.react, useEffect: toolbarState.react.useEffect };
      if (name === '@/lib/analytics/use-url-filters') return { useUrlFilters(...args) { filterApi = useUrlFilters(...args); return filterApi; } };
      if (name.endsWith('-columns')) return columnModule;
      if (name === '@/lib/utils') return { cn: (...classes) => classes.filter(Boolean).join(' ') };
      return symbols;
    })[kind === 'posts' ? 'PostPerformanceTable' : 'TopQueriesTable'];
    const Table = load('components/admin/analytics/DataTable.tsx', (name) => {
      if (name === 'react') return tableState.react;
      if (name === '@tanstack/react-table') return { ...engine, useReactTable(options) {
        actualTable ??= engine.createTable(options);
        actualTable.setOptions((previous) => ({ ...previous, ...options, state: { ...actualTable.initialState, ...options.state } }));
        return actualTable;
      } };
      if (name === '@dnd-kit/core') return { ...symbols, useSensor() {}, useSensors() {} };
      if (name === '@/lib/utils') return { cn: (...classes) => classes.filter(Boolean).join(' ') };
      return symbols;
    }, { window }).DataTable;
    const records = kind === 'posts' ? [
      { title: 'Como financiar a construção', category: 'Guias', status: 'neutral', pageviews: 20 },
      { title: 'Construção em aço', category: 'Tecnologia', status: 'rising', pageviews: 10 },
      { title: 'Drywall', category: 'Guias', status: 'neutral', pageviews: 5 },
    ] : [
      { query: 'como financiar construção', clicks: 20, impressions: 300, ctr: 1, position: 5 },
      { query: 'construção em aço', clicks: 10, impressions: 100, ctr: 10, position: 2 },
      { query: 'drywall', clicks: 5, impressions: 400, ctr: 1, position: 15 },
    ];
    function renderFiltered(printMode = false) {
      wrapperState.begin();
      const wrapper = Wrapper({ [kind]: records, printMode });
      const props = nodes(wrapper, (node) => node.type === 'DataTable')[0].props;
      tableState.begin(); Table(props);
      const toolbar = props.toolbar(actualTable);
      toolbarState.begin(); toolbarTree = toolbar.type(toolbar.props);
      toolbarState.commit(); tableState.commit(); wrapperState.commit();
      // React renders again after toolbar effects update the controlled table state.
      tableState.begin(); Table(props); tableState.commit();
      toolbarState.begin(); toolbarTree = toolbar.type(toolbar.props); toolbarState.commit();
      return actualTable.getRowModel().rows.map((row) => row.original);
    }
    assert.equal(renderFiltered().length, 1, `${kind}: link filtrado aplica busca na montagem`);
    nodes(toolbarTree, (node) => node.type === 'Input')[0].props.onChange({ target: { value: 'aco' } });
    assert.equal(renderFiltered()[0], records[1], `${kind}: digitação atualiza useSearchParams e linhas, ignorando acentos`);
    assert.equal(history.state.__NA, true, 'App Router mantém seu próprio estado de navegação');
    assert.equal(location.searchParams.get('month'), '2026-08');
    assert.ok(location.searchParams.has('tab'));
    const clear = () => nodes(toolbarTree, (node) => node.props['aria-label'] === 'Limpar todos os filtros')[0].props.onClick();
    clear(); assert.equal(renderFiltered().length, 3, `${kind}: limpeza remove busca`);
    // Two updates before React commits must compose with the latest URL.
    filterApi.setValue(keys[0], 'construcao');
    filterApi.setValue(keys[1], kind === 'posts' ? 'neutral' : 'top10');
    assert.equal(renderFiltered().length, 1, `${kind}: filtros rápidos se acumulam`);
    assert.equal(location.searchParams.get(keys[0]), 'construcao');
    filterApi.setValue(keys[2], kind === 'posts' ? 'Tecnologia' : '1');
    assert.equal(renderFiltered().length, kind === 'posts' ? 0 : 1);
    filterApi.clearValues([keys[1], keys[2]]);
    assert.equal(renderFiltered().length, 2, `${kind}: limpar subconjunto preserva busca`);
    const urlBeforePrint = location.href;
    assert.equal(renderFiltered(true).length, 3, `${kind}: impressão inclui linhas fora do filtro`);
    assert.equal(renderFiltered().length, 2, `${kind}: fim da impressão restaura o filtro`);
    assert.equal(location.href, urlBeforePrint);
    clear(); assert.equal(renderFiltered().length, 3);
    assert.ok(keys.every((key) => !location.searchParams.has(key)));
    // A history traversal supplies a fresh useSearchParams snapshot.
    location.searchParams.set(keys[0], 'drywall'); searchParams = new URLSearchParams(location.search);
    assert.equal(renderFiltered()[0], records[2], `${kind}: voltar/avançar atualiza a tabela`);
    wrapperState.unmount(); tableState.unmount(); toolbarState.unmount();
  }

  let leafState;
  const leafImports = (name) => {
    if (name === 'react') return leafState.react;
    if (name === '@/lib/analytics/use-url-filters') return { useUrlFilters: () => ({}) };
    if (name === '@/lib/analytics/narrative') return { narrativeAct2Origin: () => '', narrativeAct3Posts: () => '' };
    if (name === '@/lib/analytics/post-performance') return { findBestPost: () => null, findOpportunityPost: () => null, countByStatus: () => ({}) };
    if (name === '@/lib/analytics/ai-sources') return { classifyAiSource: () => ({ isAi: false }), buildAiBreakdown: () => ({ byAi: [] }) };
    return symbols;
  };
  for (const [file, child, props] of [
    ['acts/Act2Origin', 'TopQueriesTable', { context: { ga4: {} }, topQueries: [] }],
    ['acts/Act2Origin', 'TrafficSourcesChart', { context: { ga4: {} }, topQueries: [] }],
    ['acts/Act3Posts', 'PostPerformanceTable', { context: {}, posts: [] }],
    ['PostPerformanceTable', 'DataTable', { posts: [] }],
    ['TopQueriesTable', 'DataTable', { queries: [] }],
  ]) {
    leafState = hooks();
    const render = load(`components/admin/analytics/${file}.tsx`, leafImports)[file.split('/').at(-1)];
    leafState.begin();
    assert.equal(nodes(render({ ...props, printMode: true }), (node) => node.type === child)[0].props.printMode, true, `${file} mantém o modo de exportação até a tabela`);
  }
  const traffic = load('components/admin/analytics/TrafficSourcesChart.tsx', leafImports).TrafficSourcesChart;
  const trafficTree = traffic({ data: [{ label: 'Direct', users: 1, sessions: 1, pctOfTotal: 100 }], printMode: true });
  assert.equal(nodes(trafficTree, (node) => node.props.role === 'img')[0].props.className.includes('hidden'), false, 'Exportação mede o gráfico também em viewport mobile');
  assert.equal(nodes(trafficTree, (node) => node.props.role === 'list')[0].props.className, 'hidden', 'Resumo mobile não duplica as mesmas fontes');
}

console.log('Admin navigation: confirmations, history rollback, Next state, cleanup, commercial/editorial journeys, CRM request ordering, report print lifecycle and complete tables passed.');
