"use client";

import { useState, useTransition, type ReactNode } from "react";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  alterarStatusPauta, atualizarPauta, marcarLinkedinPublicado,
} from "@/app/admin/conteudo/actions";
import {
  FUNIL_LABEL, INTENCAO_LABEL, LIMITES, PLATAFORMA_LABEL,
  STATUS_BLOG, STATUS_LABEL, STATUS_LINKEDIN, TRILHA_LABEL,
  type Funil, type Intencao, type Pauta, type Plataforma,
  type StatusBlog, type StatusLinkedin, type Trilha,
} from "@/types/conteudo";
import { cn } from "@/lib/utils";

const NENHUM = "__nenhum__";
interface Props { pauta: Pauta; aoAtualizar?: (pauta: Pauta) => void; }
function Campo({ label, children, className }: {
  label: string; children: ReactNode; className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
export function FaixaMetadados({ pauta, aoAtualizar }: Props) {
  const [local, setLocal] = useState(pauta);
  const [erro, setErro] = useState<string | null>(null);
  const [urlLinkedin, setUrlLinkedin] = useState(pauta.linkedinUrl ?? "");
  const [dataLinkedin, setDataLinkedin] = useState(pauta.linkedinPublicadoEm?.slice(0, 16) ?? "");
  const [pendente, iniciar] = useTransition();

  function aceitar(atualizada: Pauta | null) {
    if (!atualizada) return;
    setLocal(atualizada);
    setUrlLinkedin(atualizada.linkedinUrl ?? urlLinkedin);
    setDataLinkedin(atualizada.linkedinPublicadoEm?.slice(0, 16) ?? dataLinkedin);
    aoAtualizar?.(atualizada);
  }

  function salvar(patch: Parameters<typeof atualizarPauta>[1]) {
    setErro(null);
    iniciar(async () => {
      const res = await atualizarPauta(pauta.id, patch);
      if (res.error) return setErro(res.error);
      aceitar(res.data);
    });
  }

  function salvarStatus(canal: "blog" | "linkedin", status: StatusBlog | StatusLinkedin) {
    setErro(null);
    iniciar(async () => {
      const res = await alterarStatusPauta(pauta.id, canal, status);
      if (res.error) return setErro(res.error);
      aceitar(res.data);
    });
  }

  function alternarPlataforma(plataforma: Plataforma, marcada: boolean) {
    const proximas = marcada
      ? [...new Set([...local.plataformas, plataforma])]
      : local.plataformas.filter((item) => item !== plataforma);
    setLocal((anterior) => ({ ...anterior, plataformas: proximas }));
    salvar({ plataformas: proximas });
  }

  function publicarLinkedin() {
    setErro(null);
    iniciar(async () => {
      const res = await marcarLinkedinPublicado(pauta.id, urlLinkedin, dataLinkedin);
      if (res.error) return setErro(res.error);
      aceitar(res.data);
    });
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-[#FAF8F2] p-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Campo label="Título" className="col-span-2 md:col-span-3 lg:col-span-4">
          <Input value={local.titulo} maxLength={LIMITES.tituloMax} disabled={pendente}
            onChange={(e) => setLocal((a) => ({ ...a, titulo: e.target.value }))}
            onBlur={() => salvar({ titulo: local.titulo })}
            className="h-9 bg-white font-medium" />
        </Campo>

        {local.statusBlog && (
          <Campo label="Status Blog">
            <Select value={local.statusBlog}
              onValueChange={(v) => salvarStatus("blog", v as StatusBlog)}>
              <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_BLOG.map((status) => (
                  <SelectItem key={status} value={status} disabled={status === "publicado"}>
                    {STATUS_LABEL[status]}{status === "publicado" ? " · via /artigo" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
        )}

        {local.statusLinkedin && (
          <Campo label="Status LinkedIn">
            <Select value={local.statusLinkedin}
              onValueChange={(v) => salvarStatus("linkedin", v as StatusLinkedin)}>
              <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_LINKEDIN.map((status) => (
                  <SelectItem key={status} value={status} disabled={status === "publicado"}>
                    {STATUS_LABEL[status]}{status === "publicado" ? " · exige URL" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
        )}

        <Campo label="Data-alvo">
          <Input type="date" value={local.dataAlvo ?? ""} disabled={pendente}
            onChange={(e) => {
              const valor = e.target.value || null;
              setLocal((a) => ({ ...a, dataAlvo: valor }));
              salvar({ dataAlvo: valor });
            }} className="h-9 bg-white" />
        </Campo>

        <Campo label="Semana">
          <Input type="number" min={1} max={53} value={local.semana ?? ""}
            disabled={pendente}
            onChange={(e) => setLocal((a) => ({
              ...a, semana: e.target.value ? Number(e.target.value) : null,
            }))}
            onBlur={() => salvar({ semana: local.semana })} className="h-9 bg-white" />
        </Campo>

        <Campo label="Prioridade">
          <Select value={local.prioridade ? String(local.prioridade) : NENHUM}
            onValueChange={(v) => {
              const numero = v === NENHUM ? null : Number(v);
              setLocal((a) => ({ ...a, prioridade: numero }));
              salvar({ prioridade: numero });
            }}>
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {[1, 2, 3, 4, 5].map((numero) => (
                <SelectItem key={numero} value={String(numero)}>P{numero}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Trilha">
          <Select value={local.trilha ?? NENHUM}
            onValueChange={(v) => {
              const valor = v === NENHUM ? null : (v as Trilha);
              setLocal((a) => ({ ...a, trilha: valor }));
              salvar({ trilha: valor });
            }}>
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {(Object.keys(TRILHA_LABEL) as Trilha[]).map((v) => (
                <SelectItem key={v} value={v}>{TRILHA_LABEL[v]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Intenção">
          <Select value={local.intencao ?? NENHUM}
            onValueChange={(v) => {
              const valor = v === NENHUM ? null : (v as Intencao);
              setLocal((a) => ({ ...a, intencao: valor }));
              salvar({ intencao: valor });
            }}>
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {(Object.keys(INTENCAO_LABEL) as Intencao[]).map((v) => (
                <SelectItem key={v} value={v}>{INTENCAO_LABEL[v]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Funil">
          <Select value={local.funil ?? NENHUM}
            onValueChange={(v) => {
              const valor = v === NENHUM ? null : (v as Funil);
              setLocal((a) => ({ ...a, funil: valor }));
              salvar({ funil: valor });
            }}>
            <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NENHUM}>—</SelectItem>
              {(Object.keys(FUNIL_LABEL) as Funil[]).map((v) => (
                <SelectItem key={v} value={v}>{FUNIL_LABEL[v]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Keyword">
          <Input value={local.keyword ?? ""} maxLength={LIMITES.keywordMax} disabled={pendente}
            onChange={(e) => setLocal((a) => ({ ...a, keyword: e.target.value }))}
            onBlur={() => salvar({ keyword: local.keyword })}
            placeholder="palavra-chave alvo" className="h-9 bg-white" />
        </Campo>

        <fieldset className="flex flex-col gap-1">
          <legend className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Plataformas
          </legend>
          <div className="flex h-9 items-center gap-4">
            {(["blog", "linkedin"] as Plataforma[]).map((plataforma) => (
              <label key={plataforma} className="flex items-center gap-1.5 text-sm text-neutral-800">
                <Checkbox checked={local.plataformas.includes(plataforma)}
                  onCheckedChange={(c) => alternarPlataforma(plataforma, c === true)} />
                {PLATAFORMA_LABEL[plataforma]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {local.statusLinkedin && ["aprovado", "publicado"].includes(local.statusLinkedin) && (
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Publicação manual do LinkedIn
          </p>
          <div className="mt-2 grid gap-2 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <Input type="url" value={urlLinkedin}
              onChange={(e) => setUrlLinkedin(e.target.value)}
              placeholder="https://www.linkedin.com/posts/..." className="h-9 bg-white" />
            <Input type="datetime-local" value={dataLinkedin}
              onChange={(e) => setDataLinkedin(e.target.value)} className="h-9 bg-white" />
            {local.statusLinkedin === "publicado" && local.linkedinUrl ? (
              <a href={local.linkedinUrl} target="_blank" rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Abrir <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : (
              <button type="button" onClick={publicarLinkedin} disabled={pendente}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
                {pendente && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />}
                Marcar publicado
              </button>
            )}
          </div>
        </div>
      )}

      {erro && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
          {erro}
        </p>
      )}
    </div>
  );
}
