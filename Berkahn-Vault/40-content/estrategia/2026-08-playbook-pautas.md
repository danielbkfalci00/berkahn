---
tipo: documentacao
criado: 2026-07-29
atualizado: 2026-07-29
tags:
  - project/blog
  - project/seo-aeo
  - status/active
  - source/manual
  - domain/lsf
ai_summary: "Briefing executável das 22 pautas Core do calendário ago-dez/2026. Cada pauta traz keyword, evidência de demanda, ângulo, dado-âncora, estrutura de H2, componentes interativos, links internos e o que evitar. Serve de entrada direta para /pesquisa e /criacao."
status: active
subtipo: playbook-pautas
periodo_analise: "agosto a dezembro de 2026"
---

# Playbook das pautas Core

Briefing das 22 pautas inegociáveis de [[2026-08-calendario-editorial]]. As 22 de Expansão saem do mesmo processo, com briefing gerado na hora pelo `/pesquisa`.

Cada bloco abaixo é entrada direta para `/pesquisa` → `/criacao` → `/artigo`.

## Regras que valem para todas

- **Máximo 2.500 palavras.** O diagnóstico mostrou que a Berkahn já escreve mais que todos os concorrentes e perde em CTR. Extensão não é o gargalo.
- **Title tag com menos de 60 caracteres, e H1 alinhado à title.** O caso `quanto-custa-construir-...` prova o custo de ignorar isso: rankeia em 1º com o título cortado na SERP.
- **Ano no título só quando a query tem ano.** Em pauta comparativa ou conceitual, ano é ruído e derruba CTR.
- **Toda pauta de custo cita a mesma fonte de preço**, com edição e data explícitas. A contradição atual entre as duas páginas de preço é o pior sinal de qualidade do acervo.
- **Uma seção admitindo limitação por artigo.** O líder da SERP tem "Desvantagens e pontos de atenção"; nenhuma página da Berkahn tem. É o que separa conteúdo de fornecedor de consultoria confiável, e é o que faz uma página ser citada por IA.
- `[FAQ:id]` e `[CTA:id]` obrigatórios. Sem bullets no corpo, exceto FAQ.
- Light Steel Frame por extenso na primeira menção, LSF depois.

### O que faz um artigo ser citado por IA (e o que não faz)

Revisão de evidência 2025-2026 em [[2026-07-diagnostico-editorial]]. Muda o desenho da pauta mais que a escolha da keyword.

**Faça:**
- **Uma afirmação autocontida por seção, com número + unidade + período + fonte nomeada.** "O padrão médio custou entre R$ X e R$ Y por m² em julho de 2026, segundo [fonte], contra R$ Z da alvenaria no mesmo levantamento." Estatísticas, comparações e definições têm o maior uplift medido de citação
- **Fonte primária no corpo visível**: ABNT, Sinduscon, CBIC, SINAPI, IBGE. Não em nota de rodapé
- **Citação direta de pessoa com nome e cargo** foi o método isolado mais forte nos estudos de geração
- **Preço e data explícitos.** Preço mencionado e timestamp recente aparecem como pré-requisitos, não como bônus
- **Linguagem qualificada**: "entre R$ X e R$ Y dependendo de A e B" supera "custa R$ X"
- **Planejar a atualização junto com a publicação.** Toda pauta de custo, preço ou norma entra em ciclo trimestral com `dateModified` real

**Não faça:**
- **Não adicione FAQ nem H2 em forma de pergunta esperando ganho de IA.** As duas medições diretas do efeito são negativas. Continuam obrigatórios porque funcionam no Google e alimentam o `FAQPage` schema, não por AEO
- **Não trate tabela ou schema como garantia de citação.** Nenhuma evidência sustenta. Use pelo leitor humano e pelo rich result
- **Não fragmente o texto em blocos curtos "para a IA".** Otimizar o corpo para geração chega a derrubar a recuperação do documento

---

## S1 · ICMS solar em SP acaba em 31/12 e o Fio B sobe para 75%

**Keyword**: isenção icms energia solar sp 2026 · **Intenção** transacional · **Fundo**

**Por que agora**: janela mais curta do calendário. O Decreto SP 69.827/2024 prorrogou a isenção de ICMS sobre energia compensada até **31/12/2026**, e o Fio B passa de 60% para **75% em 01/01/2027** (Lei 14.300, art. 27). Projeto e homologação de geração distribuída levam meses: publicar em novembro não dá tempo do leitor agir. Publicado em janeiro, vira retrospectiva.

