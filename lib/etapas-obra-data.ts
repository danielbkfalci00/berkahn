// Dados do fluxograma "Etapas da Obra" — fonte canônica de conteúdo.
// Origem: rascunho do time + correções aprovadas (2026-06-10); paridade visual
// com o artefato v1 em Docs/fluxograma-etapas-obra.html.

export type StepVariant = "default" | "start" | "decision" | "final";

export interface Step {
  label: string;
  variant?: StepVariant;
  /** Anotação secundária dentro da caixa (ex.: "HVAC, imp., paisag...") */
  note?: string;
}

/** Item de cadeia vertical: passo simples ou grupo com loop de retorno (Fase 02). */
export type ChainItem =
  | { kind: "step"; step: Step }
  | { kind: "loop"; chip: string; steps: Step[] };

export type FaseContent =
  /** Cadeia vertical de caixas — Fases 01, 02 e 06 */
  | { kind: "chain"; items: ChainItem[] }
  /** Fileira de 4 caixas com pente conector — Fases 03 e 04 */
  | { kind: "row"; steps: Step[] }
  /** Loop largo envolvendo fileira + cadeia — Fase 05 */
  | { kind: "loopWide"; chip: string; row: Step[]; chain: Step[] };

export interface FaseObra {
  /** Número da fase ("01".."06") — também usado como ghost number */
  numero: string;
  titulo: string;
  /** Chip no conector de entrada da fase (saída "Não" das decisões) */
  entryChip?: string;
  content: FaseContent;
  marco?: { nome: string };
}

export const ETAPAS_OBRA: FaseObra[] = [
  {
    numero: "01",
    titulo: "Compra do Terreno e avaliação inicial",
    content: {
      kind: "chain",
      items: [
        { kind: "step", step: { label: "Compra do Terreno", variant: "start" } },
        { kind: "step", step: { label: "Estudo Geotécnico e Levantamento Topográfico" } },
      ],
    },
  },
  {
    numero: "02",
    titulo: "Contratação do Arquiteto e Desenho inicial",
    content: {
      kind: "chain",
      items: [
        { kind: "step", step: { label: "Contratação Arquiteto" } },
        { kind: "step", step: { label: "Anteprojeto Arquitetônico" } },
        { kind: "step", step: { label: "Contratação Projetista" } },
        {
          kind: "loop",
          chip: "Sim",
          steps: [
            { label: "Projeto Preliminar de Estrutura" },
            { label: "Projeto Legal (Prefeitura)" },
            { label: "Reprovado?", variant: "decision" },
          ],
        },
      ],
    },
    marco: { nome: "Orçamento Estimado" },
  },
  {
    numero: "03",
    titulo: "Projetos Preliminares",
    entryChip: "Não",
    content: {
      kind: "row",
      steps: [
        { label: "Projeto Arquitetura Preliminar" },
        { label: "Projeto Estrutural Preliminar" },
        { label: "Projeto Instalações Preliminar" },
        { label: "Projetos Complementares Preliminares", note: "HVAC, imp., paisag..." },
      ],
    },
    marco: { nome: "Orçamento Preliminar" },
  },
  {
    numero: "04",
    titulo: "Projetos Pré-Executivos",
    content: {
      kind: "row",
      steps: [
        { label: "Projeto Arquitetura Pré-Executivo" },
        { label: "Projeto Estrutural Pré-Executivo" },
        { label: "Projeto Instalações Pré-Executivo" },
        { label: "Projetos Complementares Pré-Executivos" },
      ],
    },
  },
  {
    numero: "05",
    titulo: "Projetos Executivos",
    content: {
      kind: "loopWide",
      chip: "Sim",
      row: [
        { label: "Projeto Arquitetura Executivo" },
        { label: "Projeto Estrutural Executivo" },
        { label: "Projeto Instalações Executivo" },
        { label: "Projetos Complementares Executivos" },
      ],
      chain: [
        { label: "Compatibilização" },
        { label: "Conflitos?", variant: "decision" },
      ],
    },
    marco: { nome: "Orçamento Analítico" },
  },
  {
    numero: "06",
    titulo: "Projeto Compatibilizado",
    entryChip: "Não",
    content: {
      kind: "chain",
      items: [
        { kind: "step", step: { label: "Mobilização e Início da Obra", variant: "final" } },
      ],
    },
  },
];

/** Resumo textual do fluxo para leitores de tela (o diagrama visual é redundante a partir dele). */
export const ETAPAS_OBRA_RESUMO_SR =
  "Fluxo do processo construtivo em seis fases. Fase 1: compra do terreno, seguida de estudo geotécnico e levantamento topográfico. " +
  "Fase 2: contratação do arquiteto, anteprojeto arquitetônico, contratação do projetista, projeto preliminar de estrutura e projeto legal na prefeitura; " +
  "se o projeto legal for reprovado, retorna ao projeto preliminar de estrutura. Ao fim desta fase obtém-se o orçamento estimado. " +
  "Fase 3: projetos preliminares de arquitetura, estrutura, instalações e complementares, gerando o orçamento preliminar. " +
  "Fase 4: projetos pré-executivos das mesmas quatro disciplinas. " +
  "Fase 5: projetos executivos das quatro disciplinas seguidos de compatibilização; havendo conflitos, retorna ao início da fase. Gera o orçamento analítico. " +
  "Fase 6: projeto compatibilizado, com mobilização e início da obra. A precisão do orçamento cresce ao longo das fases.";
