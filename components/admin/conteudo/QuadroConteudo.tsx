"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { AlertCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ESTADOS_GERAIS,
  FUNIL_LABEL,
  INTENCAO_LABEL,
  STATUS_BLOG,
  STATUS_LINKEDIN,
  TRILHA_LABEL,
  estadoGeral,
  ordemNaVisao,
  statusNaVisao,
  type CanalConteudo,
  type EstadoGeral,
  type Funil,
  type Intencao,
  type Pauta,
  type Plataforma,
  type StatusBlog,
  type StatusLinkedin,
  type StatusQuadro,
  type TagCatalogo,
  type Trilha,
  type VisaoQuadro,
} from "@/types/conteudo";
import { useListaOtimista } from "@/hooks/use-lista-otimista";
import { useTelaLarga } from "@/hooks/use-tela-larga";
import {
  diffOrdem, instantaneo, renumerar, useArrastarEntreColunas,
} from "@/hooks/use-arrastar-entre-colunas";
import { criarPauta, excluirPauta, moverPautas } from "@/app/admin/conteudo/actions";
import { ColunaPauta } from "./ColunaPauta";
import { BadgesPlataforma } from "./BadgesPlataforma";

interface Props { pautas: Pauta[]; tagsCatalogo: TagCatalogo[]; }
export type ItemQuadro = Pauta & { coluna: StatusQuadro; ordem: number };
const TODOS = "__todos__";

function colunasDaVisao(visao: VisaoQuadro): readonly StatusQuadro[] {
  if (visao === "blog") return STATUS_BLOG;
  if (visao === "linkedin") return STATUS_LINKEDIN;
  return ESTADOS_GERAIS;
}
function prazoCasa(pauta: Pauta, filtro: string) {
  if (filtro === TODOS) return true;
  if (!pauta.dataAlvo) return filtro === "sem-data";
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = new Date(`${pauta.dataAlvo}T12:00:00`);
  if (filtro === "atrasadas") return data < hoje;
  if (filtro === "7-dias") {
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 7);
    return data >= hoje && data <= limite;
  }
  return true;
}