**Ângulo**: a conta lado a lado de quem homologa em 2026 contra quem homologa em 2027, em reais e em anos de payback.

**Estrutura**: o que vence e quando → simulação de payback nos dois cenários → o que precisa estar pronto para homologar ainda em 2026 → por que integrar ao projeto da casa sai mais barato que retrofit → o que ainda é incerto (renovação do ICMS é decisão do próximo governo).

**Componentes**: `[TABLE:]` comparativo 2026 vs 2027, `[CHART:]` payback, `[TIMELINE:]` cronograma do Fio B até 2029.

**Verificar antes**: o decreto no DOE. Três fontes setoriais convergem na data e no número, mas não houve leitura do diário oficial.

**Links**: [[energia-solar-residencial]], [[eficiencia-energetica-reforma-tributaria]]

**Evitar**: prometer que a isenção será renovada. A incerteza é o gancho, não o problema.

---

## S2 · Quanto custa uma casa de 100m² em steel frame

**Keyword**: casa steel frame 100m2 preço · **Transacional** · **Fundo**

**Evidência**: 531 impressões em 90 dias, 27 cliques, e a query aparece também como `casa steel frame 100m2` (24 imp, **zero clique**). Metragem é intenção própria, sem página, e a Berkahn tem a melhor resposta do mercado — os concorrentes do top 5 admitem não calcular por metragem.

**Ângulo**: uma casa concreta de 100m², com composição por etapa, não faixa genérica.

**Estrutura**: a resposta em número logo na abertura (regra ski ramp) → o que está e o que não está incluso → composição por etapa em % e em R$ → o que faz variar para cima e para baixo → comparação honesta com alvenaria na mesma metragem → prazo → desvantagens e pontos de atenção.

**Componentes**: `[STATS:]`, `[TABLE:]` composição por etapa, `[CALCULATOR:]` se houver, `[FAQ:]`.

**Nota estratégica**: esta pauta é o destino natural da página canibalizada. Ver Bloco 1 do saneamento — a decisão é **reposicionar** `quanto-custa-construir-...` para metragem, não redirecionar.

**Links**: [[custo-steel-frame-m2-2026]], [[financiar-construcao-light-steel-frame]]

---

## S3 · Steel frame é mais barato que alvenaria? A conta completa

**Keyword**: steel frame é mais barato que alvenaria · **Comparativa** · **Meio**

**Evidência**: 616 impressões e 17 cliques, sendo atendida hoje pela página de custo por m², que é a página errada. Somando variantes (`casa de steel frame é mais barata`, `light steel frame é mais barato que alvenaria`, `steel frame é mais caro que alvenaria`), passa de **740 impressões sem página dedicada**. Os quatro vencedores da SERP usam formato pergunta e **nenhum usa ano**.

**Ângulo**: a resposta honesta é "depende de quando você para de contar". Custo inicial, custo de obra com prazo, e custo em 10 anos dão três respostas diferentes.

**Estrutura**: resposta direta na abertura → custo inicial (onde alvenaria ganha) → custo de obra incluindo prazo e canteiro → custo em 10 anos com energia e manutenção → quando alvenaria é de fato a escolha certa → o que muda a conta no seu caso.

**Componentes**: `[COMPARISON3D:]` ou `[TABLE:]`, `[CHART:]` custo acumulado ao longo de 10 anos.

**Title**: sem ano. É query conceitual e atemporal.

**Links**: [[custo-steel-frame-m2-2026]], [[steel-frame-vs-alvenaria]]

---

## S4 · Aprovar projeto em São Paulo mudou: autodeclaração em 30 dias

**Keyword**: aprovar projeto prefeitura sp steel frame · **Informacional** · **Meio**

**Por que agora**: a pauta mais inédita do calendário. **Lei municipal 18.375/2025** (29/12/2025) criou a emissão declaratória eletrônica; o **Decreto 65.100/2026** (15/04/2026) a regulamentou, com vigência ~14/06/2026. Escopo: edificações até 1.500 m² em lotes até 20.000 m², prazo máximo de 30 dias. Casa em LSF cabe folgado. Vigente há poucas semanas e ainda mal coberta.

**Ângulo**: o que muda na prática para quem vai construir, e o que o novo rito exige de responsabilidade técnica.

**Estrutura**: o que mudou → quem se enquadra e quem não → o passo a passo → o que a autodeclaração transfere de risco para o responsável técnico → prazos e o que acontece em caso de irregularidade (12 meses de impedimento) → a contestação da SEAM ao MP-SP.

