---
tipo: documentacao
criado: 2026-09-22
atualizado: 2026-09-22
tags:
  - project/blog
  - project/linkedin
  - status/active
  - source/manual
ai_summary: "Contrato de fronteiras das cinco solicitações dos sócios de 16/09/2026: fachada, instalações hidráulicas e elétricas, projeto integrado, automação e sistemas prediais internacionais. Os cinco são artigo novo, nenhum reposicionamento. Registra o que cada peça possui com exclusividade e o que ela não pode tocar, porque 19 drafts e 44 publicados já ocupam territórios vizinhos."
status: active
projeto: blog
contextos_aplicados:
  - seo-aeo-strategy
  - article-pipeline
projetos_relacionados:
  - blog
  - linkedin
---

# Cinco solicitações dos sócios — fronteiras vinculantes

Bruno confirmou a ordem em 22/09/2026: fachadas a seco, hidráulica, projeto
integrado, automação residencial, instalações internacionais. As cinco pautas já
existiam no quadro desde 16/09; nenhuma foi criada por este run.

Esta nota carrega só o que precisa sobreviver até a publicação. O julgamento
completo de cada recorte fica no bloco **Pesquisa** do card correspondente.

## Veredito de canibalização

Os cinco slugs candidatos foram conferidos contra a tabela `posts` em 22/09 e
**nenhum existe**. Os cinco são artigo novo. Nenhum precisa de `--usar-existente`
e nenhum entra na revisão staged da migration 030.

| # | Pauta | id | Slug | Veredito |
|---|---|---|---|---|
| 1 | Fachada em steel frame | `777926d7` | `revestimento-externo-steel-frame` | artigo novo |
| 2 | Instalações elétricas e hidráulicas | `f4d25753` | `instalacoes-hidraulicas-eletricas-steel-frame` | artigo novo |
| 3 | Projeto integrado | `67715d77` | `projeto-integrado-light-steel-frame` | artigo novo |
| 4 | Automação residencial | `159d3128` | `automacao-residencial-projeto` | artigo novo |
| 5 | Instalações internacionais | `0820e59d` | `instalacoes-prediais-alto-padrao` | artigo novo |

## A página que ninguém encosta

`custo-steel-frame-m2-2026` levou **180 dos 292 cliques** e 5.972 das 11.296
impressões da janela de setembro, em posição 3,6. É 62% do clique do blog inteiro.

Nenhuma das cinco peças disputa "quanto custa construir", "preço por m²" ou
"custo steel frame". A pauta 1 tem preço no título e isso é permitido apenas
porque o denominador é **m² de fachada**, não m² de área construída. Sempre que o
texto precisar do custo da casa, ele linka para lá e não recalcula.

## Território exclusivo, peça por peça

### 1. `revestimento-externo-steel-frame`

**Possui**: a escolha do sistema de fachada como decisão de projeto. EIFS, placa
cimentícia com acabamento, siding, fachada ventilada e painel metálico ou ACM
comparados pelos eixos que a SERP não cruza: água e vapor, fogo, impacto, juntas,
manutenção, estética e disponibilidade no Brasil. Separa as três camadas que o
mercado funde, que são revestimento, substrato e sistema de fachada. Preço por m²
de fachada.

**Não toca**: camadas internas da parede (`anatomia-parede-steel-frame`, 697
impressões em posição 7); telhado, beiral e inclinação (draft
`telhado-steel-frame-tipos-custo-m2`); corrosão do aço exposto e maresia (draft
`steel-frame-litoral-maresia`, dono da conta Z275/Z350 e da ISO 9223); mecanismo
de fissura (`fissuras-steel-frame`); patologia consumada (`patologias-steel-frame`);
área molhada (draft `impermeabilizacao-banheiro-steel-frame`); revestimento interno
(`drywall-st-ru-rf`, `drywall-ou-alvenaria`); custo da casa.

**Sem ranking universal.** A pauta exige que nenhum sistema saia eleito fora do
clima e do detalhe executivo.

### 2. `instalacoes-hidraulicas-eletricas-steel-frame`

**Possui**: como elétrica e hidráulica atravessam perfis e paredes, projetadas
para a manutenção futura. Perfuração de perfil e seus limites, proteção do tubo
na passagem, distribuição por manifold, PEX, shaft e ponto de acesso, teste de
estanqueidade, eletroduto e caixa em parede seca.

**Eixo hidráulico lidera**, porque foi o pedido dos sócios, mas a peça é uma só e
cobre os dois, que é o que o card diz.

**Não toca**: a barreira de área molhada (draft
`impermeabilizacao-banheiro-steel-frame`, dono da NBR 16970-3 em área molhada e do
Guia IBI); o calendário de manutenção e a NBR 5674 (draft
`manutencao-casa-steel-frame`); carga e fixação em parede (draft
`pendurar-tv-parede-steel-frame`, dono dos DATec 14 e 15 e da regra Abragesso);
inventário normativo (draft `normas-light-steel-frame-brasil`); camadas da parede
(`anatomia-parede-steel-frame`).

