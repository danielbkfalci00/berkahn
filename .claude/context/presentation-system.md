# Sistema de Apresentações — Berkahn

Documenta a arquitetura da apresentação executiva em `/apresentacao-executiva`.

## Arquitetura

- **Rota**: `/apresentacao-executiva` (noindex, nofollow)
- **Page**: `app/apresentacao-executiva/page.tsx`
- **Layout wrapper**: `components/presentation/PresentationLayout.tsx` — container full-screen com scroll smooth
- **Loading**: SlideCover eager (above-the-fold), todos os outros via `dynamic()` do Next.js (lazy)

## Slides (ordem de apresentação)

| # | Componente | Propósito | Tema |
|---|-----------|-----------|------|
| 1 | SlideCover | Hero com logo, tagline e CTA animado | Dark |
| 2 | SlideAbout | Sobre a empresa: 20+ anos, excelência, transparência | Light |
| 3 | SlideMethodology | Processo 4 etapas: Consulta → Projeto → Execução → Entrega | Light |
| 4 | SlideDiferenciais | 8 métricas de benefícios LSF (velocidade, sustentabilidade, etc.) | Dark |
| 5 | SlideGlobalOverview | Mercado global de Steel Frame com mapa interativo | Light |
| 6 | SlideGlobalLeaders | Ranking global, recordes, dados de sustentabilidade | Dark |
| 7 | SlideBrazilOpportunity | Mercado brasileiro, crescimento, dados McKinsey | Dark |
| 8 | SlideFounders | 3 cofundadores com bios, fotos e LinkedIn | Light |
| 9 | SlideServices | "O que Fazemos por Você" com FocusCards | Dark |
| 10 | SlideProjectsIntro | Intro: "Obras Gerenciadas pelos Sócios" | Dark |
| 11-13 | SlideProject ×3 | Projetos individuais (mapeados de presentationProjects) | Alterna |
| 14 | SlidePartners | Carrossel de parceiros (Brand 01, Lumen, Knauf, Aquapanel) | Dark |
| 15 | SlideGallery | 41 imagens em DomeGallery 3D interativo | Dark |
| 16 | SlideContact | "Obrigado. Vamos construir juntos?" + contatos | Dark |

## Charts disponíveis

| Componente | O que mostra | Dados |
|-----------|-------------|-------|
| `RegionalDonut` | Distribuição regional do mercado global | `REGIONAL_SHARES` de global-steel-frame-data.ts |
| `BrazilMixDonut` | Mix de metodologia construtiva no Brasil (LSF vs convencional) | `BRAZIL_CONSTRUCTION_MIX` |
| `BrazilGrowthChart` | Crescimento do mercado LSF no Brasil ao longo do tempo | `BRAZIL_MARKET_GROWTH` |

## Dados de projetos

Definidos em `lib/presentation-data.ts` — array `presentationProjects`:

```typescript
{
  number: string,        // "01", "02", "03"
  title: string,         // Nome do projeto
  location: string,      // Localização
  year: string,          // Ano
  area: string,          // Área (ex: "376 m²")
  system: string,        // Sistema construtivo
  description: string,   // Descrição detalhada
  features: string[],    // Destaques
  images: string[],      // Caminhos WebP em /images/apresentacao/
  dark: boolean,         // Tema do slide
  reversed: boolean      // Layout espelhado
}
```

**Projetos atuais**:
1. Casa Santa Cristina (2024, SP) — 376m², Steel Frame + Concreto
2. Vila Serrana Boutique (2023, Argentina) — 55m²/unit, 100% Steel Frame
3. Residência Monteiro (2026, SP) — 520m², Steel Frame + Metal Structure

## Componentes UI reutilizáveis

- **SlideSection** (`components/presentation/ui/SlideSection.tsx`) — container base com prop `dark`
- **FounderCard** (`components/presentation/ui/FounderCard.tsx`) — card de cofundador com foto e LinkedIn
- **DomeGallery** (`components/presentation/DomeGallery/`) — galeria 3D interativa

## Animações usadas

- **RevealOnScroll** — fade-in ao entrar na viewport
- **CharReveal** — revelação caractere por caractere
- **CountUp** — contador animado para números
- **StaggerChildren** — animação sequencial de filhos

## Como adicionar um novo slide

1. Criar `components/presentation/slides/SlideNome.tsx`:
   ```typescript
   "use client";
   import { SlideSection } from "../ui/SlideSection";
   import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
   
   export function SlideNome() {
     return (
       <SlideSection dark={true}>
         <div className="container max-w-6xl mx-auto">
           <RevealOnScroll>
             {/* Conteúdo do slide */}
           </RevealOnScroll>
         </div>
       </SlideSection>
     );
   }
   ```

2. Importar com dynamic em `app/apresentacao-executiva/page.tsx`:
   ```typescript
   const SlideNome = dynamic(() =>
     import("@/components/presentation/slides/SlideNome").then((m) => m.SlideNome)
   );
   ```

3. Adicionar `<SlideNome />` na posição desejada no JSX da página.

4. Se precisar de dados dinâmicos, adicionar em `lib/presentation-data.ts`.

5. Se precisar de chart, criar em `components/presentation/charts/` usando Recharts.

## Dados globais disponíveis

`lib/global-steel-frame-data.ts` contém:
- Rankings de empresas globais de steel frame
- Dados de mercado por região
- Estatísticas de crescimento do Brasil
- Mix construtivo brasileiro
- Dados podem ser usados em qualquer slide
