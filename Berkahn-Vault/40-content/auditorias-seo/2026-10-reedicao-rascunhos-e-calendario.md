---
tipo: auditoria
criado: 2026-10-20
atualizado: 2026-10-20
tags:
  - project/blog
  - project/seo-aeo
  - domain/seo
  - status/active
  - source/manual
ai_summary: "Registro da reedição dos rascunhos do blog em 20/10/2026 pelo prompt blog-criacao v1.1. Doze rascunhos cortados de 1.500 a 2.200 para 950 a 1.600 palavras, uma mescla (vida útil com manutenção), uma atualização staged de artigo publicado (quanto-custa-projeto-casa, de 100 para 250 m²), uma correção pronta mas sem pauta de blog (anatomia-parede, carga suspensa), um descarte (casa de 70 m²) e um bloqueio (cronograma real, sem dados de obra). Calendário refeito de 26/10/2026 a 15/02/2027, duas pautas por semana."
status: active
projeto: blog
projetos_relacionados:
  - blog
  - seo-aeo
---

# Reedição dos rascunhos e novo calendário (20/10/2026)

Decorre de [[2026-10-diagnostico-queda-trafego]] e das regras novas do prompt [[blog-criacao]] (v1.1, registrada em [[prompts-calibrados]]): resposta nos dois primeiros parágrafos, parágrafos curtos, tabela por artigo, público de médio e grande porte (ticket R$ 500 mil a R$ 2 milhões, sem casa de 70 ou 100 m²).

Contagens de palavras medem só o corpo do artigo, sem a seção de especificações técnicas.

## Rascunhos cortados

| Rascunho | Antes | Depois | O que mudou além do corte |
|---|---|---|---|
| telhado-steel-frame-tipos-custo-m2 | 1.703 | 1.094 | nada de conteúdo, só corte de contexto |
| casa-steel-frame-valoriza-revenda | 2.059 | 1.189 | exemplo de 100 para 250 m², valores escalados por 2,5 (a área entra multiplicando na fórmula do VEIU) |
| aprovar-projeto-prefeitura-sp | 1.477 | 948 | multa exemplificada em 300 m². Escopo do Licencia Sampa para casa isolada (R1) segue sem confirmação oficial |
| entrada-financiamento-construcao | 2.075 | 1.447 | caso refeito para obra de 250 m² (R$ 557.843, financiamento R$ 446.274, registro na faixa m da Tabela II da ARISP, R$ 3.324,04, conferido no PDF oficial). Caixa próprio mediano R$ 101.700 (18%) |
| steel-frame-esquenta-conforto-termico | 1.707 | 1.062 | cortada a subseção histórica da NBR 15220-3 de 2005 |
| vida-util-casa-steel-frame | 1.870 | 1.507 | mesclado com manutenção-casa-steel-frame (2.154), que ficou arquivado |
| steel-frame-comercial-loja-escritorio | 2.170 | 1.233 | base numérica é de ponto pequeno, prioridade baixa |
| galpao-steel-frame-ou-estrutura-metalica | 1.966 | 1.229 | quatro critérios mantidos |
| steel-frame-litoral-maresia | 2.156 | 1.456 | absorveu a pauta litoral norte, que não tinha pesquisa |
| reforma-tributaria-empreitada-incorporacao | 1.700 | 1.342 | caso refeito para obra de R$ 900 mil e terreno de R$ 400 mil: empreitada R$ 119.250, compra pronta R$ 104.410 ao custo e R$ 170.660 a R$ 1,8 milhão. Janela de tempo: CBS em 01/01/2027 |
| acustica-entrepiso-steel-frame | 2.111 | 1.318 | próprio artigo (ruído de impacto em sobrado) |
| impermeabilizacao-banheiro-steel-frame | 1.816 | 1.277 | demanda de busca baixa, prioridade baixa |
| normas-light-steel-frame-brasil | 2.479 | 1.625 | é o reposicionamento do guia já publicado, página com tráfego real (46 cliques em agosto) |

Em todos, os números de componentes (tabelas, gráficos, FAQ) que mudaram de base estão listados na nota de revisão ao fim de cada arquivo, para a etapa de produção montar os componentes com os valores novos.

## Atualização de artigo publicado, em revisão staged

`quanto-custa-projeto-casa` (pauta 0fbdbc5d, S16 do calendário): CUB de junho para agosto de 2026 (R$ 2.235,58 por m²), exemplo de 100 para 250 m² (obra R$ 558.895, pacote de projetos de R$ 27.900 a R$ 83.800), abertura, FAQ, estatística e meta atualizados, link para `projeto-integrado-light-steel-frame`. O artigo no ar não mudou. Falta aprovar e publicar, e depois pedir reindexação.

## Correções prontas que ainda não têm onde entrar

