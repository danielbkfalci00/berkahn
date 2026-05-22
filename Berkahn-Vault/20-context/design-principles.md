---
tipo: context
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/context
  - project/site
ai_summary: Design system Berkahn — paleta preto/branco/cinza + off-white, tipografia Manrope, princípios premium (espaço branco, contraste forte, minimalismo). WCAG 2.1 AA. Dark mode predominante.
status: active
escopo: berkahn
---

# Design Principles — Berkahn

Princípios de design que guiam todas as decisões de UI/UX no site e materiais da Berkahn. Identidade conceitual em [[berkahn-brand]].

## Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Preto Puro | `#000000` | Fundos principais, textos principais |
| Branco Puro | `#FFFFFF` | Fundos claros, textos sobre preto |
| Cinza Escuro | `#1A1A1A` | Fundos alternativos, cards |
| Cinza Médio | `#666666` | Textos secundários, labels de seção |
| Cinza Claro | `#999999` | Subtextos, placeholders |
| Preto 70% | `#4D4D4D` | Textos sobre fundo branco |
| Branco 70% | `rgba(255,255,255,0.7)` | Textos sobre fundo preto |
| Branco 50% | `rgba(255,255,255,0.5)` | Taglines sobre preto |
| Off-white | `#F4F2EC` | Fundo alternativo quente (LinkedIn, materiais) |

**Regra**: Preto e branco puros como base. Cinzas como suporte. Sem cores vibrantes. Contraste forte.

## Tipografia

### Fonte Principal: Manrope (Google Fonts)
Alternativas: Montserrat, Inter

| Elemento | Peso | Tamanho | Espaçamento |
|----------|------|---------|-------------|
| Títulos grandes (BERKAHN) | ExtraBold (800) | 48-72pt | +10% tracking |
| Tagline | Light (300) | 14-18pt | +15% tracking |
| Títulos de seção | Medium (500) | 10-12pt | +20% tracking, UPPERCASE |
| Texto de serviço | SemiBold (600) | 14-16pt | Normal |
| Informações de contato | Regular (400) | 10-12pt | Normal |
| Labels pequenos | Regular (400) | 8-9pt | +10% tracking |

### Hierarquia no site (Tailwind)
- H1: `text-4xl md:text-6xl font-extrabold`
- H2: `text-3xl md:text-4xl font-bold`
- H3: `text-xl md:text-2xl font-semibold`
- Body: `text-base font-normal leading-relaxed`
- Caption: `text-sm text-gray-500`

## Princípios de Design Premium

1. **Espaço em branco generoso** — Não encher, deixar respirar
2. **Menos é mais** — Remover qualquer elemento não essencial
3. **Alinhamento perfeito** — Usar grid system consistente
4. **Consistência** — Mesmos espaçamentos, tamanhos, cores em todo o site
5. **Tipografia limpa** — Poucas variações de tamanho
6. **Contraste forte** — Preto e branco puro, cinzas controlados

### O que transmite qualidade
- Muito espaço em branco
- Tipografia fina e elegante
- Ícones minimalistas (line/outline, stroke 1-1.5px, rounded corners)
- Contraste preto/branco
- Hierarquia clara
- Simplicidade extrema

### O que evitar
- Ícones coloridos ou muito detalhados
- Muitas fontes diferentes
- Textos muito grandes
- Elementos tocando as bordas
- Sombras ou gradientes exagerados
- Excesso de informação

## Acessibilidade (WCAG 2.1 AA)

- Todos os elementos interativos navegáveis por teclado
- Focus states visíveis em todos os elementos focáveis
- Contraste mínimo de 4.5:1 para texto
- HTML semântico e ARIA labels
- Alt text em todas as imagens significativas
- Suporte a screen readers

## Responsividade

- **Mobile-first**: 375px → 768px → 1440px
- Touch targets mínimo 44x44px no mobile
- Sem scroll horizontal em nenhum viewport
- Layouts flexíveis com sizing relativo

## Performance

- Imagens otimizadas (WebP, lazy-loaded)
- Minimizar layout shifts (CLS < 0.1)
- Loading e empty states para feedback
- Micro-interações para percepção de velocidade
- LCP < 2.5s, FID < 100ms

## Animações

- Duração: 200-300ms para transições UI
- Respeitar `prefers-reduced-motion`
- Framer Motion como padrão (motion/react)
- RevealOnScroll para elementos entrando na viewport
- CountUp para números/estatísticas

## Iconografia

- Estilo: Line/Outline (não preenchido)
- Stroke: 1-1.5px
- Corners: Rounded
- Cor: Mesmo tom do texto adjacente
- Biblioteca: Lucide React

## Dark Mode

O site usa predominantemente dark mode (fundo preto). Seções alternam entre dark (#000000, #1A1A1A) e light (#FFFFFF). Transições suaves entre seções.

## Referências

- Identidade conceitual: [[berkahn-brand]]
- Sistema de apresentações: [[presentation-system]]
- Brand assets (logos): `Berkahn-Vault/50-brand/logos.md`
