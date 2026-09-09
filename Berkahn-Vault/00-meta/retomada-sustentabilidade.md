---
tipo: meta
criado: 2026-09-08
atualizado: 2026-09-09
tags:
  - source/handoff
  - project/site
  - status/active
ai_summary: "Ponto de retomada da página /sustentabilidade. Código na branch feat/sustentabilidade, PR 80 aberto e verde, NÃO mergeado. O Bruno reprovou o design em 2026-09-08 e pediu remodelagem: mais respiro, IMAGENS COLORIDAS no lugar do preto e branco, fora o índice, o fundo quadriculado, a numeração de seção e as réguas entre seções, e um storytelling que mostre o estrago da construção convencional antes da saída. O briefing completo, seção por seção, está aqui, junto das armadilhas técnicas e dos comandos para retomar. Nada foi executado."
status: active
projeto: site
contextos_aplicados:
  - berkahn-brand
  - home-redesign-direcao
  - design-principles
---

# Retomada — página /sustentabilidade

> **Onde parou**: a página está construída, revisada e auditada, e o PR está aberto e verde. Em 2026-09-08 o Bruno **reprovou o design** e passou um briefing de remodelagem, que está escrito neste documento e **não foi executado**. Não foi feito merge.

## Estado em uma tela

| | |
|---|---|
| Branch | `feat/sustentabilidade` |
| Worktree | `.worktrees/sustentabilidade` (a partir de `origin/main`) |
| PR | [#80](https://github.com/danielbkfalci00/berkahn/pull/80), aberto, `MERGEABLE`, `validate=SUCCESS` |
| Commits | 8, do `6e4c539` ao `65872e8` |
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

> **Recebidos em 2026-09-08 e escritos abaixo**, na seção "Briefing de ajustes". Nada foi executado.

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

## Briefing de ajustes do Bruno (2026-09-08)

> **Nada disto foi executado.** A sessão fechou aqui, de propósito, para a próxima começar com a fila pronta. O Bruno cogitou retomar com outro modelo, então este bloco é escrito para quem chega sem contexto nenhum.

### O veredito dele, sem filtro

> "Tá bem ruim pra ser sincero." · "Uma coisa muito densa por completo." · "Precisa ser mais minimalista, ter mais hierarquia de informação clara e não tornar tudo uma salada de fruta." · "Tornar as coisas mais vivas."

Não é ajuste fino. É pedido de **remodelagem** de quase toda seção, mantendo a apuração e o argumento. Quem retomar não deve tentar remendar seção por seção antes de refazer a direção visual.

### 1 · Respiro. A página está espremida perto da home

Ele abriu por aqui: o cabeçalho precisa ficar **igual ao da home**, e na home existe um espaço entre o cabeçalho e a primeira informação que aqui não existe.

**Causa medida, e é minha:** o componente de header é o mesmo nas duas rotas (84px de altura, `main` sem padding). A diferença está na primeira seção depois do hero.

| | primeira seção de conteúdo |
|---|---|
| home | `py-3xl` → **192px** em cima e embaixo |
| /sustentabilidade | `py-2xl` → **128px** |

Eu reduzi de 192 para 128 em seis seções seguindo a auditoria de design, que mediu ~2.700px de padding aplicado sem julgamento. **A auditoria otimizou densidade; o olho do Bruno pede o respiro da home.** Ele decide. Se voltar para 192px, a página cresce ~800px no desktop, e aí o corte de gordura tem que vir de outro lugar: menos seção, não menos respiro.

### 2 · Cor. Este é o item mais estruturante do briefing

> "Gostaria de trabalhar mais imagens coloridas e menos imagens preto e branco. Vale para o hero, vale para as outras telas." · "À medida que a gente for scrollando, pode haver a imagem ir de preto e branco para colorido." · "Tem um storytelling de cor também."

**Atenção, porque isto atravessa a marca.** A paleta mono e o `grayscale` nas fotos não são escolha desta página: estão em [[guia-design-berkahn]] e [[berkahn-brand]], e a home inteira é assim. Aplicar cor só aqui cria uma rota fora do sistema; aplicar em tudo é mudança de identidade visual.

Antes de escrever qualquer CSS, quem retomar precisa fechar com o Bruno **qual das três** vale:
1. cor só nesta página, assumida como exceção editorial;
2. cor como recurso narrativo controlado, o cinza virando cor no scroll, aqui e depois em outras rotas;
3. revisão da regra mono no guia de design.

A ideia dele de **grayscale → colorido conforme o scroll** é boa e é implementável: `filter: grayscale(1) → grayscale(0)` num ScrollTrigger com scrub. Casa com o arco da página, que vai do problema para a saída. Custa repaint, então tem que ser em poucos elementos grandes, não em todas as fotos.

### 3 · Fora da página

Quatro coisas para remover, nas palavras dele:

- **O índice da primeira seção.** "Fica meio quebrado, não tá muito bonito e eu acho que nem precisa. A primeira seção pode trabalhar um pouco mais da ideia central da página e menos do índice." Ironia registrada: o índice foi criado no hero, removido na auditoria, recriado dentro da seção 01 pela mesma auditoria. Agora sai de vez.
- **O fundo quadriculado.** "Não tem nada a ver com a marca." É a utility `.fluxograma-grid-bg`, usada em `ScaleStatement` e nas molduras de `WasteScales`. Ela é pré-existente no projeto (nasceu no fluxograma de Etapas da Obra), mas não é vocabulário desta página.
- **A numeração de seção** (`01 · a escala`, `02 · o que a obra arranca`…). "Parece um slide de apresentação, horrível. Essa página precisa ser mais um storytelling e menos uma apresentação de PowerPoint." **Cuidado**: esse formato veio da home, onde a seção se chama `05 · impacto`. Tirar aqui abre uma inconsistência com a home que precisa ser assumida ou resolvida nas duas.
- **As réguas de 3px separando seções.** "A gente tem linhas separando sessões, nossa, tá horrível isso aqui." Elas entraram na auditoria para marcar capítulo depois que ficou provado que preto contra carbon-soft não marca nada. Saindo elas, o problema de fronteira entre seções escuras volta e precisa de outra solução.

### 4 · O storytelling que ele quer

A tese, na fala dele: a construção convencional, no Brasil e no mundo, **é muito maléfica para o planeta**; a construção a seco vem trazer o braço de sustentabilidade **de maneira muito forte**; e isso é algo que **a Berkahn preserva muito**. Ele diz que isso não ficou claro na página por completo e que é preciso redefinir com base nisso.

**A restrição que não pode ser esquecida na reescrita:** o argumento de carbono do Light Steel Frame **não se sustenta** (ver o bloco "A decisão que define a página", acima). Quem reescrever para "construção a seco é sustentável de maneira muito forte" vai sentir a tentação de ressuscitar o kgCO₂/m². Não pode. O eixo defensável continua sendo o que a obra **extrai, desperdiça e deixa para trás**, e a página tem fonte primária para cada um desses.

A leitura conciliadora, que provavelmente é o caminho: o problema hoje está **espalhado em números** e não em narrativa. O Bruno quer sentir o peso do estrago da construção convencional antes de ver a saída. Isso é ordem, ritmo e imagem, não dado novo.

### 5 · Seção por seção, nas palavras dele

| seção | componente | o que ele disse |
|---|---|---|
| 01 · a escala | `ScaleStatement.tsx` | índice quebrado e desnecessário; trabalhar a ideia central; fundo quadriculado fora |
| 02 · o que a obra arranca | `ExtractionTrack.tsx` | "legal a gente ter um sistema de scroll, mas as imagens preto e branco, não gostei"; "parece que as imagens ficam cortadas, não ficou muito legal esse scroll" |
| 03 · a madeira | `ForestLayers.tsx` | "ficou meio jogado esse design, essa UX/UI, precisa remodelar tudo, não fez sentido, tanto no mobile quanto no desktop"; "muito quebrado essas duas imagens"; "hierarquia de informação e UX/UI tá péssima" |
| 04 · a parede | `WallExploded.tsx` | "componentização quebrada, porque ela não cabe na tela"; "nada disso foi validado visualmente, o que é uma pena" |
| 05 · a perda | `WasteScales.tsx` | "péssima, muito confuso, números jogados, telas, imagens jogadas" |
| 06 · o aço | `SteelLoop.tsx` | "muita coisa confusa"; "um motion de um quadrado, que não dá pra entender nada"; "uma imagem jogada ali com números, com um espaço vazio imenso" |

### 6 · Dois defeitos confirmados com medição, ainda no ar

- **A seção 04 realmente não cabe em tela baixa.** A 1024×640 a tabela de camadas é cortada pelo topo da janela: a cena tem `h-[62vh]` e a coluna de texto tem headline, parágrafo e seis linhas, o que passa da altura útil do `sticky h-screen`. A 1440×900 cabe, e foi só nessa medida que eu validei. **Lição de processo: validar toda cena pinada em pelo menos 1440×900, 1366×700 e 1024×640.**
- **O contador ainda exibe valor errado.** A 1366×700 flagrei a seção 05 mostrando **"15%"** onde a afirmação é 16%. Eu tinha tratado o problema em parte, mas a figura de reciclagem ainda tem `from`/`to` e passa por 15 no caminho. Numa página cuja tese é precisão numérica, isso é grave. Solução recomendada: **tirar a contagem desta página inteira**. Nenhum número aqui tem "de onde" que carregue argumento (todos saem de zero), ao contrário da home, onde a viagem entre o valor da alvenaria e o do LSF É o argumento.

### 7 · O que NÃO jogar fora na remodelagem

- Toda a apuração e o registro de fontes em `lib/sustentabilidade-data.ts`, com a regra de que nenhum número entra sem `source` e nenhuma fonte fica declarada sem número.
- O bloco **"O que a gente não afirma"**. É o argumento de credibilidade mais forte da página e sobreviveu a todas as revisões.
- As correções de acessibilidade que valem para o site inteiro: `:focus-visible`, `scroll-padding-top` e o offset das âncoras no Lenis.
- Os dois vazamentos de ScrollTrigger corrigidos com `contextSafe`.
- As armadilhas técnicas listadas neste documento.
- As duas ferramentas em `scripts/ui/`.

### 8 · Como atacar quando retomar

1. Fechar a **decisão de cor** com o Bruno antes de qualquer código. É ela que determina se o resto é ajuste ou redesenho.
2. Reescrever o **arco narrativo** primeiro, em texto puro, e só depois desenhar. O pedido dele é de storytelling, e desenhar antes do texto foi o que produziu a "salada de fruta".
3. Decidir quantas seções a página tem. Seis blocos temáticos mais hero e prática é muito para o volume de argumento que sobra sem o eixo de carbono. Menos seções, cada uma com mais respiro, ataca ao mesmo tempo o "denso" e o "espremido".
4. Validar **cada seção visualmente** nas três alturas de tela antes de considerar pronta, com `node scripts/ui/tiras.mjs`.

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

## Apêndice · Prompt para abrir a próxima sessão

Copiar e colar inteiro numa sessão nova, na pasta do projeto.

````text
Vamos remodelar a página /sustentabilidade do site da Berkahn. Ela existe, está
na branch feat/sustentabilidade, e eu reprovei o design. Nada da remodelagem foi
feito ainda.

ANTES DE QUALQUER COISA, leia estes dois arquivos inteiros:
  Berkahn-Vault/00-meta/retomada-sustentabilidade.md
  Berkahn-Vault/20-context/home-redesign-direcao.md  (seções "05 · impacto",
  "/sustentabilidade" e "Auditoria de design e UX")

O primeiro tem o estado, o briefing que eu passei seção por seção, as armadilhas
técnicas que já custaram tempo e os comandos para rodar. Não reconstrua esse
raciocínio, ele está escrito.

ONDE TRABALHAR
Worktree: .worktrees/sustentabilidade, branch feat/sustentabilidade, a partir de
origin/main. NÃO trabalhe na pasta principal do repositório: outra sessão usa ela
e troca de branch. O PR #80 está aberto e verde, sem merge. Não faça merge nem
deploy sem eu pedir.

Dev server:  cd .worktrees/sustentabilidade && npx next dev -p 3113

A DECISÃO QUE VEM ANTES DO CÓDIGO
Eu pedi imagens coloridas no lugar do preto e branco, e sugeri o cinza virando
cor conforme o scroll. Isso atravessa a marca: o grayscale está no guia de design
e a home inteira é assim. Me apresente as três saídas (exceção só nesta página /
cor como recurso narrativo que depois se espalha / revisão da regra mono), com o
custo de cada uma, e ESPERE eu escolher. Não escreva CSS de cor antes disso.

DEPOIS QUE EU ESCOLHER, NESTA ORDEM
1. Reescreva o arco narrativo em texto puro, antes de desenhar. A tese que eu
   quero sentir: a construção convencional, no Brasil e no mundo, é muito
   maléfica para o planeta; a construção a seco traz o braço de sustentabilidade
   de maneira forte; e isso é algo que a Berkahn preserva. Hoje o argumento está
   espalhado em números e não vira narrativa. Me mostre o arco e espere eu
   aprovar.
2. Defina quantas seções a página tem. Hoje são oito e é demais. Menos seção com
   mais respiro ataca ao mesmo tempo o "denso" e o "espremido".
3. Só então mexa em componente.

O QUE SAI DA PÁGINA (decidido, não precisa me perguntar)
- O índice da primeira seção.
- O fundo quadriculado (.fluxograma-grid-bg).
- A numeração de seção no formato "01 · a escala". Parece slide de PowerPoint.
- As réguas de 3px separando seções.
Duas dessas vieram da home e da auditoria, então a remoção abre inconsistência
com a home. Me diga qual e proponha o que fazer.

REGRAS QUE NÃO PODEM SER QUEBRADAS
- NENHUM valor de kgCO2/m2 entra na página. O argumento de carbono do Light
  Steel Frame não se sustenta: o único ACV brasileiro revisado por pares conclui
  a favor da alvenaria no ciclo completo. Ao reescrever para "sustentabilidade
  de maneira forte" você vai sentir a tentação de ressuscitar esse número.
  Não pode. O eixo defensável é o que a obra extrai, desperdiça e deixa para
  trás, e existe fonte primária para cada um.
- Nenhum número entra sem `source` em lib/sustentabilidade-data.ts, e nenhuma
  fonte fica declarada sem estar amarrada a um número.
- Onde a fonte descreve faixa, a tela mostra faixa. Nada de publicar só o topo.
- Voz da marca (Berkahn-Vault/20-context/berkahn-brand.md): sem travessão, sem
  "não é X, é Y", sem tom de manifesto, "Light Steel Frame" por extenso na
  primeira menção, nunca "Steel Frame" sozinho.
- Mantenha o bloco "O que a gente não afirma". É o argumento de credibilidade
  mais forte da página.
- Sem ScrollTrigger.pin: track alto com filho sticky, porque pin briga com o
  Lenis. O estado base do HTML tem que ser o estado FINAL da animação, para a
  página funcionar sem JS e com prefers-reduced-motion.

DOIS DEFEITOS AINDA NO AR, CONFIRMADOS COM MEDIÇÃO
- A seção da parede não cabe a 1024x640: a tabela de camadas é cortada.
- O contador da seção da perda exibe 15% onde a afirmação é 16%. Recomendação:
  tirar a contagem da página inteira, porque nenhum número aqui tem "de onde"
  que carregue argumento.

COMO VALIDAR, E ISSO NÃO É OPCIONAL
Auditar design lendo código não funciona: na última rodada, três dos quatro
defeitos críticos só apareceram em screenshot. Antes de dizer que qualquer seção
está pronta, capture e OLHE:
  node scripts/ui/tiras.mjs ./tiras
  node scripts/ui/medir-secoes.mjs
Valide toda cena com viewport preso em 1440x900, 1366x700 E 1024x640. Foi por
validar só a primeira que a seção da parede passou quebrada.
No medir-secoes, as linhas marcadas "<<< folga" em extracao e parede são pista
de rolagem de sticky, não espaço morto. Não "corrija".

RESPIRO
A home usa 192px de padding nas seções de conteúdo e esta página usa 128px,
porque eu reduzi seguindo a auditoria. Eu achei espremido perto da home. Volte
para o respiro da home e tire gordura cortando seção, não espaçamento.

Comece lendo os dois arquivos e me trazendo a decisão de cor e o arco narrativo.
Não escreva código antes disso.
````

## Relacionados

[[site]] · [[home-redesign-direcao]] · [[berkahn-brand]] · [[steel-frame-domain]]