export function QuadroConteudo({ pautas: doServidor, tagsCatalogo }: Props) {
  const router = useRouter();
  const [visao, setVisao] = useState<VisaoQuadro>("geral");
  const [busca, setBusca] = useState("");
  const [plataforma, setPlataforma] = useState<string>(TODOS);
  const [trilha, setTrilha] = useState<string>(TODOS);
  const [funil, setFunil] = useState<string>(TODOS);
  const [intencao, setIntencao] = useState<string>(TODOS);
  const [prioridade, setPrioridade] = useState<string>(TODOS);
  const [prazo, setPrazo] = useState<string>(TODOS);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const colunas = colunasDaVisao(visao);
  const filtradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return doServidor.filter((pauta) => {
      if (visao === "blog" && !pauta.statusBlog) return false;
      if (visao === "linkedin" && !pauta.statusLinkedin) return false;
      if (
        termo &&
        !`${pauta.titulo} ${pauta.keyword ?? ""}`.toLocaleLowerCase("pt-BR").includes(termo)
      ) return false;
      if (plataforma !== TODOS && !pauta.plataformas.includes(plataforma as Plataforma))
        return false;
      if (trilha !== TODOS && pauta.trilha !== trilha) return false;
      if (funil !== TODOS && pauta.funil !== funil) return false;
      if (intencao !== TODOS && pauta.intencao !== intencao) return false;
      if (prioridade !== TODOS && pauta.prioridade !== Number(prioridade)) return false;
      return prazoCasa(pauta, prazo);
    });
  }, [doServidor, busca, plataforma, trilha, funil, intencao, prioridade, prazo, visao]);

  const visuais = useMemo<ItemQuadro[]>(() => {
    return filtradas
      .map((pauta, index) => ({
        ...pauta,
        coluna: statusNaVisao(pauta, visao) as StatusQuadro,
        ordem:
          visao === "geral"
            ? index + 1
            : ordemNaVisao(pauta, visao as CanalConteudo) ?? index + 1,
      }))
      .sort((a, b) => {
        if (a.coluna !== b.coluna)
          return colunas.indexOf(a.coluna) - colunas.indexOf(b.coluna);
        return a.ordem - b.ordem;
      });
  }, [filtradas, visao, colunas]);

  const { itens, setItens, erro, mostrarErro, limparErro, pendente, aplicar } =
    useListaOtimista(visuais);
  const telaLarga = useTelaLarga(768);
  const arrastavel = telaLarga !== false && visao !== "geral";

  const { sensores, pautaAtiva, aoIniciar, aoPassarPor, aoTerminar } =
    useArrastarEntreColunas({
      pautas: itens,
      setPautas: setItens,
      colunas,
      habilitado: arrastavel,
      aoSoltar: (proximo, mudancas) => {
        if (visao === "geral") return;
        const sincronizado = proximo.map((pauta) =>
          visao === "blog"
            ? { ...pauta, statusBlog: pauta.coluna as StatusBlog, ordemBlog: pauta.ordem }
            : {
                ...pauta,
                statusLinkedin: pauta.coluna as StatusLinkedin,
                ordemLinkedin: pauta.ordem,
              }
        );
        aplicar(sincronizado, () =>
          moverPautas(
            visao,
            mudancas.map((m) => ({
              id: m.id,
              status: m.coluna as StatusBlog | StatusLinkedin,
              ordem: m.ordem,
            }))
          )
        );
      },
    });

  function handleCriar(titulo: string, coluna: StatusQuadro) {
    void (async () => {
      const res =
        visao === "geral"
          ? await criarPauta({ titulo })
          : await criarPauta({
              titulo,
              canal: visao,
              status: coluna as StatusBlog | StatusLinkedin,
              plataformas: visao === "blog" ? ["blog", "linkedin"] : ["linkedin"],
            });
      if (res.error) mostrarErro(res.error);
    })();
  }

  function handleMover(id: string, coluna: StatusQuadro) {
    if (visao === "geral") return;
    const alvo = itens.find((p) => p.id === id);
    if (!alvo || alvo.coluna === coluna) return;
    const semAlvo = itens.filter((p) => p.id !== id);
    const ultimo = semAlvo.reduce((acc, p, i) => (p.coluna === coluna ? i : acc), -1);
    const proximo = [...semAlvo];
    proximo.splice(ultimo === -1 ? proximo.length : ultimo + 1, 0, {
      ...alvo, coluna,
    });
    const renumerado = renumerar(proximo);
    const mudancas = diffOrdem(instantaneo(itens), renumerado);
    const sincronizado = renumerado.map((pauta) =>
      visao === "blog"
        ? { ...pauta, statusBlog: pauta.coluna as StatusBlog, ordemBlog: pauta.ordem }
        : {
            ...pauta,
            statusLinkedin: pauta.coluna as StatusLinkedin,
            ordemLinkedin: pauta.ordem,
          }
    );
    aplicar(sincronizado, () =>
      moverPautas(
        visao,
        mudancas.map((m) => ({
          id: m.id,
          status: m.coluna as StatusBlog | StatusLinkedin,
          ordem: m.ordem,
        }))
      )
    );
  }

  function selecionar(id: string, selecionado: boolean) {
    setSelecionados((atuais) => {
      const proximos = new Set(atuais);
      if (selecionado) proximos.add(id);
      else proximos.delete(id);
      return proximos;
    });
  }

  const idsSelecionados = itens
    .filter((pauta) => selecionados.has(pauta.id))
    .map((pauta) => pauta.id);

  function moverSelecionados(coluna: StatusQuadro) {
    if (visao === "geral" || idsSelecionados.length === 0) return;
    const ids = new Set(idsSelecionados);
    const escolhidos = itens
      .filter((pauta) => ids.has(pauta.id))
      .map((pauta) => ({ ...pauta, coluna }));
    const semEscolhidos = itens.filter((pauta) => !ids.has(pauta.id));
    const ultimo = semEscolhidos.reduce(
      (indice, pauta, atual) => (pauta.coluna === coluna ? atual : indice),
      -1
    );
    const proximo = [...semEscolhidos];
    proximo.splice(ultimo === -1 ? proximo.length : ultimo + 1, 0, ...escolhidos);
    const renumerado = renumerar(proximo);
    const mudancas = diffOrdem(instantaneo(itens), renumerado);
    const sincronizado = renumerado.map((pauta) =>
      visao === "blog"
        ? { ...pauta, statusBlog: pauta.coluna as StatusBlog, ordemBlog: pauta.ordem }
        : {
            ...pauta,
            statusLinkedin: pauta.coluna as StatusLinkedin,
            ordemLinkedin: pauta.ordem,
          }
    );
    aplicar(sincronizado, async () => {
      const resultado = await moverPautas(
        visao,
        mudancas.map((mudanca) => ({
          id: mudanca.id,
          status: mudanca.coluna as StatusBlog | StatusLinkedin,
          ordem: mudanca.ordem,
        }))
      );
      if (!resultado.error) setSelecionados(new Set());
      return resultado;
    });
  }

  function handleExcluir(id: string) {
    setConfirmandoExclusao(null);
    aplicar(
      itens.filter((p) => p.id !== id),
      async () => {
        const res = await excluirPauta(id);
        if (!res.error) router.refresh();
        return res;
      }
    );
  }

  const filtrosAtivos = [busca, plataforma, trilha, funil, intencao, prioridade, prazo]
    .some((v, i) => (i === 0 ? Boolean(v) : v !== TODOS));
  function limparFiltros() {
    setBusca("");
    setPlataforma(TODOS);
    setTrilha(TODOS);
    setFunil(TODOS);
    setIntencao(TODOS);
    setPrioridade(TODOS);
    setPrazo(TODOS);
  }

  return (
    <div className="space-y-4">
      {erro && (
        <div role="alert" className="flex items-start gap-2 rounded-md bg-[#F8E8E8] p-3 text-sm text-[#B83A3A]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          <p className="flex-1">{erro}</p>
          <button type="button" onClick={limparErro} aria-label="Dispensar erro"
            className="rounded p-0.5 hover:bg-[#F0D8D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A3A]">
            <X className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}

      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={visao} onValueChange={(v) => {
            setVisao(v as VisaoQuadro);
            setSelecionados(new Set());
          }}>
            <TabsList className="bg-[#F3F0E8]">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs tabular-nums text-neutral-500">
            {filtradas.length} de {doServidor.length} pautas
          </p>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4 xl:grid-cols-7">
          <label className="relative md:col-span-2">
            <span className="sr-only">Buscar pauta</span>
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" aria-hidden />
            <Input value={busca} onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar título ou keyword" className="h-9 pl-8" />
          </label>
          <Filtro value={plataforma} onChange={setPlataforma} placeholder="Plataforma"
            itens={[["blog", "Blog"], ["linkedin", "LinkedIn"]]} />
          <Filtro value={trilha} onChange={setTrilha} placeholder="Trilha"
            itens={(Object.entries(TRILHA_LABEL) as [Trilha, string][])} />
          <Filtro value={funil} onChange={setFunil} placeholder="Funil"
            itens={(Object.entries(FUNIL_LABEL) as [Funil, string][])} />
          <Filtro value={intencao} onChange={setIntencao} placeholder="Intenção"
            itens={(Object.entries(INTENCAO_LABEL) as [Intencao, string][])} />
          <Filtro value={prioridade} onChange={setPrioridade} placeholder="Prioridade"
            itens={[1, 2, 3, 4, 5].map((n) => [String(n), `P${n}`])} />
          <Filtro value={prazo} onChange={setPrazo} placeholder="Prazo"
            itens={[["atrasadas", "Atrasadas"], ["7-dias", "Próximos 7 dias"], ["sem-data", "Sem data"]]} />
        </div>
        {filtrosAtivos && (
          <button type="button" onClick={limparFiltros}
            className="mt-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Limpar filtros
          </button>
        )}
        {visao !== "geral" && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
            <button type="button"
              onClick={() => setSelecionados(new Set(
                itens.map((pauta) => pauta.id)
              ))}
              className="rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100">
              Selecionar visíveis
            </button>
            {idsSelecionados.length > 0 && (
              <>
                <span className="text-xs tabular-nums text-neutral-500">
                  {idsSelecionados.length} selecionada{idsSelecionados.length === 1 ? "" : "s"}
                </span>
                <Select onValueChange={(valor) => moverSelecionados(valor as StatusQuadro)}>
                  <SelectTrigger className="h-8 w-48 bg-white text-xs">
                    <SelectValue placeholder="Mover seleção para…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(visao === "blog"
                      ? STATUS_BLOG
                      : STATUS_LINKEDIN
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "producao" ? "Produção" :
                          status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button type="button" onClick={() => setSelecionados(new Set())}
                  className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100">
                  Limpar seleção
                </button>
              </>
            )}
            <span className="text-xs text-neutral-400">
              Aprovação e publicação continuam individuais.
            </span>
          </div>
        )}
      </div>

      <DndContext sensors={sensores} collisionDetection={closestCorners}
        onDragStart={aoIniciar} onDragOver={aoPassarPor} onDragEnd={aoTerminar}>
        <div className="-mx-6 overflow-x-auto px-6 pb-4">
          <div className="flex min-w-full flex-col items-stretch gap-4 md:min-w-max md:flex-row md:items-start">
            {colunas.map((coluna) => (
              <ColunaPauta key={coluna} coluna={coluna} visao={visao}
                pautas={itens.filter((p) => p.coluna === coluna)}
                arrastavel={arrastavel} aoCriar={handleCriar} aoMover={handleMover}
                aoExcluir={handleExcluir}
                idConfirmandoExclusao={confirmandoExclusao}
                aoPedirExclusao={setConfirmandoExclusao} pendente={pendente}
                selecionados={selecionados} aoSelecionar={selecionar} tagsCatalogo={tagsCatalogo} />
            ))}
          </div>
        </div>
        <DragOverlay>
          {pautaAtiva && (
            <div className="w-[280px] rotate-2 rounded-lg border border-neutral-300 bg-white p-3 shadow-lg">
              <p className="text-sm font-medium leading-snug text-neutral-900">{pautaAtiva.titulo}</p>
              <BadgesPlataforma plataformas={pautaAtiva.plataformas} className="mt-2" />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Filtro({
  value, onChange, placeholder, itens,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  itens: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TODOS}>{placeholder}: todas</SelectItem>
        {itens.map(([valor, label]) => (
          <SelectItem key={valor} value={valor}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