**Incluir a contestação** dá equilíbrio e é o detalhe que nenhum concorrente tem.

**Componentes**: `[TIMELINE:]` do fluxo, `[CHECKLIST:]` de documentos.

**Evitar**: `NormsSection` — o título dele é fixo em "Normas e Certificações" e não serve para lei municipal.

---

## S5 · Pode pendurar TV na parede de steel frame?

**Keyword**: pendurar tv parede steel frame · **Objeção** · **Fundo**

**Evidência**: a SERP é grande, mas ~85% dela é sobre drywall genérico. Só um resultado cruza drywall com steel frame. Volume alto emprestado do tema vizinho, concorrência fraca no recorte LSF.

**Ângulo**: derrubar o mito com número. A resposta é carga por tipo de fixação, não "pode" ou "não pode".

**Estrutura**: resposta direta com a carga máxima → por que a dúvida existe → fixação em montante, em reforço e em bucha específica, com carga de cada → o que fazer quando o projeto já prevê (bancada, TV, armário de cozinha) → o que fazer quando não previu → comparação com alvenaria.

**Componentes**: `[TABLE:]` carga por tipo de fixação, `[IMAGE:]` corte da parede, `[MYTHS:]`.

**Links**: [[anatomia-parede-steel-frame]], [[drywall-st-ru-rf]]

---

## S6 · Caixa financia steel frame? O que mudou com o novo MCMV

**Keyword**: caixa financia steel frame · **Transacional** · **Fundo**

**Evidência**: `financiar-construcao-light-steel-frame` tem 5.316 impressões e 40 cliques — **CTR 0,75%, a pior relação do acervo**. Na SERP, o primeiro colocado lidera com "Financiamento Caixa" nas duas primeiras palavras; o título da Berkahn é o mais genérico do conjunto. Queries de financiamento somam 85 impressões e **zero clique**.

**Decisão**: isto é **refresh do artigo existente**, não artigo novo. Criar um terceiro slug de financiamento pioraria a canibalização que já existe entre dois.

**Atualizar com**: Portaria MCID 333 (abr/2026) — Faixa 4 vai a R$ 13.000 de renda e imóvel até R$ 600 mil, que é exatamente a faixa de casa térrea em LSF no interior de SP. Teto SFH em R$ 2,25 milhões. Taxas de 2026, sempre datadas. FGTS Futuro (Faixa 1).

**Title**: precisa conter "Caixa".

**Verificar antes**: condições e taxa na página de Construção da Caixa. Taxa muda e datar é obrigatório.

---

## S7 · Telhado em steel frame: tipos, execução e preço por m²

**Keyword**: telhado steel frame preço m2 · **Transacional** · **Meio**

**Evidência**: **163 impressões, zero clique, posição 5,9.** Somada a `cobertura steel frame preço m2` (31 imp), é a maior lacuna com demanda medida do acervo. Não existe nenhum artigo de cobertura. A concorrência é fraca: o primeiro colocado é um Google Sites de loja de gesso.

**Ângulo**: o telhado é onde mais se erra orçamento em obra industrializada, e a pauta responde com preço.

**Estrutura**: resposta de preço na abertura → tesoura metálica vs estrutura de madeira → tipos de telha e o que cada uma pede da estrutura → laje impermeabilizada como alternativa → preço por m² por combinação → erros comuns → manutenção.

**Componentes**: `[TABLE:]` preço por sistema, `[IMAGE:]` corte, `[FAQ:]`.

**Links**: [[anatomia-parede-steel-frame]], [[steel-frame-laje-de-concreto]]

---

## S8 · Banheiro em steel frame: como se impermeabiliza área molhada

**Keyword**: impermeabilização banheiro steel frame · **Objeção** · **Meio**

**Evidência**: a SERP é inteiramente sequestrada por alvenaria (fabricantes de impermeabilizante, NBR 9575). **Zero conteúdo LSF-específico rankeando.** A dúvida existe ("vai mofar") e a resposta não existe.

**Ângulo**: mostrar as camadas. É pauta visual, não textual.

**Estrutura**: resposta direta → por que a dúvida faz sentido → camada por camada numa parede de área molhada (placa cimentícia, membrana, rejunte, rodapé) → o encontro piso-parede, que é onde falha → o que a NBR 9575 exige → o que exigir do seu construtor → o que acontece quando é mal executado.

**Componentes**: `[IMAGE:]` ou `[BEFOREAFTER:]` das camadas, `[CHECKLIST:]` de execução.

