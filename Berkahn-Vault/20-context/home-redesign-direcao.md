---
tipo: context
criado: 2026-08-05
atualizado: 2026-08-05
tags:
  - domain/brand
  - domain/architecture
  - project/site
  - status/active
ai_summary: Direção visual da home redesenhada (2026-08-05) — "luxo de engenharia" — decidida por Bruno após referência de site de vilas de luxo. Base carbon quente + bronze, Archivo display + Space Mono técnica, hero em vídeo com poster-LCP, scrollytelling Lenis + GSAP. Contém os prompts prontos de geração do vídeo de hero (still FLUX/Midjourney, i2v Veo/Kling) e specs de encode ffmpeg.
status: active
projeto: site
contextos_aplicados:
  - berkahn-brand
  - guia-design-berkahn
  - design-principles
---

# Home redesign — direção "luxo de engenharia"

Registro da direção aprovada pelo Bruno em 2026-08-05 para a repaginada da home (branch `feat/home-scrollytelling`). Referência de partida: Reel de site de vilas de luxo mediterrâneo (hero em vídeo golden-hour, statement editorial, galeria de projetos nomeados, scroll fluido).

## A síntese

**Luxo de engenharia**: o clima cinematográfico e quente da referência, executado com a linguagem nativa da Berkahn — precisão, sistema, ficha técnica. Nenhum dos tells de IA vetados pelo Bertevello no institucional v2 ([[guia-design-berkahn]]): sem Playfair/serif itálico decorativo, sem cream-editorial, sem fio fininho, sem eyebrow uppercase-tracked. As barras são grossas (3px), as labels são mono minúsculas, os numerais são grandes.

## Sistema visual

| Camada | Decisão |
|--------|---------|
| Superfícies dark | `carbon #000000` / `carbon-soft #1A1A1A` (preto puro + cinza escuro oficiais — decisão do Bruno em 2026-08-05: paleta estritamente mono, sem acentos de cor) |
| Acento | **Nenhum.** O bronze `#A8845F` foi testado e removido a pedido do Bruno (fora da paleta). Barras e detalhes usam branco sobre dark e preto sobre claro. Azul blueprint `#123A5E` segue reservado ao institucional |
| Seções claras | branco puro + `off-white #F4F2EC` existente |
| Display | **Archivo** (variável 500-900, `font-display`) — grotesca industrial já validada na v3 do institucional |
| Corpo/UI | **Manrope** (mantida, identidade atual) |
| Camada técnica | **Space Mono** 400 (`font-tech`) — labels minúsculas estilo anotação de prancha (`fase 02 · superestrutura`) |
| Fotografia | Full-bleed, grading quente golden-hour, corte editorial |
| Motion | Reveals e transições (easing expo canônico), nunca bounce. `prefers-reduced-motion` desliga tudo |

## Narrativa da home (10 blocos)

Hero cinematográfico (vídeo/poster 100svh) → statement editorial (SplitText scrub) → segmentos (parallax) → processo em 3 atos (sticky + crossfade) → números de engenharia (CountUp) → comparativo enxuto LSF vs convencional → rail de projetos nomeados (scroll-snap) → parceiros → CTA. Scroll global: Lenis escopado à home (lerp 0.12, anchors), GSAP ScrollTrigger só nos momentos-assinatura.

## Pipeline do vídeo de hero (pendente — Bruno executa a geração)

O hero está em modo poster (render 4K + Ken Burns) até o vídeo ser gerado. O swap é preencher `HERO_VIDEO_SOURCES` em `components/sections/home/HeroCinematic.tsx`.

**Passo a passo**:
1. Gerar 4-8 stills por conceito no Midjourney V7 (`--ar 16:9 --style raw`) ou FLUX.2 Pro; escolher 1-2.
2. Levar o still para image-to-video: Veo 3.1 (Flow) ou Kling 3.0 (mais barato para iterar), ~8 s, máxima resolução.
3. Salvar still em `Docs/banco-imagens/obras-projetos/` e apontar o vídeo bruto para o Claude.
4. Claude roda o ladder ffmpeg → `public/videos/hero/` (AV1 → HEVC `hvc1` → H.264, `-an -movflags +faststart`, ≤4 MB, poster do frame ~1s) e preenche os sources.

**Conceito A — "Chegada" (resultado aspiracional)**

Still:
> Photorealistic architectural photography, contemporary Brazilian luxury residence at golden hour, clean modernist volumes, warm wood slat cladding, floor-to-ceiling glass glowing with warm interior light, landscaped native garden with soft foreground blur, low sun 3000K raking across the facade, long soft shadows, cool 5600K sky fill, subtle atmospheric haze, 35mm lens f/4, eye-level, editorial real estate magazine style, muted warm color grade, no people, no text

Vídeo (i2v):
> Slow dolly in toward the residence, single continuous take at walking pace, golden hour light unchanged, gentle foliage movement in the breeze, warm interior lights glowing steadily, shallow depth of field with foreground parallax, cinematic, 8 seconds, no people, no text

**Conceito B — "Estrutura ao entardecer" (assinatura da marca, LSF literal)**

Still:
> Photorealistic construction photography, precise light steel frame structure of a luxury house at dusk, galvanized steel profiles catching warm 3000K low sunlight against a deep blue 7000K evening sky, geometric rhythm of vertical studs, one finished interior volume glowing warm behind the structure, subtle haze, 35mm lens f/5.6, low angle, editorial architecture magazine style, muted warm color grade, no people, no text

Vídeo (i2v):
> Slow lateral gimbal glide along the steel structure, single continuous take, dusk light unchanged, warm interior glow flickering subtly, geometric shadows shifting slowly across the ground, shallow depth of field, cinematic, 8 seconds, no people, no text

**Regras de prompt** (para variações): um único verbo de movimento por clipe; lente explícita; luz com temperatura em Kelvin; pistas de profundidade; duração em segundos; repetir os cues de estilo (paleta, hora, lente) em todos os clipes da série. IA é para atmosfera — obra real entra como fotografia real ([[banco-imagens]]), nunca render vendido como entrega.

## Follow-ups registrados

- [ ] Gerar vídeo do hero (conceitos A e B, decidir na design-review)
- [ ] Importar Clube Quinta dos Lagos (26 imagens em `C:\Users\bruno\Downloads\Arquitetura\originais\`) para o banco e avaliar entrada no rail de projetos
- [ ] Otimização de fontes: mover Playfair + Caveat do layout root para a rota `/orcamento` (únicos consumidores) — menos 2 famílias em todas as demais páginas
- [ ] First Load JS da home: 261 kB (stack GSAP+Lenis) — avaliar lazy-load das seções GSAP abaixo da dobra

Relacionados: [[site]] · [[berkahn-brand]] · [[design-principles]] · [[guia-design-berkahn]]
