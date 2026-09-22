"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const EMPTY_DEFAULTS = Object.freeze({});

// Os filtros são aplicados só no client. router.replace re-renderizaria a
// página force-dynamic inteira no servidor a cada tecla; history.replaceState
// é sincronizado com useSearchParams pelo App Router sem novo request.
function replaceUrl(pathname: string, qs: string) {
  window.history.replaceState(window.history.state, "", qs ? `${pathname}?${qs}` : pathname);
}

interface UseUrlFiltersOptions<TKey extends string> {
  /** Valores default por key. Quando o valor === default, a key é removida da URL (clean). */
  defaults?: Partial<Record<TKey, string>>;
}

interface UseUrlFiltersReturn<TKey extends string> {
  /** Valores atuais lidos da URL (ou defaults). */
  values: Record<TKey, string>;
  /** Define um valor; remove a key se valor vazio ou igual ao default. */
  setValue: (key: TKey, value: string) => void;
  /** Remove um subconjunto das keys em uma unica navegacao. */
  clearValues: (keys: readonly TKey[]) => void;
  /** Remove todas as keys gerenciadas da URL. */
  clearAll: () => void;
  /** True se qualquer key gerenciada está presente na URL. */
  hasActive: boolean;
}

/**
 * Hook genérico para gerenciar filtros via URL search params.
 * - Lê valores da URL com fallback pra defaults.
 * - Escreve via history.replaceState (sem scroll, sem request ao servidor) — preserva params não gerenciados (ex: ?month=).
 * - Quando valor === "" ou === default, remove a key (não polui URL com defaults).
 *
 * Uso típico em tabelas filtráveis: `useUrlFilters(["posts_q", "posts_status", "posts_cat"] as const)`.
 */
export function useUrlFilters<TKey extends string>(
  keys: readonly TKey[],
  options?: UseUrlFiltersOptions<TKey>
): UseUrlFiltersReturn<TKey> {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaults = options?.defaults
    ?? (EMPTY_DEFAULTS as Partial<Record<TKey, string>>);

  const values = useMemo(() => {
    const out = {} as Record<TKey, string>;
    for (const key of keys) {
      out[key] = searchParams.get(key) ?? defaults[key] ?? "";
    }
    return out;
  }, [keys, searchParams, defaults]);

  const setValue = useCallback(
    (key: TKey, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const def = defaults[key] ?? "";
      if (value === "" || value === def) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      replaceUrl(pathname, qs);
    },
    [searchParams, pathname, defaults]
  );

  const clearValues = useCallback((targetKeys: readonly TKey[]) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of targetKeys) {
      params.delete(key);
    }
    const qs = params.toString();
    replaceUrl(pathname, qs);
  }, [searchParams, pathname]);

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of keys) {
      params.delete(key);
    }
    const qs = params.toString();
    replaceUrl(pathname, qs);
  }, [keys, searchParams, pathname]);

  const hasActive = useMemo(() => {
    return keys.some((k) => {
      const value = searchParams.get(k);
      if (value === null) return false;
      const def = defaults[k] ?? "";
      return value !== "" && value !== def;
    });
  }, [keys, searchParams, defaults]);

  return { values, setValue, clearAll, clearValues, hasActive };
}