**Links**: [[anatomia-parede-steel-frame]], [[patologias-steel-frame]], [[fissuras-steel-frame]]

---

## S9 · Casa de 70m² em steel frame

**Keyword**: casa steel frame 70m2 · **Transacional** · **Fundo**

**Evidência**: 36 impressões, zero clique, posição 6,7. Menor volume que a de 100m², mas mesma intenção não atendida e complementa o cluster de metragem.

**Ângulo**: projeto compacto não é projeto pobre. Onde o custo por m² sobe em metragem pequena e por quê.

**Estrutura**: preço na abertura → por que o m² é mais caro em área pequena (banheiro e cozinha não encolhem proporcionalmente) → o que priorizar → planta que funciona em 70m² → prazo.

**Links**: pauta de 100m² (S2), [[custo-steel-frame-m2-2026]]

---

## S10 · Cronograma real de uma obra, semana a semana

**Keyword**: quanto tempo constrói casa steel frame · **Informacional** · **Meio**

**Evidência**: query concorrida, e **todos os concorrentes dão faixas vagas** ("de 4 a 6 meses"). Nenhum publica cronograma real.

**Ângulo**: diferencial impossível de copiar. Obra real da Berkahn, com fotos datadas, semana a semana.

**Estrutura**: prazo total na abertura → semana a semana por etapa → onde a obra a seco realmente ganha tempo e onde não ganha → o que atrasa de verdade (projeto e aprovação, não montagem) → como o cronograma muda por metragem.

**Componentes**: `[TIMELINE:]` é o componente central desta pauta, `[GALLERY:]` com fotos datadas.

**Depende de**: fotos de obra com data. Se não houver, a pauta perde o diferencial e vira mais uma faixa vaga.

---

## S11 · Casa de steel frame valoriza? Revenda e avaliação bancária

**Keyword**: casa steel frame valoriza revenda · **Objeção** · **Fundo**

**Evidência**: objeção financeira terminal, a última que trava a assinatura. As respostas atuais são autopromocionais e se contradizem — um diz que valoriza mais, outro que empata com alvenaria.

**Ângulo**: honestidade. O que determina avaliação é laudo, matrícula e localização, não o sistema construtivo.

**Estrutura**: resposta direta → como o banco avalia (e por que a NBR 16970 mudou isso) → o que entra na matrícula → o que compradores perguntam na revenda → o que de fato deprecia → onde o LSF tem vantagem (eficiência energética documentada tende a pesar mais com a etiquetagem de 2028).

**Distinguir** do artigo de financiamento: aquele é sobre comprar, este é sobre revender e ser avaliado.

**Links**: [[financiar-construcao-light-steel-frame]], [[normas-light-steel-frame-brasil]]

---

## S12 · Fundação radier: execução, espessura e preço

**Keyword**: fundação radier steel frame preço · **Transacional** · **Meio**

**Evidência**: `fundacao-steel-frame-vs-alvenaria` tem 1.539 impressões e CTR 0,97%, e **a palavra "radier" não está no título nem na URL** — que é justamente o que a query pede. Existem dois slugs de fundação disputando.

**Decisão**: refresh de `fundacao-steel-frame` absorvendo "radier" no título, não artigo novo. Ver Bloco 1 do saneamento.

**Ângulo**: radier não é economia, é engenharia. 250 kg/m² contra 1.250 da alvenaria muda o que a fundação precisa ser.

**Estrutura**: o que é e quando se usa → espessura e armadura por tipo de solo → quando NÃO usar radier (NSPT baixo) → preço por m² → tolerância de execução (erro acima de 5 mm compromete o encaixe da estrutura) → o que exigir da sondagem.

**Links**: [[fundacao-steel-frame-vs-alvenaria]], [[hold-downs-ancoragens]]

---

## S13 · Desvantagens reais do steel frame

**Keyword**: desvantagens steel frame · **Objeção** · **Fundo**

**Evidência**: quem domina hoje é um blog técnico independente e o **Reclame Aqui**, inclusive com caso de obra parada rankeando. Tráfego de fundo de funil puríssimo, de quem está a um passo de desistir.

**Ângulo**: alto risco, alto retorno. Só funciona se for genuinamente honesto — custo inicial maior, mão de obra escassa, limitação para reforma futura, necessidade de projeto fechado antes de começar.

**Estrutura**: as desvantagens reais, uma por uma, sem contraponto imediato → depois, o que é mito e não desvantagem → o que a Berkahn faz para mitigar cada uma → quando não recomendamos LSF.

