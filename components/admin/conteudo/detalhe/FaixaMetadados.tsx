"use client";

import { useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { atualizarPauta } from "@/app/admin/conteudo/actions";
import {
  FUNIL_LABEL,
  INTENCAO_LABEL,
  LIMITES,
  PLATAFORMA_LABEL,
  TRILHA_LABEL,
  type Funil,
  type Intencao,
  type Pauta,
  type Plataforma,
  type Trilha,
} from "@/types/conteudo";

const NENHUM = "__nenhum__";

interface Props {
  pauta: Pauta;
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

/**
 * Metadados editáveis da pauta.
 *
 * Salva no blur (texto) e no change (selects) — **sem debounce**, ao contrário
 * dos blocos: `atualizarPauta` chama `revalidatePath`, e disparar por tecla
 * revalidaria o quadro inteiro dezenas de vezes.
 */
export function FaixaMetadados({ pauta }: Props) {
  const [local, setLocal] = useState(pauta);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  function salvar(patch: Parameters<typeof atualizarPauta>[1]) {
    setErro(null);
    iniciar(async () => {
      const res = await atualizarPauta(pauta.id, patch);
      if (res.error) {
        setErro(res.error);
        return;
      }
      // Usa o retorno: o servidor normaliza (keyword cortada, plataformas
      // filtradas) e nenhuma action revalida /admin/conteudo/[id].
      if (res.data) setLocal(res.data);
    });
  }

  function alternarPlataforma(p: Plataforma, marcada: boolean) {
    const proximas = marcada
      ? [...new Set([...local.plataformas, p])]
      : local.plataformas.filter((x) => x !== p);
    setLocal((a) => ({ ...a, plataformas: proximas }));
    salvar({ plataformas: proximas });
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-[#FAF8F2] p-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Campo label="Data-alvo">
          {/* type=date devolve YYYY-MM-DD, exatamente o formato da coluna DATE:
              sem conversão, sem fuso, sem off-by-one. */}
          <Input
            type="date"
            value={local.dataAlvo ?? ""}
            disabled={pendente}
            onChange={(e) => {
              const v = e.target.value || null;
              setLocal((a) => ({ ...a, dataAlvo: v }));
              salvar({ dataAlvo: v });
            }}
            className="h-9 bg-white"
          />
        </Campo>

        <Campo label="Semana">
          <Input
            type="number"
            min={1}
            max={53}
            value={local.semana ?? ""}
            disabled={pendente}
            onChange={(e) =>
              setLocal((a) => ({ ...a, semana: e.target.value ? Number(e.target.value) : null }))
            }
            onBlur={() => salvar({ semana: local.semana })}
            className="h-9 bg-white"
          />
        </Campo>

        <Campo label="Prioridade">
          <Select
            value={local.prioridade ? String(local.prioridade) : NENHUM}
            onValueChange={(v) => {
              const n = v === NENHUM ? null : Number(v);
              setLocal((a) => ({ ...a, prioridade: n }));
              salvar({ prioridade: n });
            }}
          >
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>P{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Trilha">
          <Select
            value={local.trilha ?? NENHUM}
            onValueChange={(v) => {
              const t = v === NENHUM ? null : (v as Trilha);
              setLocal((a) => ({ ...a, trilha: t }));
              salvar({ trilha: t });
            }}
          >
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {(Object.keys(TRILHA_LABEL) as Trilha[]).map((t) => (
                <SelectItem key={t} value={t}>{TRILHA_LABEL[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Intenção">
          <Select
            value={local.intencao ?? NENHUM}
            onValueChange={(v) => {
              const i = v === NENHUM ? null : (v as Intencao);
              setLocal((a) => ({ ...a, intencao: i }));
              salvar({ intencao: i });
            }}
          >
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {(Object.keys(INTENCAO_LABEL) as Intencao[]).map((i) => (
                <SelectItem key={i} value={i}>{INTENCAO_LABEL[i]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Funil">
          <Select
            value={local.funil ?? NENHUM}
            onValueChange={(v) => {
              const f = v === NENHUM ? null : (v as Funil);
              setLocal((a) => ({ ...a, funil: f }));
              salvar({ funil: f });
            }}
          >
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {(Object.keys(FUNIL_LABEL) as Funil[]).map((f) => (
                <SelectItem key={f} value={f}>{FUNIL_LABEL[f]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Keyword">
          <Input
            value={local.keyword ?? ""}
            maxLength={LIMITES.keywordMax}
            disabled={pendente}
            onChange={(e) => setLocal((a) => ({ ...a, keyword: e.target.value }))}
            onBlur={() => salvar({ keyword: local.keyword })}
            placeholder="palavra-chave alvo"
            className="h-9 bg-white"
          />
        </Campo>

        <fieldset className="flex flex-col gap-1">
          <legend className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Plataformas
          </legend>
          <div className="flex h-9 items-center gap-4">
            {(["blog", "linkedin"] as Plataforma[]).map((p) => (
              <label key={p} className="flex items-center gap-1.5 text-sm text-neutral-800">
                <Checkbox
                  checked={local.plataformas.includes(p)}
                  onCheckedChange={(c) => alternarPlataforma(p, c === true)}
                />
                {PLATAFORMA_LABEL[p]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {erro && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
          {erro}
        </p>
      )}
    </div>
  );
}
