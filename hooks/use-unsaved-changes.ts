"use client";

import { useCallback, useEffect, useRef } from "react";

const editors = new Set<{ current: boolean }>();
const MARKER = "__berkahnNavigationGuard";
let installed = false;
let unloadAttached = false;
let approvedUnload = false;

type Position = { chain: string; index: number };
type Entry = { url: string; state: unknown; position: Position };
type NavigationEvent = Event & {
  navigationType: string;
  destination: { url: string; sameDocument: boolean };
  signal: AbortSignal;
};
type NavigationApi = {
  addEventListener(type: "navigate", listener: (event: NavigationEvent) => void): void;
};

const hasPendingChanges = () => [...editors].some((editor) => editor.current);

function beforeUnload(event: BeforeUnloadEvent) {
  if (approvedUnload || !hasPendingChanges()) return;
  event.preventDefault();
  event.returnValue = "";
}

function syncUnloadGuard() {
  const needed = hasPendingChanges();
  if (needed === unloadAttached) return;
  unloadAttached = needed;
  if (needed) window.addEventListener("beforeunload", beforeUnload);
  else window.removeEventListener("beforeunload", beforeUnload);
}

/** Also used by logout: one decision for all mounted editors. */
export function confirmUnsavedChanges(): boolean {
  return !hasPendingChanges() || window.confirm(
    "Há alterações não salvas. Deseja sair e descartá-las?"
  );
}

function samePage(left: string, right: string) {
  const a = new URL(left);
  const b = new URL(right);
  return a.origin === b.origin && a.pathname === b.pathname && a.search === b.search;
}

function positionOf(state: unknown): Position | null {
  if (!state || typeof state !== "object" || !(MARKER in state)) return null;
  const value = (state as Record<string, unknown>)[MARKER] as Partial<Position> | null;
  return value && typeof value.chain === "string" && Number.isInteger(value.index)
    ? value as Position : null;
}

function freshPosition(): Position {
  return { chain: `${Date.now()}:${Math.random()}`, index: 0 };
}

function marked(state: unknown, position: Position) {
  // Preserve Next's complete state (__NA, router tree, etc.). Do not modify
  // primitives/arrays that unrelated consumers may deliberately put in history.
  if (state !== null && state !== undefined && (typeof state !== "object" || Array.isArray(state))) return state;
  return { ...state as object, [MARKER]: position };
}

/** Install once from the shell so ordinary ADMIN history is tracked before editing. */
export function installUnsavedNavigationGuard() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const history = window.history;
  const nativePush = History.prototype.pushState;
  const nativeReplace = History.prototype.replaceState;
  const previousPush = history.pushState;
  const previousReplace = history.replaceState;
  let current: Entry = {
    url: window.location.href,
    state: history.state,
    position: positionOf(history.state) ?? freshPosition(),
  };
  nativeReplace.call(history, marked(current.state, current.position), "", current.url);
  current.state = history.state;
  let restoring: Entry | null = null;
  let approvedTraversal: string | null = null;

  history.pushState = function (state, unused, url) {
    const position = { chain: current.position.chain, index: current.position.index + 1 };
    previousPush.call(this, marked(state, position), unused, url);
    current = { url: window.location.href, state: history.state, position };
  };
  history.replaceState = function (state, unused, url) {
    previousReplace.call(this, marked(state, current.position), unused, url);
    current = { ...current, url: window.location.href, state: history.state };
  };

  const adoptEntry = () => {
    const position = positionOf(history.state) ?? freshPosition();
    nativeReplace.call(history, marked(history.state, position), "", window.location.href);
    current = { url: window.location.href, state: history.state, position };
  };
  const restoreUnindexedEntry = (entry: Entry) => {
    const position = freshPosition();
    nativePush.call(history, marked(entry.state, position), "", entry.url);
    current = { ...entry, state: history.state, position };
  };

  // Navigation API can cancel same-document traversal before URL/router change.
  // Browsers without it use the indexed popstate rollback below.
  const navigation = (window as Window & { navigation?: NavigationApi }).navigation;
  navigation?.addEventListener("navigate", (event) => {
    if (restoring) return;
    approvedTraversal = null;
    if (event.navigationType !== "traverse" || !event.destination.sameDocument
      || !event.cancelable || !hasPendingChanges() || samePage(current.url, event.destination.url)) return;
    if (!confirmUnsavedChanges()) {
      event.preventDefault();
      return;
    }
    approvedTraversal = event.destination.url;
    event.signal.addEventListener("abort", () => { approvedTraversal = null; }, { once: true });
  });

  window.addEventListener("popstate", (event) => {
    if (restoring) {
      // This is our rollback, not another user navigation. Next must keep the
      // mounted form and its state, so it does not receive either popstate.
      event.stopImmediatePropagation();
      const position = positionOf(event.state);
      if (window.location.href === restoring.url && position?.chain === restoring.position.chain
        && position.index === restoring.position.index) {
        current = { ...restoring, state: history.state };
      } else {
        // A second traversal can race the asynchronous rollback in older
        // browsers. Keep the editor mounted at its original URL in that case.
        restoreUnindexedEntry(restoring);
      }
      restoring = null;
      approvedTraversal = null;
      return;
    }
    const approved = approvedTraversal === window.location.href;
    approvedTraversal = null;
    if (approved || !hasPendingChanges() || samePage(current.url, window.location.href) || confirmUnsavedChanges()) {
      adoptEntry();
      return;
    }
    event.stopImmediatePropagation();
    const target = positionOf(event.state);
    if (target?.chain === current.position.chain && target.index !== current.position.index) {
      restoring = current;
      history.go(current.position.index - target.index);
      return;
    }
    // Legacy entry created before tracking (or by a consumer using primitive
    // history state): popstate is not cancellable and exposes no entry index.
    // Restore the exact Next state without remounting the editor. Only this
    // fallback replaces the forward branch; tracked Back/Forward keeps it.
    restoreUnindexedEntry(current);
  }, true);

  document.addEventListener("click", (event) => {
    if (!hasPendingChanges() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const destination = new URL(anchor.href, window.location.href);
    if (!/^https?:$/.test(destination.protocol) || samePage(current.url, destination.href)) return;
    if (!confirmUnsavedChanges()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    // A native link may unload synchronously after the already-confirmed click.
    approvedUnload = true;
    window.setTimeout(() => { approvedUnload = false; }, 0);
  }, true);
}

/** Shared exit guard. Clear dirty only when the saved version matches. */
export function useUnsavedChanges(dirty: boolean) {
  const editor = useRef(dirty);
  editor.current = dirty;
  useEffect(() => {
    installUnsavedNavigationGuard();
    editors.add(editor);
    syncUnloadGuard();
    return () => { editors.delete(editor); syncUnloadGuard(); };
  }, []);
  useEffect(syncUnloadGuard, [dirty]);
  return useCallback(() => confirmUnsavedChanges(), []);
}