**Nota**: o dado do diagnóstico é que **praticamente todo problema relatado com LSF é erro de execução, não do sistema**. Esse é o eixo do artigo, e conecta direto com o checklist da S15.

**Evitar**: transformar em peça de venda disfarçada. O leitor detecta e o artigo perde o único ativo que tem.

---

## S14 · Fachada: EIFS, placa cimentícia e siding lado a lado

**Keyword**: revestimento externo steel frame · **Transacional** · **Meio**

**Evidência**: cobertura fragmentada e comercial. As páginas existentes são de produto, não comparativos honestos. Não existe comparativo com custo por m² e manutenção por sistema.

**Ângulo**: os três sistemas com preço, manutenção e vida útil lado a lado.

**Estrutura**: os três em uma tabela logo no início → EIFS (quando compensa, onde falha) → placa cimentícia → siding → custo por m² instalado → manutenção em 10 anos → qual escolher por tipo de projeto e clima.

**Cortar o ACM**: a SERP de fachada ACM é comunicação visual, não construção.

**Componentes**: `[TABLE:]`, `[GALLERY:]`, `[COMPARISON3D:]`.

---

## S15 · Checklist de 20 pontos para fiscalizar sua obra

**Keyword**: como fiscalizar obra steel frame · **Informacional** · **Fundo**

**Ângulo**: conteúdo que só uma construtora pode escrever com credibilidade. Captura quem já contratou ou está escolhendo entre orçamentos, e posiciona a Berkahn como a que não tem o que esconder.

**Estrutura**: por etapa (fundação, montagem, fechamento, instalações, acabamento), o que olhar e o que é sinal de problema → o que fotografar e quando → o que pedir por escrito → quando chamar um terceiro.

**Componentes**: `[CHECKLIST:]` é a peça central, `[RESOURCES:]` para versão baixável.

**Cuidado**: `ResourceDownload` só deve ser usado se o backend de captura estiver funcionando e segmentar a origem. Hoje o formulário de download enviaria ao mesmo destino do formulário comercial, poluindo a planilha de vendas. Sem isso resolvido, publicar sem o componente.

---

## S16 · Instalações elétricas e hidráulicas no steel frame

**Keyword**: instalação elétrica hidráulica steel frame · **Informacional** · **Meio**

**Evidência**: 7 resultados dedicados na SERP, todos rasos, nenhum com foto de execução real nem tratamento de manutenção futura.

**Ângulo**: a pergunta real não é "como passa", é "e se eu precisar mexer depois?".

**Estrutura**: como passa por dentro do perfil → furação: o que a norma permite e o que compromete a estrutura → PEX e o que muda em relação ao PVC embutido em alvenaria → shafts e pontos de manutenção → como se faz uma alteração depois de pronto → o que exigir do projeto.

**Componentes**: `[IMAGE:]` de execução real, `[FAQ:]`.

---

## S17 · Construtora de steel frame em São Paulo: como escolher

**Keyword**: construtora steel frame sp · **Transacional** · **Fundo**

**Evidência**: a query comercial mais valiosa do conjunto, e a **Berkahn não aparece**. Intenção local tem CTR de 4,72%, contra 1,96% das genéricas.

**Ressalva decisiva**: **nenhum vencedor dessa SERP rankeia com artigo de blog.** São homepages e páginas de serviço geolocalizadas. Um concorrente ocupa 4 posições com um cluster de páginas comerciais.

Logo, este artigo **não vai rankear para a query principal** e não deve ser cobrado por isso. Ele serve para capturar a cauda ("como escolher construtora", "o que perguntar") e para linkar internamente para a página comercial. **A solução real é o Bloco 4 do saneamento**: página de serviço fora de `/atualidades` + Google Business.

**Ângulo**: critérios verificáveis, não adjetivos. O que pedir, o que conferir, que documento exigir.

---

## S18 · Subir um andar sobre a laje existente

**Keyword**: segundo andar steel frame sobre alvenaria · **Transacional** · **Fundo**

**Evidência**: artigos dedicados, vídeos no YouTube e página de descoberta no TikTok — sinal social forte. O primeiro colocado da SERP é um Google Sites. Lead com projeto definido e orçamento na mão.

**Ângulo**: é a aplicação onde a leveza do LSF deixa de ser argumento de marketing e vira viabilidade. Alvenaria muitas vezes não pode subir; LSF pode.

**Estrutura**: por que dá para subir com LSF e não com alvenaria (250 kg/m² vs 1.250) → o que precisa ser verificado na estrutura existente → laudo estrutural obrigatório → como se vincula a estrutura nova à existente → prazo e custo → aprovação (conecta com a S4) → quando não dá.

