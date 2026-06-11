import { cn } from "@/lib/utils";
import type { ChainItem, Step } from "@/lib/etapas-obra-data";

/**
 * Primitivas visuais do fluxograma "Etapas da Obra".
 * Paridade visual com o artefato v1 (Docs/fluxograma-etapas-obra.html):
 * conectores e brackets são divs explícitas (zero pseudo-elementos).
 */

const ARROW_BORDERS = {
  down: "border-r-[1.2px] border-b-[1.2px]",
  right: "border-r-[1.2px] border-t-[1.2px]",
  up: "border-l-[1.2px] border-t-[1.2px]",
} as const;

export function Arrowhead({
  dir = "down",
  className,
}: {
  dir?: keyof typeof ARROW_BORDERS;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("block w-[7px] h-[7px] rotate-45 border-[#1A1A1A]", ARROW_BORDERS[dir], className)}
    />
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full border border-black/25 bg-off-white",
        "px-2.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A]",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Conector vertical de fluxo: linha 1px + seta opcional + chip opcional (Sim/Não). */
export function FlowLink({
  height = "h-[52px]",
  chip,
  arrow = true,
  className,
}: {
  /** Classe Tailwind de altura (literal para o JIT): "h-[26px]" stub · "h-[42px]" cadeia · "h-[46px]" mid · "h-[52px]" entre fases */
  height?: string;
  chip?: string;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("relative w-full", height, className)}>
      <span className="absolute left-1/2 top-0 bottom-0 w-px bg-black/30" />
      {arrow && <Arrowhead dir="down" className="absolute bottom-0.5 left-1/2 -translate-x-1/2" />}
      {chip && <Chip className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{chip}</Chip>}
    </div>
  );
}

export function StepBox({ step, dense, className }: { step: Step; dense?: boolean; className?: string }) {
  const variant = step.variant ?? "default";
  return (
    <div
      className={cn(
        "bg-white border border-black/10 rounded-lg shadow-luxury-md print:shadow-none",
        "flex flex-col items-center justify-center text-center",
        "min-h-16 px-5 py-3.5 text-[14.5px] font-semibold leading-snug text-[#1A1A1A]",
        "transition-all duration-300 ease-expo hover:-translate-y-0.5 hover:shadow-luxury-lg",
        dense && "h-full min-[480px]:min-h-[92px] px-2.5 py-3 text-[13px]",
        variant === "start" && "uppercase tracking-[0.08em] font-extrabold text-[13.5px]",
        variant === "decision" && "flex-row gap-[11px] border-black font-bold text-sm",
        variant === "final" && "border-[1.5px] border-black font-extrabold text-[13.5px] tracking-[0.07em] uppercase py-[22px]",
        className
      )}
    >
      {variant === "decision" && (
        <span aria-hidden="true" className="w-[9px] h-[9px] flex-none border-[1.5px] border-black rotate-45" />
      )}
      <span>
        {step.label}
        {step.note && (
          <span className="block mt-1 text-[11px] font-normal tracking-[0.01em] text-[#999999]">{step.note}</span>
        )}
      </span>
    </div>
  );
}

/**
 * Bracket tracejado de retorno (Reprovado?/Conflitos?): borda esquerda + topo + base,
 * seta entrando no alvo e chip "Sim" sobre a vertical. O gutter (-ml/pl) mantém o
 * conteúdo interno alinhado com o restante do fluxo.
 */
export function LoopGroup({
  chip,
  anchors,
  children,
  className,
}: {
  chip: string;
  /** Classes Tailwind de ancoragem vertical do bracket (top e bottom), calibradas por breakpoint */
  anchors: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative pl-6 min-[640px]:-ml-9 min-[640px]:pl-9", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-0 w-6 min-[640px]:w-9 rounded-l-xl",
          "border border-dashed border-black/[0.38] border-r-0",
          anchors
        )}
      >
        <Arrowhead dir="right" className="absolute -top-1 -right-px w-2 h-2" />
        <Chip className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">{chip}</Chip>
      </div>
      {children}
    </div>
  );
}

/** Cadeia vertical de etapas; itens podem ser passos simples ou um grupo de loop (Fase 02). */
export function StepChain({ items, className }: { items: ChainItem[]; className?: string }) {
  return (
    <ol className={cn("mx-auto w-full max-w-[400px]", className)}>
      {items.map((item, i) => (
        <li key={i} className="relative">
          {i > 0 && <FlowLink height="h-[42px]" />}
          {item.kind === "step" ? (
            <StepBox step={item.step} />
          ) : (
            <LoopGroup chip={item.chip} anchors="top-8 bottom-8">
              <ol className="w-full">
                {item.steps.map((s, j) => (
                  <li key={j} className="relative">
                    {j > 0 && <FlowLink height="h-[42px]" />}
                    <StepBox step={s} />
                  </li>
                ))}
              </ol>
            </LoopGroup>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Fileira de 4 disciplinas com pente conector (visível só em md+, como no artefato v1). */
export function StepRow({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ul
      className={cn(
        "relative grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1.5 md:pt-[30px]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="hidden md:block absolute top-0 h-px bg-black/30 left-[calc(12.5%-5px)] right-[calc(12.5%-5px)]"
      />
      {steps.map((step, i) => (
        <li key={i} className="relative">
          <span aria-hidden="true" className="hidden md:block absolute -top-[30px] left-1/2 w-px h-[30px] bg-black/30" />
          <StepBox step={step} dense />
        </li>
      ))}
    </ul>
  );
}

export function FluxogramaLegend({ className }: { className?: string }) {
  return (
    <ul
      aria-label="Legenda do fluxograma"
      className={cn(
        "flex flex-wrap items-center justify-center gap-y-3.5 gap-x-8",
        "text-[11px] font-semibold text-[#666666]",
        className
      )}
    >
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="w-6 h-[15px] flex-none rounded-[3px] bg-white border border-black/30" />
        Etapa
      </li>
      <li className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="w-6 h-[15px] flex-none rounded-[3px] bg-white border border-black flex items-center justify-center"
        >
          <span className="w-[5px] h-[5px] border border-black rotate-45" />
        </span>
        Decisão
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="w-6 h-[15px] flex-none rounded-[3px] bg-black" />
        Marco de orçamento
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="w-6 flex-none border-t border-dashed border-black/[0.38]" />
        Retorno / revisão
      </li>
    </ul>
  );
}

/** Card preto de marco de orçamento. Desktop (lg): card estreito sobre o trilho; abaixo: barra horizontal. */
export function MarcoCard({ nome, className }: { nome: string; className?: string }) {
  return (
    <aside
      className={cn(
        "relative z-[1] bg-black text-white rounded-[10px] shadow-luxury-md print:shadow-none px-[18px] py-4",
        "w-full max-w-[400px] mx-auto mt-7 flex items-center justify-between gap-3.5",
        "lg:block lg:w-44 lg:max-w-none lg:mt-0",
        className
      )}
    >
      <div>
        <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 mb-1.5">Marco</span>
        <strong className="block text-sm font-bold leading-[1.35] tracking-[0.01em]">{nome}</strong>
      </div>
      <svg
        viewBox="0 0 12 14"
        fill="none"
        aria-hidden="true"
        className="w-[11px] flex-none text-white/85 lg:absolute lg:top-[15px] lg:right-[15px]"
      >
        <path
          d="M6 13V1M1.5 5.5 6 1l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </aside>
  );
}
