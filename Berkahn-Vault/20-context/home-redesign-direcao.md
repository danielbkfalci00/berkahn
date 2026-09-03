---
tipo: context
criado: 2026-08-05
atualizado: 2026-09-02
tags:
  - domain/brand
  - domain/architecture
  - project/site
  - status/active
ai_summary: Direção visual do redesign do site (2026-08-05/06) — "luxo de engenharia" em paleta estritamente mono, Archivo display + Space Mono técnica e motion contido. Aplicada na home e em /atualidades, cuja abertura funde masthead e destaque editorial sem regredir SSG/ISR. Contém o estado do PR 43, pipeline do hero, o banco de prompts de fotografia documental de obra e decisões reutilizáveis para as próximas rotas.
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

## Narrativa da home (9 blocos)

Hero cinematográfico (canvas/poster 100svh) → expertise institucional (SplitText scrub) → segmentos (parallax) → processo em 4 fases (sticky + crossfade) → introdução LSF + comparativo enxuto (04) → **impacto para quem mora, quem paga e a cidade (05, desde 2026-09-02; substituiu o bloco de números CountUp)** → parceiros → CTA. O rail de projetos está preservado no código, mas desmontado temporariamente da home. Scroll global: Lenis escopado à home (lerp 0.12, anchors), GSAP ScrollTrigger só nos momentos-assinatura.

## Estado de entrega (2026-08-06 — PR #43 mergeado)

**Hero final = scrub por scroll**: seção pinada (runway 260vh, sticky) com sequência de frames WebP desenhada em canvas — o drone avança na medida do scroll. `<video>` autoplay foi testado e substituído a pedido do Bruno; `video.currentTime` por scroll foi descartado (instável, mobile). O take foi trocado em 2026-08-06 por uma fonte 1080p de 8 s, usada integralmente e sem delogo.

**Parâmetros do take atual** (para reproduzir/trocar):
- Fonte local: `Downloads/Firefly Slow forward drone glide down the corridor of steel studs toward the glowing finished room, .mp4` (1920×1080, 24fps, 8s); o MP4 não é versionado
- Sem trim e sem delogo; início e fim foram inspecionados como limpos
- Frames (revisão de 2026-08-18, para tirar o borrado): desktop `fps=7 scale=1920 q78` (56 frames, 7,5 MB em `public/videos/hero/seq/`), mobile `fps=4.5 scale=960 q78` (36 frames, 1,8 MB em `seq-m/`), poster = cópia de `seq/f_001.webp` (182 KB)
- Antes eram 1440×810 q72 no desktop e 640 no mobile, ou seja, a fonte 1080p era reduzida antes de publicar e o canvas ampliava de novo em tela grande (fator 1,33 num monitor de 1920). Agora a resolução do frame bate com o buffer do canvas em 1920 e o desenho passa a ser 1:1
- Teto restante: a fonte é 1080p. Em tela 4K ou DPR 2 acima de 1920 CSS o canvas volta a ampliar; só resolve com take em resolução maior ou upscale do MP4
- Preload imediato limitado a 4 frames (~730 KB, era 6 quando o frame pesava 80 KB); restante carrega progressivamente em background
- Constantes `FRAME_COUNT_DESKTOP/MOBILE` em `components/sections/home/HeroCinematic.tsx` devem bater com a contagem de arquivos

**Como trocar o take** (pipeline validado): apontar o novo MP4 → inspecionar início/fim e marcas → decidir trim/delogo apenas se necessário → extrair sequências → validar pesos/contagens → atualizar contadores → build. ~10 min.

**Copy institucional**: o redesign visual mantém o texto aprovado anterior ao PR #43, com `bc6515f` como fonte canônica. Foram restaurados hero, expertise, segmentos, promessa da construtora completa, quatro fases de `EXECUTION_PHASES` e introdução LSF; stats e comparativo novos foram mantidos.

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

## Aplicação em `/atualidades` (2026-08-06)

A rota de maior tráfego foi redesenhada na mesma branch. A abertura funde `HeroEditorial` e o post curado: carbono/off-white, label técnica minúscula, Archivo, barra estrutural de 3 px e capa/título/resumo/metadados na primeira sequência visual. A listagem usa cinco categorias canônicas com contagem e bento assimétrico nos cinco primeiros resultados; filtros usam scroll-snap nativo, sem Embla adicional.