**Componentes**: `[STATS:]` comparativo de carga, `[GALLERY:]`, `[CHECKLIST:]` de viabilidade.

---

## S19 · O preço do steel frame de 2023 a 2026

**Keyword**: steel frame valor m2 2023 · **Informacional** · **Meio**

**Evidência**: o achado mais contraintuitivo do diagnóstico. Queries com **"2023"** somam **682 impressões e 1 clique** (`steel frame valor m2 2023`: 357 imp / 0 clique; `steel frame preço m2 2023`: 325 imp / 1 clique). As pessoas buscam pelo ano antigo e o artigo grita 2026, então não reconhecem a resposta.

**Ângulo**: a série histórica que nenhum concorrente publica. O índice de referência do mercado é mensal e **não declara metodologia** — publicar com metodologia aberta cria argumento superior.

**Decisão de formato**: bloco de série histórica **dentro da página-mãe de custo**, mais um artigo que a referencie. Não criar terceira página de preço.

**Estrutura**: a série ano a ano → o que puxou o preço em cada período (aço, mão de obra, câmbio) → como o LSF se comportou contra alvenaria no mesmo intervalo → metodologia declarada → o que esperar para 2027.

**Componentes**: `[CHART:]` linha da série é a peça central, `[TABLE:]`.

**Ambição**: este é o embrião de um índice próprio, mensal e com metodologia aberta. É o ativo que nenhum artigo avulso replica e que gera backlink.

---

## S20 · Laje em steel frame: seca, mista ou steel deck

**Keyword**: laje steel frame preço · **Transacional** · **Meio**

**Evidência**: 44 impressões e zero clique. O artigo `steel-frame-laje-de-concreto` existe e cobre os tipos, mas **não traz preço** — que é o que a query pede.

**Decisão**: refresh do artigo existente com bloco de custo, não artigo novo.

**Estrutura**: preço por tipo logo no início → os três sistemas → vão livres e limitações → acústica de entrepiso (conecta com a pauta de Expansão da S12) → quando cada uma compensa.

**Links**: [[steel-frame-laje-de-concreto]], [[anatomia-parede-steel-frame]]

---

## S21 · Vale a pena começar a obra em 2027?

**Keyword**: construir 2027 vale a pena · **Informacional** · **Meio**

**Por que agora**: fecha o ano amarrando as janelas regulatórias. Em 01/01/2027 o PIS/Cofins é extinto e a CBS entra cheia; o Fio B vai a 75%; o ICMS solar de SP pode não ser renovado; a nova PGV do IPTU já está valendo.

**Ângulo**: cenário de custo do próximo ano, com o que é certo e o que é incerto separados.

**Estrutura**: o que muda com data confirmada → o que é estimativa → o efeito combinado no custo de uma obra típica → o que antecipar ainda em 2026 → o que não vale antecipar.

**Cuidado**: a alíquota de referência de 26,5% do IVA é **estimativa**, fixada por resolução do Senado, não lei. Não apresentar como número definitivo. O regime específico de bens imóveis reduz em 50% as alíquotas, mas o **redutor de ajuste não alcança serviços de construção por empreitada** — que é o modelo da Berkahn. Confirmar os artigos da LC 214/2025 no texto legal antes de citar número de artigo.

---

## Pautas que exigem decisão antes de escrever

| Pauta | Bloqueio |
|---|---|
| ~~S2, S3, S19 e qualquer pauta de custo~~ | ✅ **Destravado em 2026-07-30.** A faixa canônica é **R$ 3.015 a R$ 6.091/m²** (Sudeste), que o corpo do artigo e os componentes já usavam. Toda pauta de custo cita esta faixa e nenhuma outra |
| S10 (cronograma) | Depende de fotos de obra datadas. Sem elas, vira mais uma faixa vaga |
| S15 (checklist) | O `ResourceDownload` só entra se o backend segmentar a origem do lead |
| S17 (construtora SP) | Só faz sentido junto com a página comercial do Bloco 4 |
| S6, S12, S20 | São **refresh**, não artigo novo. Criar slug novo aumenta a canibalização |

---

**Relacionado**: [[2026-08-calendario-editorial]] · [[2026-07-diagnostico-editorial]]

**Contexto aplicado**: [[berkahn-brand]] · [[seo-aeo-strategy]] · [[article-pipeline]] · [[copy-sem-travessao]] · [[steel-frame-domain]]