1. **anatomia-parede-steel-frame (carga suspensa).** O artigo publicado diz que reforço ancora "100 quilos ou mais", sem fonte. Os ensaios do IPT (DATec 14 e 15) dão 10 a 11,5 kgf por ponto só na chapa, 40 kgf no montante e 65 kgf por peça com OSB estrutural. Revisão pronta em `Docs/revisoes-blog/2026-10-anatomia-parede-dados.json` e no rascunho `Docs/revisoes-blog/2026-10-anatomia-parede-revisao.md`. Não foi possível abrir revisão staged porque o post está vinculado só a uma pauta de LinkedIn, sem trilha de blog. Para publicar, falta vincular uma pauta de blog.
2. **passo-passo-construcao-steel-frame.** Tem três respostas de prazo diferentes na mesma página (a soma da tabela de cronograma dá 150 a 298 dias contra 90 a 120 declarados), atribui 70 m² em Londrina a um estudo de Guarapuava e carrega preços de janeiro de 2025. É conteúdo escrito em arquivo TypeScript (`data/articles/steel-frame-processo.ts`), fora do fluxo de revisão staged. Correção não aplicada, depende de decisão.

## Retiradas do calendário

| Pauta | Motivo |
|---|---|
| Casa de 70 m² | fora do público. Rascunho arquivado |
| Pode pendurar TV na parede | virou a correção da anatomia, acima. Rascunho arquivado |
| Manutenção de casa | mesclada na vida útil |
| Steel frame no litoral norte de SP | mesclada na litoral-maresia |
| Caixa financia steel frame (MCMV Faixa 4) | ticket abaixo do público |
| Cronograma real de uma obra | bloqueada: a pesquisa exigiu datas reais de uma obra Berkahn e elas não existem no repositório |

Os motivos estão gravados no campo `insights` de cada pauta, no admin.

## Pautas novas

Criei seis pautas novas ao longo do dia e quatro saíram. Kit casa e mão de obra saíram por não servirem ao público (casa pequena e DIY). Custo do projeto e etapas do projeto saíram por duplicarem artigos já publicados (`quanto-custa-projeto-casa` e `projeto-integrado-light-steel-frame`), e eu não tinha conferido o acervo antes de propô-las. Duas ficaram.

| Pauta | Estado da pesquisa |
|---|---|
| Orçamento de obra em steel frame: o que pedir da construtora | parcial. Falta o que as construtoras incluem. Precisa de propostas reais |
| Projeto de alvenaria adaptado para steel frame | bloqueada em fonte. Precisa do manual CBCA Steel Framing: Arquitetura ou da engenharia da Berkahn. Se nada chegar até 07/12/2026, virar capítulo de `projeto-integrado-light-steel-frame` |

## Calendário novo (duas pautas por semana)

- 26/10: telhado, casa valoriza
- 02/11: normas (reposicionamento), aprovar projeto SP
- 09/11: laje, reforma tributária
- 16/11: quanto custa o projeto (atualização), série de preços 2023 a 2026
- 23/11: radier, casa de 200 m² ou mais
- 30/11: orçamento de obra, construtora de SP
- 07/12: entrada e financiamento, vida útil e manutenção
- 14/12: vale a pena começar em 2027, projeto de alvenaria adaptado
- 21/12: desvantagens reais, esquenta
- 28/12: litoral, home equity
- Janeiro e fevereiro de 2027: o restante, com IPTU, ENCE, retrospectiva e tendências no fim

Datas assumem a produção dos componentes e a aprovação humana de cada artigo, que não foram feitas.

## Atualização do mesmo dia, depois da informação de que a Berkahn nunca executou obra real

- **Cronograma real de obra:** pauta encerrada. Não existe obra nem diário de obra. O artigo `passo-passo-construcao-steel-frame` (em `data/articles/steel-frame-processo.ts`) foi corrigido no código: soma das etapas coerente (150 a 298 dias contra 230 a 390), estudo do CONTECC 2021 citado com as três ressalvas, estatística de 60% trocada por 40% na obra bruta, preços de janeiro de 2025 removidos, custo de projeto alinhado ao percentual do artigo de projeto. Ainda falta atualizar o `answer_summary` no banco, que continua dizendo 3 a 6 meses.
- **Anatomia da parede (carga suspensa):** a pauta de LinkedIn ganhou trilha de blog e a revisão ficou staged, com a correção dos números e a troca de duas frases que diziam que a Berkahn executa obras. Entra no calendário em 26/10.
- **Projeto de alvenaria adaptado:** pauta retirada. Sem fonte primária (o manual do CBCA não está acessível) e sem material próprio, qualquer regra de modulação ou de abertura seria dado inventado. O que é citável já está em `projeto-integrado-light-steel-frame`.
- **Orçamento de obra:** aguardando as propostas que o Bruno vai enviar.
- **Afirmações de experiência:** cinco rascunhos tinham frases como "nós projetamos e construímos", "como fazemos em projetos comerciais" e "a resposta que damos na primeira conversa", e foram reescritos em linguagem de oferta. Dezoito dos 48 artigos publicados e três componentes do site (`StatsCounter`, `MiniGaleria`, `ArchitectMetrics`) também trazem afirmações desse tipo, e não foram alterados.
- **Ordem no quadro:** corrigi a coluna de ordem das pautas, que eu tinha sobrescrito com 1 e 2. A data é uma só para blog e LinkedIn, e a ordem do LinkedIn agora segue o mesmo calendário.
- **Calendário:** a anatomia entra em 26/10 e as demais pautas deslocam uma posição.
