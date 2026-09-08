---
tipo: meta
criado: 2026-09-08
atualizado: 2026-09-08
tags:
  - source/handoff
  - project/site
  - status/active
ai_summary: "Ponto de retomada da página /sustentabilidade. Código pronto na branch feat/sustentabilidade, PR 80 aberto e verde, NÃO mergeado. Três rodadas concluídas: construção, revisão de dado e código, auditoria de design. Falta a lista de ajustes do Bruno, que ele vai passar, e as decisões de conteúdo listadas aqui. Contém as armadilhas técnicas descobertas e os comandos exatos para retomar."
status: active
projeto: site
contextos_aplicados:
  - berkahn-brand
  - home-redesign-direcao
  - design-principles
---

# Retomada — página /sustentabilidade

> **Onde parou**: a página está construída, revisada e auditada. O PR está aberto e verde. **Não foi feito merge**, porque deploy é decisão do Bruno e ainda vem uma rodada de ajustes que ele vai passar.

## Estado em uma tela

| | |
|---|---|
| Branch | `feat/sustentabilidade` |
| Worktree | `.worktrees/sustentabilidade` (a partir de `origin/main`) |
| PR | [#80](https://github.com/danielbkfalci00/berkahn/pull/80), aberto, `MERGEABLE`, `validate=SUCCESS` |
| Commits | 6, do `6e4c539` ao `de5809c` |
| Merge | **não feito, de propósito** |
| Dev server | porta 3113 |
| Altura da página | 11.394px no desktop, 10.517px no celular |

## Como retomar

```bash
cd "C:/Users/bruno/Documents/Pessoal/Site Berkahn/.worktrees/sustentabilidade"
npx next dev -p 3113
```

Ver a página inteira, quadro a quadro, em desktop e celular:

```bash
node scripts/ui/tiras.mjs ./tiras
```

Medir altura e espaço morto por seção:

```bash
node scripts/ui/medir-secoes.mjs
```

Os dois scripts nasceram nesta sessão e estão versionados. **Leia o cabeçalho deles antes de usar**: o painel de navegador embutido não compõe quadro enquanto o Lenis anima, então screenshot de página com scroll suave sai em branco. É por isso que a captura roda por fora, com roda do mouse.

> No `medir-secoes`, as duas linhas marcadas `<<< folga` (`extracao` e `parede`) **não são espaço morto**. São a pista de rolagem dos trechos com viewport preso. Não "corrigir".

## O que a página é hoje

Oito seções e um CTA. Cada seção tem uma mecânica de scroll diferente, de propósito: repetir recurso na mesma visita foi o que o Bruno rejeitou na primeira versão da seção 05 da home.

| # | seção | fundo | mecânica |
|---|---|---|---|
| 00 | abertura | carbon | foto de cava de areia recua devagar, texto sobe e sai antes; headline em linhas mascaradas (SplitText) |
| 01 | a escala | off-white | numeral gigante sólido + **índice das seis contas**, que é a navegação da página |
| 02 | o que a obra arranca | carbon | **track horizontal** com viewport preso; três painéis giram em Y ao passar pelo centro |
| 03 | a madeira | carbon | dois planos de mata em velocidades diferentes, com desfoque **fixo** por distância |
| 04 | a parede | carbon | **corte que se abre no eixo Z**, seis camadas em perspectiva; usa as nossas fotos de `public/images/Lsf/Layers/` |
| 05 | a perda | off-white | duas colunas-instrumento preenchidas por `clip-path` |
| 06 | o aço | carbon | traçado fechado que se desenha por `strokeDashoffset`, com um quadrado percorrendo o circuito |
| 07 | a prática | white | três práticas e o bloco escuro "O que a gente não afirma" |
| — | CTA | white | variante editorial, botão "Pedir o cálculo do meu projeto" |

Regras que valeram e continuam valendo: **sem `ScrollTrigger.pin`** (track alto com filho `sticky`, porque pin briga com o Lenis); o estado base do HTML é sempre o estado **final** da animação, então sem JS ou com `prefers-reduced-motion` cada seção continua sendo um diagrama legível; nunca dois fundos iguais em sequência; o branco puro aparece uma vez só.

## O que foi feito, em três rodadas

**1. Construção.** Seis pesquisas em paralelo (vault, codebase, dados globais, floresta e aço, referências de motion, imagens), três concepções independentes e uma síntese. Implementação, PR #80.

**2. Revisão de dado e de código.** Duas revisões independentes sobre o diff. A de dado achou duas frases que se contradiziam na mesma tela e um padrão de publicar sempre o topo da faixa. A de código achou dois vazamentos de ScrollTrigger criados fora do contexto do `useGSAP` e duas fontes de verdade duplicadas.

**3. Auditoria de design e UX.** Cinco lentes independentes sobre **screenshots reais** da página inteira mais o código, e uma síntese. Achou quatro defeitos críticos, **três dos quais não apareciam na leitura do código**. Detalhe completo em [[home-redesign-direcao]], seção "Auditoria de design e UX (2026-09-07)".

## A decisão que define a página

**O argumento de carbono do Light Steel Frame não se sustenta.** O único ACV brasileiro revisado por pares que compara os dois sistemas de berço ao túmulo (Caldas et al., *Ambiente Construído*, 2017) conclui a favor da **alvenaria** no ciclo completo, porque a operação responde por 50% a 70% do total.

Por isso: nenhum kgCO₂/m² entra na página, e a seção 07 declara a limitação em vez de escondê-la. O eixo defensável é o que a obra **extrai, desperdiça e deixa para trás**.

Isso tem consequência fora desta página, e está registrado como pendência no hub: o resto do site ainda publica três valores de carbono incompatíveis entre si.

## O que falta

### A · Ajustes do Bruno

> **A preencher.** Ele disse que ainda vem uma rodada de ajustes e que passa a lista. Quando passar, ela entra aqui, item a item, antes de qualquer código ser tocado.

### B · Decisões de conteúdo que dependem dele

- **Foto do hero.** Era mata com névoa, virou cava de areia, porque a mata é a imagem mais genérica que existe para o assunto e era a única não documental da página. Se ele preferir a floresta, é uma linha em `lib/sustentabilidade-data.ts`.
- **As oito fotos do Unsplash são provisórias.** Slots: abertura (cava de areia), cimento, areia, rio seco, fôrma de madeira, entulho, sucata e o plano de mata secundário. As seis fotos de camada da parede são nossas.
- **O memorial da parede se contradiz sobre o OSB.** `lib/lsf-data.ts:296` diz "Cimentícia 10mm **ou** OSB 11.1mm" e `lib/lsf-data.ts:581` diz que "todas as paredes externas recebem placas OSB". Como `LSF_LAYERS` não lista o OSB, o fecho da seção 03 foi reescrito para falar do que a gente compra, e não de uma camada do diagrama. Falta fechar qual é o detalhe padrão.
- **Certificado florestal do OSB.** Sem o número do certificado do fornecedor, a tela só pode dizer "pinus de floresta plantada" e nunca nomear FSC ou CERFLOR.
- **A fonte do par de desperdício** ("< 5%" contra "até 30%") não tem referência primária. É o número mais citado do site, aparece na home e aqui.
- **Merge e deploy.** Não foram feitos.

### C · Técnicas conhecidas

- Medir CWV depois do deploy. São oito fotos do Unsplash servidas pelo otimizador, uma cena 3D de seis camadas e um track horizontal. Peso de imagem da página inteira hoje: cerca de 1,3 MB.
- Foto de OSB estrutural para o banco de imagens: é a única camada da parede que não fotografamos, e por isso o corte 3D mostra seis camadas enquanto o sistema real tem sete.
- O interior do retângulo do circuito do aço (seção 06) continua vazio. Funciona como diagrama, mas é o ponto mais fraco de composição que sobrou.

## Armadilhas descobertas, para não repetir

**CSS e 3D**
- `overflow: hidden` **não recorta** subárvore em `transform-style: preserve-3d`. Só `clip-path: inset(0)` recorta. Foi o que fez as placas da parede pintarem por cima do texto.
- Em `rotateY(θ)`, o eixo Z local aponta para `x = sin(θ)`. O **sinal** decide para que lado o leque abre.
- `carbon` contra `carbon-soft` é 10% de luminância: **não marca capítulo**. `carbon-soft` é cor de chapa sobre o preto, não cor de chão. Capítulo se marca com régua de 3px full-bleed.

**GSAP e Lenis**
- Animação criada dentro de callback assíncrono (`onload`, `.then`) **não entra** no contexto do `useGSAP` e nunca é revertida. Precisa de `contextSafe`.
- Quando o gatilho é uma seção alta e o elemento animado é pequeno, o gatilho tem que ser **o elemento**. O circuito do aço fechava acima do topo da janela porque o gatilho era a seção inteira.
- O Lenis **reverte scroll programático**. Para navegar em teste, clique numa âncora ou use roda do mouse.
- `ScrollTrigger.pin` briga com o Lenis. Use track alto com filho `sticky`.

**Números na tela**
- Contador que interpola inteiros exibe valores errados no caminho ("49 bilhões" antes de 50). Numa página cuja tese é precisão, isso custa caro. Nesta página os contadores só existem onde a viagem entre dois valores é o argumento.
- Onde a fonte descreve faixa, a tela mostra faixa. Publicar sempre o topo é um viés que o leitor identifica na terceira ocorrência.

**Processo**
- Auditar design **lendo código não funciona**. Três dos quatro defeitos críticos só apareceram no screenshot.
- Uma sessão longa pode esbarrar no limite e derrubar o último agente do workflow. Retomar com `resumeFromRunId` reaproveita tudo que já rodou.

## Relacionados

[[site]] · [[home-redesign-direcao]] · [[berkahn-brand]] · [[steel-frame-domain]]