**PEX e manifold são hipótese, não recomendação.** O card manda separar inovação
comprovada de produto novo sem rede de assistência no Brasil. Se a pesquisa não
sustentar, o texto diz isso.

### 3. `projeto-integrado-light-steel-frame`

**Possui**: o que precisa estar fechado antes da obra e o que custa mudar tarde.
Compatibilização entre arquitetura, estrutura, instalações e fabricação. BIM e
DfMA como redução de improviso. O ponto de congelamento do projeto.

**A tese exclusiva a perseguir**: em Light Steel Frame o projeto congela mais cedo
do que em alvenaria, porque o painel vira ordem de fabricação. Quem trata o LSF
com o calendário de decisão da alvenaria descobre isso pelo aditivo.

**Não toca**: preço de projeto (`quanto-custa-projeto-casa`, 263 impressões — o
card proíbe explicitamente); rito de aprovação na prefeitura (draft
`aprovar-projeto-prefeitura-sp`, dono da Lei 18.375/2025 e do Licencia Sampa — o
card também proíbe); passo a passo de obra (`passo-passo-construcao-steel-frame`);
a decisão painelizado contra stick (`sistema-painelizado-vs-stick-steel-frame`,
que entra como premissa citada porque o ponto de congelamento depende dela, nunca
como comparativo refeito); lista de custos ocultos (`custos-ocultos-construcao-2026`).

### 4. `automacao-residencial-projeto`

**Possui**: a infraestrutura que precisa ser decidida antes de fechar a parede.
Quadro, eletroduto, cabeamento, ponto de sensor, reserva de espaço e caminho de
passagem, organizados por decisão de projeto e nunca por marca ou gadget.

**Não toca**: luminotécnica e projeto de iluminação (`iluminacao-led-residencial`,
dono de "a luz da sua casa começa na planta"); geração solar
(`energia-solar-residencial`); fixação de TV e carga em parede (draft
`pendurar-tv-parede-steel-frame`); etiqueta ENCE (pauta `181cfeae`).

**O risco desta peça é virar conteúdo genérico de automação**, que existe aos
milhares e não tem nada da Berkahn. O recorte LSF é a compatibilização e o caminho
de passagem dentro da parede seca. E o card cobra a honestidade inversa: o sistema
construtivo **não** conserta automação mal projetada, e o texto precisa dizer isso.

### 5. `instalacoes-prediais-alto-padrao`

**Possui**: sistemas prediais consolidados em residência de alto desempenho no
exterior e o julgamento de quais já fazem sentido técnico e comercial no Brasil.
Ventilação mecânica com recuperação de calor ou energia, bomba de calor, VRF,
climatização radiante, renovação e qualidade do ar. Para cada um: benefício, clima
adequado, infraestrutura exigida, disponibilidade e manutenção aqui.

**A tese exclusiva a perseguir**: boa parte desses sistemas é resposta a um clima
dominado por aquecimento, e o brasileiro não é. O que se importa de fora precisa
passar pelo filtro do clima antes do filtro do preço.

**Não toca**: o panorama do LSF como sistema construtivo no exterior
(`steel-frame-no-mundo`, 144 impressões em posição 5,4 — dono de EUA, Japão,
Austrália e Reino Unido); transmitância, capacidade térmica e a objeção "steel
frame esquenta" (draft `steel-frame-esquenta-conforto-termico`, dono dos 0,70
contra 2,48 W/m².K e dos 42 contra 130 kJ/m².K); isolamento
(`isolamento-termico-acustico-steel-frame`); solar
(`energia-solar-residencial`); certificação (`certificacoes-steel-frame`);
etiquetagem (`eficiencia-energetica-reforma-tributaria` e pauta `181cfeae`).

**Colisão futura registrada**: a pauta `543ac6b4`, "Casa de 200m² ou mais: o que
muda no alto padrão", divide a família de keyword `casa alto padrão`. Ela é dona
do programa e da metragem; esta é dona dos sistemas. Quando `543ac6b4` for
escrita, esta nota é a referência.

## O furo no montante: duas grandezas que o lote confundiu

Arbitrado em 22/09/2026, depois que a verificação cruzada achou os drafts 2 e 4
dizendo coisas incompatíveis, ambos citando a ABNT NBR 15253. **Não existe teto
único.** São duas grandezas distintas e não concorrentes, e cada draft tinha uma:

