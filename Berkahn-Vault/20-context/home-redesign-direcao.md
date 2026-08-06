---
tipo: context
criado: 2026-08-05
atualizado: 2026-08-06
tags:
  - domain/brand
  - domain/architecture
  - project/site
  - status/active
ai_summary: Direção visual da home redesenhada (2026-08-05/06) — "luxo de engenharia" em paleta estritamente mono (preto/branco/off-white, bronze testado e removido). Archivo display + Space Mono técnica, hero com SCRUB por scroll (sequência de frames em canvas, não autoplay), Lenis + GSAP. Contém o estado de entrega do PR 43, o pipeline de troca de take (trim/delogo/ffmpeg) e o banco de prompts steel-frame para gerar novos voos.
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

## Estado de entrega (2026-08-06 — branch `feat/home-scrollytelling`, PR #43)

**Hero final = scrub por scroll**: seção pinada (runway 260vh, sticky) com sequência de frames WebP desenhada em canvas — o drone avança na medida do scroll. `<video>` autoplay foi testado e substituído a pedido do Bruno; `video.currentTime` por scroll foi descartado (instável, mobile). Take em produção: **conceito A steel-frame** (corredor de montantes galvanizados ao pôr do sol terminando no quarto acabado), gerado por IA em 720p.

**Parâmetros do take atual** (para reproduzir/trocar):
- Fonte: `Downloads/Slow_forward_drone_glide_down.mp4` (1280×720, 24fps, 10s, ~1,9 Mbps)
- Trim `0,2s → 9,9s` · marca d'água removida com `delogo=x=1130:y=555:w=80:h=90`
- Frames: desktop `fps=9` nativo q82 (87 frames, ~4,9 MB em `public/videos/hero/seq/`), mobile `fps=4.5 scale=640` q80 (44 frames, `seq-m/`), poster q88
- Constantes `FRAME_COUNT_DESKTOP/MOBILE` em `components/sections/home/HeroCinematic.tsx` devem bater com a contagem de arquivos

**Como trocar o take** (pipeline validado 3×): apontar o novo MP4 → Claude inspeciona frames (ghost no início, endcard no fim, marca d'água), define trim/delogo, extrai sequências, atualiza contadores, build. ~10 min.

**Limitação conhecida**: o take veio 3× mais comprimido que o anterior (1,9 vs 5,8 Mbps) e a cena de perfis finos sofre — regerar em 1080p/HD é a pendência nº 1.

## Prompts históricos (pré-steel-frame)

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

**Regras de prompt** (para variações): um único verbo de movimento por clipe; lente explícita; luz com temperatura em Kelvin; pistas de profundidade; duração em segundos; repetir os cues de estilo (paleta, hora, lente) em todos os clipes da série. IA é para atmosfera — obra real entra como fotografia real ([[banco-imagens]]), nunca render vendido como entrega. **Truque validado**: para voos "saindo" da casa, gerar o inverso (entrando — os modelos acertam muito mais) e reverter no ffmpeg. **Aviso**: perfis metálicos finos derretem fácil na geração — pedir 4-8 variações e descartar geometria torta; exportar sempre na maior resolução (720p a 1,9 Mbps foi o gargalo de qualidade do take atual).

## Banco de prompts steel-frame (2026-08-06 — stills 16:9, still→i2v)

Cinco conceitos com o LSF como protagonista (prompts completos no formato das regras acima). **A** é o take em produção:

- **A · Corredor de montantes** *(em produção)*: `Photorealistic architectural photography, interior view inside a precise light steel frame house skeleton at golden hour, rhythmic rows of straight galvanized steel studs forming a corridor of perspective, one finished room at the far end glowing with warm 3000K interior light, low sun raking through the open structure casting long parallel shadows on the concrete slab, cool 5600K sky visible between profiles, subtle atmospheric haze, 24mm lens f/5.6, one-point perspective, editorial architecture magazine style, muted warm color grade, no people, no text` — i2v: `Slow forward drone glide down the corridor of steel studs toward the glowing finished room, single continuous take, golden hour light unchanged, long shadows shifting slowly, shallow depth of field with stud parallax, cinematic, 8 seconds, no people, no text`
- **B · Metade obra, metade casa**: casa mid-construction, metade esqueleto galvanizado / metade volume acabado com madeira e vidro aceso, three-quarter view 28mm — i2v: glide lateral do cru para o pronto
- **C · Catedral contra o sol**: interior wide 18mm low angle, sol estourando direto entre montantes e tesouras, feixes volumétricos 2800K, sombras duras no radier — i2v: dolly frontal em direção ao sol (mais bonito e mais propenso a derreter geometria)
- **D · Aéreo de implantação**: drone elevado three-quarter sobre a estrutura no terreno paisagístico, grid geométrico preciso, montanhas 6000K ao fundo, 35mm — i2v: aproximação descendente
- **E · Do aço ao acabado, por dentro**: montantes em primeiro plano emoldurando a sala pronta com portas abertas para o terraço, one-point 24mm — i2v: glide atravessando os montantes até as portas

## Follow-ups registrados

- [x] ~~Gerar vídeo do hero~~ — take A em produção (2026-08-06)
- [ ] **Regerar o take A em 1080p/HD** na ferramenta (mesmo prompt) — o 720p a 1,9 Mbps limita a nitidez dos perfis; swap em ~10 min pelo pipeline documentado acima
- [ ] **Review visual humano completo + `@design-review` + Lighthouse/CWV** antes de mergear o PR #43 (o subagent de design nunca rodou nesta feature)
- [ ] **Mergear PR #43** — atenção: `00-meta/projetos/site.md` foi editado em paralelo nas branches `feat/home-scrollytelling` e `feat/quadro-conteudo`; reconciliar as duas atualizações no merge
- [ ] Importar Clube Quinta dos Lagos (26 imagens em `C:\Users\bruno\Downloads\Arquitetura\originais\`) para o banco e avaliar entrada no rail de projetos
- [ ] Otimização de fontes: mover Playfair + Caveat do layout root para a rota `/orcamento` (únicos consumidores) — menos 2 famílias em todas as demais páginas
- [ ] First Load JS da home: 271 kB (stack GSAP+Lenis+Embla) — avaliar lazy-load das seções GSAP abaixo da dobra
- [ ] **Próxima página do redesign: `/atualidades`** — mesma linguagem desta nota (mono, Archivo/Space Mono, motion contido); é a rota de maior tráfego do site (SSG/ISR — não regredir para dynamic)

Relacionados: [[site]] · [[berkahn-brand]] · [[design-principles]] · [[guia-design-berkahn]]
