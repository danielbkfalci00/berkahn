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

console.log('Admin navigation: confirmations, history rollback, Next state, cleanup and production harness isolation passed.');