| | O que é | Valores | Fonte |
|---|---|---|---|
| **A** | Geometria de furação de fábrica, sem reforço | redondo até 38 mm de diâmetro, oblongo até 115 mm de comprimento, 600 mm entre centros, 300 mm da extremidade ao primeiro furo | figura da NBR 15253 reproduzida em Santiago, Freitas e Crasto, *Steel Framing: Arquitetura*, CBCA, 2012, cap. 8 |
| **B** | Teto com reforço | chapa parafusada, 25 mm além das bordas; até 75% da altura da alma e 152 mm de comprimento | mesmo manual, cap. 4 |
| **C** | Faixa de validade do **método de cálculo** | largura ≤ 63,5 mm, comprimento ≤ 114 mm, razão ≤ 0,5, centros ≥ 610 mm | item B2.2 da AISI S100-12, invocado pelo exemplo 6.6 de *Steel Framing: Engenharia*, CBCA, 2016 |

O que provou que A e C convivem: o próprio exemplo 6.6 calcula um furo de
**38 x 110 mm**, ou seja, um furo na geometria de A, e só então confere que
38/89,964 = 0,42 < 0,5. O 38 é dado de entrada; o 63,5 é limite do método.

**O erro que isso evitou.** O draft de instalações publicava C como se fosse o
teto de furação sem reforço, ou seja, um limite **67% mais largo que o real**,
apresentado como norma, num artigo sobre como a tubulação atravessa a estrutura.
O mesmo parágrafo se contradizia: dizia que metade da alma de 90 mm dá 45 mm e
concluía que o teto "continua sendo aquele 63,5 mm".

**Como citar.** Sempre "a figura de furação da ABNT NBR 15253 reproduzida no
manual do CBCA", nunca "a NBR 15253 limita o furo a 38 mm". O documento da ABNT
é comercializado e não foi lido em nenhuma edição. Os 38 e os 115 aparecem em
texto apenas no manual de 2012, cuja cadeia é a edição de 2005.

**Derivação que ficou fora dos artigos, por decisão.** Cruzando A e C, um furo
oblongo no máximo da furação (115 mm) fica 1 mm além do Lh ≤ 114 mm da AISI, e os
600 mm entre centros ficam abaixo dos 610 mm da mesma AISI. Furar exatamente nos
máximos pode tirar o perfil da faixa em que o método vale. É aritmética sobre dois
limites publicados, não afirmação de nenhuma das fontes. Se entrar algum dia, o
lugar é `instalacoes-hidraulicas-eletricas-steel-frame`, e precisa dizer que é
derivação.

## Capas: quatro saíram de foto real

Decidido em 22/09 depois de catalogar as 41 fotos de `obra-carrossel` uma a uma,
o que nunca tinha sido feito. O catálogo ficou em [[indices-obras-projetos]].

| Pauta | Blog 1200x800 | LinkedIn 1080x1350 |
|---|---|---|
| `revestimento-externo-steel-frame` | `obra-carrossel-08` | `obra-carrossel-18` |
| `instalacoes-hidraulicas-eletricas-steel-frame` | `obra-carrossel-23` | `obra-carrossel-23` |
| `projeto-integrado-light-steel-frame` | **gerada** | **gerada** |
| `automacao-residencial-projeto` | `obra-carrossel-28` | `obra-carrossel-28` |
| `instalacoes-prediais-alto-padrao` | `obra-carrossel-30` | `obra-carrossel-30` |

As oito já estão no card. **A regra do processo muda**: consultar o banco de
imagens antes de escrever o prompt, porque foto real ganha quando existe. Só
`projeto-integrado` precisa de geração; nenhuma das 41 tem resolução de capa para
ela.

Ressalva de direito de imagem, registrada no índice: `32` tem rosto identificável
e está descartada, `27` tem placa de veículo, e seis arquivos têm marca de
terceiro em embalagem. Nenhuma das escolhidas tem esses problemas.

## Links entre peças do próprio lote

Dois drafts linkavam para irmãos deste lote, que dariam 404 se a peça de destino
não subisse primeiro. Os dois links saíram do corpo e o crédito ficou em prosa:

- `automacao-residencial-projeto` → `instalacoes-hidraulicas-eletricas-steel-frame`
- `instalacoes-prediais-alto-padrao` → `projeto-integrado-light-steel-frame`

Depois que `f4d25753` e `67715d77` estiverem publicadas, os dois links voltam.

## Ordem de publicação

A ordem do Bruno vale para produção. A publicação segue o calendário editorial,
que já tem `777926d7` em S14 (02/11) e `f4d25753` em S16 (16/11). As três pautas
novas de 16/09 não têm `data_alvo` e entram na fila sem furar as datadas.

## Pendências

- [ ] @bruno Gerar as cinco capas a partir dos cenários de cada card e mandar os arquivos #pendencia
- [ ] @bruno Publicar no LinkedIn com a UTM entregue e registrar URL e data reais #pendencia
- [ ] @bruno Solicitar indexação no Search Console de cada URL publicada deste lote #pendencia

Contexto aplicado: [[seo-aeo-strategy]], [[article-pipeline]], [[berkahn-brand]].
Lote anterior: [[2026-09-lote-20-fronteiras]].
