---
tipo: prompt
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/prompt
  - project/apresentacao
ai_summary: Criar ou editar slide na apresentação executiva /apresentacao-executiva. Criado por Claude — pode ser ajustado. Usado por /apresentacao.
status: active
versao: 1.0
calibrado_em: 2026-04-13
---

> [!note] Prompt criado por Claude
> Pode ser ajustado com mais liberdade que prompts de Bruno. Ver [[prompts-calibrados]].

Leia o contexto da arquitetura de apresentações em [[presentation-system]] e a identidade da marca em [[berkahn-brand]].

## Tarefa

Criar ou editar slide(s) na apresentação executiva da Berkahn (`/apresentacao-executiva`).

## Instruções

1. **Antes de criar qualquer código**, verifique:
   - Os 16 slides existentes em `components/presentation/slides/`
   - Se já existe um slide que pode ser estendido em vez de criar um novo
   - Os dados disponíveis em `lib/presentation-data.ts` e `lib/global-steel-frame-data.ts`

2. **Ao criar um novo slide**:
   - Criar componente em `components/presentation/slides/SlideNome.tsx`
   - Usar `"use client"` directive
   - Importar `SlideSection` de `../ui/SlideSection` para container base
   - Usar `RevealOnScroll` de `@/components/animations/RevealOnScroll` para animações
   - Alternar entre dark/light para manter ritmo visual
   - Import via `dynamic()` em `app/apresentacao-executiva/page.tsx`

3. **Se precisar de dados**:
   - Adicionar em `lib/presentation-data.ts` (projetos) ou criar arquivo de dados específico
   - Para dados de mercado global, usar `lib/global-steel-frame-data.ts`

4. **Se precisar de gráfico**:
   - Criar em `components/presentation/charts/` usando Recharts
   - Seguir padrão dos 3 charts existentes (RegionalDonut, BrazilMixDonut, BrazilGrowthChart)

5. **Padrões visuais**:
   - Container: `max-w-6xl mx-auto`
   - Tipografia: Manrope (herdada do layout global)
   - Cores: preto/branco/cinzas (ver design-principles.md)
   - Ícones: Lucide React
   - Animações: Framer Motion (motion/react)

6. **Testar**:
   - Verificar com `npm run dev` que o slide renderiza
   - Testar responsividade (1440px, 768px, 375px)
   - Verificar que animações rodam suavemente