A página continua SSG/ISR (`revalidate = 60`, `createPublicClient`, sem `cookies()`/`loading.tsx`). O `select('*')` foi substituído por 10 campos e a conversão ocorre no Server Component. HTML de produção caiu de **809/239 KB** bruto/comprimido para aproximadamente **139/26 KB**; após separar hero/CTA do boundary interativo, o build registra rota 6,52 KB e First Load 204 KB. Artigo válido retorna 200 e slug falso 404.

CWV em produção após os PRs #43/#44 (3 rodadas Lighthouse mobile com throttling): CLS 0 em todas; LCP 3,04–3,54 s e TBT 304–756 ms. Houve melhora forte sobre o baseline (LCP até 5,38 s; TBT até 1.736 ms) após adiar GA até consentimento, priorizar a imagem LCP e reduzir o boundary interativo. O gate sintético estrito ainda não fechou; validar dados de campo no Speed Insights antes de ampliar a refatoração global.

Relacionados: [[article-pipeline]] · [[seo-aeo-strategy]] · [[site]] · [[blog]]

## Follow-ups registrados

- [x] ~~Gerar vídeo do hero~~ — take inicial entregue em 2026-08-06
- [x] ~~**Trocar o take do hero por fonte 1080p/HD**~~ — concluído em 2026-08-06 com 72/36 frames, poster de 116 KB e seis eager em 580 KB
- [x] ~~**Review visual humano completo + `@design-review`**~~ — repetido em 2026-08-06 para o novo take; os dois gaps materiais foram corrigidos: CTA mobile acima do consentimento e marquee estático em reduced-motion. Verificado em 390, 768, 1024 e 1440 px
- [x] ~~**Mergear PR #43**~~ — mergeado em 2026-08-06; o follow-up PR #44 fechou progresso de leitura, featured único e carregamento de analytics por consentimento. Migration 012 aplicada: 16/9/8/3/4 posts nas cinco categorias e um único destaque
- A importação do Clube Quinta dos Lagos e a reativação do `ProjectsRail` têm owner em [[site#Próximos 7 dias]].
- A otimização de Playfair/Caveat e o lazy-load das seções GSAP têm owner em [[site#Próximos 7 dias]].
- O baseline local do novo take foi LCP 2,80–4,24 s, CLS 0–0,001 e TBT 682–1.226 ms; payload de 5,28 MB desktop / 1,01 MB mobile, com 580 KB imediatos no desktop. A tarefa de campo vive em [[site#Próximos 7 dias]].
- First Load JS observado: 264 kB com GSAP+Lenis, contra 271 kB antes do redesign.
- [x] ~~**Próxima página do redesign: `/atualidades`**~~ — concluída em 2026-08-06 com abertura editorial fundida, taxonomia 5 categorias, bento, payload reduzido e ISR 60 preservado. CWV pós-deploy segue como gate aberto

Relacionados: [[site]] · [[berkahn-brand]] · [[design-principles]] · [[guia-design-berkahn]]

## Banco de prompts · fotografia de obra (2026-08-18)

Feedback do sócio: as fotos das quatro fases são genéricas e denunciam banco de imagem ou IA. O alvo é fotografia documental de canteiro brasileiro, não publicidade. O que quebra o visual de IA é imperfeição deliberada: enquadramento torto, sujeira, cabo no chão, pessoa cortada pela borda, luz mista, nada simétrico.

**Sufixo de estilo (colar no fim de todo prompt)**

`documentary photograph, handheld with a slight tilt, ISO 800, natural mixed lighting, muted neutral colors, visible grain, unposed, no perfect symmetry, no glossy CGI look, no lens flare, no stock-photo smiles, no logos, no text, no watermark`

**Regras que mais importam**

- Rosto nunca nítido de frente. Pessoa de costas, cortada pela borda ou só a mão. Rosto em foco é onde a IA entrega o jogo.
- Luz difusa de dia nublado ou mistura de luz fria de janela com lâmpada quente. Golden hour em tudo vira anúncio.
- Sempre pedir dois defeitos concretos: poeira no ar, respingo, marca de bota, cabo laranja no chão, sobra de perfil, fita crepe.
- Superfície nova demais denuncia. Pedir arranhão, digital no metal, barro na botina.
- Gerar 4 variações e escolher a menos limpa. Se vier plastificado, acrescentar `straight out of camera JPEG, no retouching`.
- Proporção: `--ar 3:2` para as fases (home e `/servicos`), `--ar 4:3` para a imagem da seção LSF da home.

### 01 · Pré Obra — substitui `Services/Execução-de-obras/Pre-obra/pre-obra-1.webp`

`Two people leaning over a large printed architectural blueprint spread across a scratched wooden table, hands pointing at a detail, rolled drawings, a scale ruler and a half-empty coffee cup beside them, one person cropped by the frame edge, faces not visible, cool daylight from a window on the left mixing with warm tungsten overhead, slightly uneven white balance, 35mm lens at f/2`

### 02 · Terraplanagem, Fundação e Superestrutura — substitui `Terraplanagem/terraplanagem_1.webp`

`Concrete slab foundation being finished on a residential site in Brazil, a worker in a dusty helmet and reflective vest seen from behind pulling a screed board across wet concrete, footprints and tire tracks in the red-brown earth around it, rebar offcuts and a wheelbarrow at the frame edge, overcast diffuse midday light, no dramatic sky, mud on boots and equipment, 28mm lens at f/5.6`

### 03 · Estrutura, Vedação e Instalações — substitui `Estrutura/estrutura-2.webp`

`Interior of a light steel frame house at closing stage, cement board panels screwed to galvanized steel studs on one side and open insulation cavity on the other, electrical conduits and blue water pipes running through the studs, screws scattered on the dusty floor, an orange extension cord snaking across the slab, a stepladder in the corner, daylight from an unfinished window opening mixing with a bare work lamp, one worker's arm entering the frame, 24mm lens at f/4`

### 04 · Acabamentos — substitui `Acabamentos/acabamentos_1.webp`

`A painter's hand rolling the last coat on a smooth interior wall of a nearly finished house, masking tape along the baseboard, a paint tray and a drop cloth on the floor with a few dried drips, soft late afternoon daylight from a window out of frame, face not visible, slight vignetting, 50mm lens at f/2`

### 05 · Seção LSF da home — substitui `Home/lsf-estrutura.webp`

`Wide interior view of a completed light steel frame skeleton of a house before closing, rhythmic rows of galvanized studs and roof trusses against an overcast sky, slab floor with chalk layout lines and a few metal offcuts, a ladder leaning against one wall, flat diffuse daylight, no sun flare, chest height, 20mm lens at f/8, slight perspective imperfection, no people`

A imagem da seção LSF entra monocromática por CSS (`grayscale`), então vale escolher a variação com mais contraste de forma e menos dependência de cor.

**Estado (2026-08-18): os cinco prompts foram executados e as imagens estão no ar.** Geradas no ChatGPT Image, convertidas para webp (1440x960 nas fases, 1360x1020 na seção LSF, q82) e instaladas nos caminhos acima. Os originais em resolução cheia ficam em `Docs/banco-imagens/ia-fases-obra/` com prefixo `ia-`, que marca a procedência e evita confundir com foto de obra real. Os `alt` das quatro fases foram reescritos para descrever as fotos novas.

Pendente: as imagens **secundárias** de cada fase (`pre-obra-2`, `terraplanagem_2`, `estrutura-1`, `acabamentos_2`), que aparecem no carrossel de `/servicos`, continuam sendo as genéricas antigas e destoam das novas. Mesmos prompts com outro enquadramento resolvem.

Relacionados: [[berkahn-brand]] · [[guia-design-berkahn]] · [[banco-imagens]]

## 05 · impacto (2026-09-02)

Seção nova entre o comparativo (04) e os parceiros, inspirada em "Nosso impacto" da AD Barbieri, mas com recortes de construtora, não de fabricante: **para quem vai morar · para quem paga a obra · para o terreno e a cidade**. Substituiu o `StatsCounter`, que ficava antes do 04, sem label na série numerada e com os mesmos quatro números que o comparativo já mostrava.

- Componente: `components/sections/home/ImpactPinned.tsx` (client, GSAP via `@/lib/gsap`). **Três batidas com o viewport preso** (track de 320vh, sticky), uma por conta. O herói de cada batida é um **número em escala de viewport (14–19vw) que conta conforme o scroll**, saindo do valor do sistema convencional e chegando ao do LSF (0→50 dB, 30→5%, 16→100%). Uma linha de texto por batida, até doze palavras; o número secundário vira legenda mono. Composições diferentes por batida (esquerda, centro grande, direita) para não repetir. **Profundidade por duas velocidades**: a foto ao fundo avança (zoom 1→1,15 + parallax) enquanto os números derivam no sentido oposto; o véu clareia na última batida. **Cada batida tem a própria foto** (acabamento → estrutura em fechamento → esqueleto galvanizado), que no desktop troca na placa a cada batida. **Mobile com motion** (revisão de 2026-09-02, depois de o Bruno achar a pilha "meio bosta"): três cartões de ~88svh com a foto ao fundo respirando no scroll (zoom 1,12→1), número contando uma vez ao entrar na tela e a mesma alternância de composição do desktop; a pilha estática de antes, com a foto solta em cima e três blocos iguais, tinha perdido tudo que faz a seção funcionar. Reduced-motion: os mesmos cartões, parados, com os números finais. O prefixo "<" e a unidade são spans menores que o numeral, e o "<" só aparece no valor final. Bug corrigido de passagem: a legenda mono tinha `lowercase` e rebaixava siglas ("nbr", "abnt", "co₂"). **Fontes não vão para a tela** (decisão do Bruno em 2026-09-02): ficam como `source` em cada número no arquivo de dados. Sem link de saída no fim da seção; o "Por que construção a seco" para `/lsf` foi cortado por não levar a nada que a seção já não diga.
- A primeira versão, um "ledger" de três linhas iguais com seis números e três parágrafos, foi rejeitada pelo Bruno em 2026-09-02 por genérica, repetitiva e sem motion. Lição registrada: contenção sem momento-assinatura vira ficha técnica; na home, o número precisa ser o herói de algum lugar.
- Dados: `lib/impact-data.ts` com `IMPACT_SECTION` (`hero` com `from/to` por batida, `aside`, `claim`), o registro `SOURCES` e `impactSources()`, que gera a lista de fontes a partir dos números. **Regra do arquivo: nenhum número entra sem `source`.** O registro nasce aqui para virar fonte única do site.
- Imagem: **a Casa Santa Cristina foi usada e retirada no mesmo dia. Não é obra Berkahn** (é projeto de terceiro que aparece no portfólio), e uma seção chamada "impacto" não pode ter como placa uma casa que não construímos. A placa atual é `Services/Execução-de-obras/Estrutura/estrutura-2.webp` (interior LSF em fechamento, com lã de vidro à vista, que conversa com as três contas: acústica, canteiro limpo, aço). Ela repete a fase 03 do processo; a placa definitiva deve ser gerada com o prompt abaixo e salva em `public/images/Home/impacto-plate.webp`, trocando só o `src` em `lib/impact-data.ts`.

  Prompt da placa definitiva (mesma receita do banco de fotografia de obra; `--ar 16:9`, escolher a variação menos limpa):
  `Close-up documentary photograph inside a light steel frame wall under construction, galvanized steel studs and tracks filling the frame in rhythmic rows, mineral wool insulation packed between them, a few screws and a cordless drill resting on the bottom track, fine dust on the metal, flat diffuse daylight from an unfinished window opening, no people, 35mm lens at f/4, handheld with a slight tilt, ISO 800, muted neutral colors, visible grain, no perfect symmetry, no glossy CGI look, no logos, no text`

| Bloco | Números | Fonte |
|---|---|---|
| morar | 45–50 dB na parede · 4× menos calor atravessa a parede | spec Berkahn (lã 90 mm) ref. NBR 15575 · NBR 15220-3 (U 0,38–0,5 vs tijolo 2,0–2,5) |
| pagar | < 5% de desperdício (vs até 30%) · 2022, norma própria (NBR 16970) | SINDUSCON-SP · ABNT |
| cidade | 100% do aço reciclável (vs 16% do entulho reciclado) · 1,5 t de CO₂ evitada por tonelada de aço reciclado | World Steel + Instituto Aço Brasil · ABRECON |

Decisões de dado, com o porquê:
- **Água ficou fora.** Cinco valores coexistem no projeto (60%, 70%, 90%, 99%, >99%) e nenhum tem fonte primária forte. A frase do bloco 01 cobre o tema sem número.
- **Térmico só como transmitância**, com razão conservadora (pior LSF contra melhor tijolo). O blog registra que o LSF reprova na capacidade térmica da NBR 15575 pela rota simplificada, então "desempenho térmico conforme NBR" contradiria o próprio conteúdo.
- **O "180,41 kgCO₂e/m²" do vault não se sustentou.** O paper existe (Abouhamad & Abu-Hamd, *Sustainability* 2020, 12(24):10686, DOI 10.3390/su122410686), mas o abstract não traz nenhum valor por m², só percentuais de um estudo de caso de um edifício universitário. Entrou o fallback previsto: 1,5 t de CO₂ evitada por tonelada de sucata (World Steel). Os dois artigos de sustentabilidade que citam 180,41 precisam de conferência no texto integral. Registrado no hub.
- Só um número repete o comparativo (desperdício), reenquadrado como dinheiro e agora com fonte.

Relacionados: [[site]] · [[berkahn-brand]] · [[steel-frame-domain]] · [[design-principles]]
