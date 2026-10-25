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
ai_summary: "Queda de outubro (1-17) vs setembro (1-17): -32% cliques GSC e -22% usuários GA4. Cerca de 96% da perda vem de uma página, custo-steel-frame-m2-2026 (455 para 234 cliques) com posição estável em 3,3. CTR caiu de ~3,1% para ~2,2% e impressões -27% a partir da semana de 22/09, após troca de title e meta em setembro. Hipótese principal a testar, não provada."
status: active
projeto: seo-aeo
projetos_relacionados:
  - blog
  - seo-aeo
---

# Diagnóstico da queda de tráfego (out/2026)

Janela: 01 a 17/10 contra 01 a 17/09 (17 dias cada, dados GSC até 17/10). Fonte: GSC e GA4 via API, relatórios [[2026-10-performance-blog]] e [[2026-09-performance-blog]].

## O que caiu

| Métrica | Set 1-17 | Out 1-17 | Variação |
|---|---|---|---|
| Cliques GSC | ~730 | 498 | -32% |
| Usuários GA4 | 302 | 235 | -22% |
| Sessões GA4 | 427 | 353 | -17% |
| Orgânico Google (sessões) | 334 | 262 | -22% |
| Leads (generate_lead) | 9 | 6 | -3 |

Posição média geral ficou estável (4,5 a 5,1). Não houve perda de ranking. Quem caiu foi o volume de impressões e o CTR.

## Onde caiu

`/atualidades/custo-steel-frame-m2-2026`: 455 para 234 cliques (-221) e impressões 14,6 mil para 10,6 mil, posição 3,4 para 3,3. Isso explica cerca de 96% da perda total. As demais páginas variam pouco (quanto-custa-100m2: 53 para 55; anatomia-parede: 36 para 23; financiar: 25 para 22).

Cliques semanais da página: 180, 196, 191 (setembro até dia 21), depois 151, 92, 100, 83. CTR semanal: 3,0%, 3,1%, 3,6%, 2,9%, 2,1%, 2,3%, 2,3%.

Por dispositivo, impressões caíram mais no desktop (13,0 mil para 8,2 mil, -36%) do que no mobile (15,9 mil para 13,0 mil, -18%).

## Causas prováveis (em ordem)

1. **Troca de title e meta description do artigo campeão (hipótese principal).** Em 16/09 (confirmado por `posts.updated_at`) o artigo foi reposicionado. O título do SERP (`meta_title`) passou de "Custo Steel Frame por m² em 2026: Preços Reais por Padrão | Berkahn" para "Custo do Steel Frame por m² em 2026: preços reais e fontes", e a description trocou "Tabelas por padrão, simulação para casa de 150m²" por "por que a comparação varia de 18% a 49%". O CTR caiu de ~3,1% para ~2,2% com a posição igual, o padrão clássico de snippet menos atraente. A inflexão aparece a partir de 22/09, cerca de uma semana depois da troca. Continua sendo correlação, não prova.

   **Teste preparado (staged, não publicado):** `meta_title` "Custo do Steel Frame por m² em 2026: Preços Reais por Padrão" (60 caracteres) e description com a faixa R$ 3.042 a R$ 6.200, tabelas por padrão, casa de 150 m² e fontes (153 caracteres). Só os dois campos de SERP mudam, o conteúdo e o H1 ficam iguais. Está em `post_draft_payload` da pauta 0197a729 e em `40-content/blog/drafts/custo-steel-frame-m2-2026.md`.
2. **Queda de demanda na query principal.** "steel frame valor m2" teve 412 impressões em setembro e 302 em outubro, "steel frame preço" 328 para 235. Parte da queda é menos buscas, não só CTR. Outubro também teve um vale de 03 a 11/10 (impressões ~1.000 a 1.300 contra ~1.700 por dia).
3. **Menos páginas com cauda.** Normas e fundação perderam metade das impressões (normas 1.464 para 712, fundação 1.064 para 559), sem mudança de posição. Sugere sazonalidade ou menos pesquisas, não penalização.
4. **Composição de dias (efeito de calendário).** As duas janelas têm 17 dias mas composições diferentes de dias da semana. Vale reler com janelas de 28 dias quando outubro fechar.

Descartado: perda de posição, problema de indexação (33 de 39 indexadas, igual a setembro) e quebra de coleta no GA4 (eventos e fontes seguem coerentes).

## O que não caiu

Leads reais seguem estáveis: 15 em setembro inteiro, 9 em outubro até o dia 15. A taxa por usuário ficou perto de 2,6% a 3,0%. Tráfego de IA (chatgpt.com, gemini) segue presente, 25 sessões em outubro. LinkedIn apareceu como fonte (8 sessões).

## Plano de ação (próximas 3 semanas)

**Semana 1 (20 a 26/10)**
- Confirmar a data exata em que o novo title/meta foi ao ar (deploy ou `updated_at` do post) e cruzar com o CTR diário. Sem isso a causa 1 fica como hipótese.
- Teste de snippet: voltar a um title com promessa de preço explícita, mantendo a fonte, por exemplo "Custo do Steel Frame por m² em 2026: tabela de preços com fonte". Mudar só title e description, nada de conteúdo.
- Pedir reindexação da URL no GSC depois da mudança.
- Resolver os 3 P0 de indexação: `steel-frame-vantagens-desvantagens`, `reforma-tributaria-construcao-industrializada`, `construir-hospital-em-operacao` (verificar o motivo da exclusão antes de pedir indexação).

**Semana 2 (27/10 a 02/11)**
- Medir CTR da página por 7 dias contra a base de 3,0%. Se voltar a 2,8% ou mais, manter. Se não voltar, testar uma segunda variante.
- Atacar a segunda página de preço (`quanto-custa-construir-steel-frame-precos-m2-2026`, posição 6,8): reforçar title e links internos vindos do artigo campeão. Ela já subiu de 8,6 para 6,8.
- Snippets das queries "casa steel frame", "steel frame" e "kit casa steel frame preço", que têm CTR abaixo de 2%.

**Semana 3 (03 a 09/11)**
- Reduzir a dependência de um único artigo: planejar 2 pautas de cauda de preço e custo (por exemplo custo por tipo de acabamento e por região) para dividir o tráfego.
- Fechar outubro e comparar com janela completa de 31 dias, não só 17.
- Reavaliar o canal LinkedIn (8 sessões em 17 dias) e a página Home, cujo CTR de 13% sugere buscas de marca ("steelcorp", "berkahn").

## Critério de sucesso

CTR do artigo campeão de volta a 2,8% ou mais e cliques semanais acima de 150 até meados de novembro, sem perder posição.

Links: [[blog]] · [[seo-aeo]] · [[seo-aeo-strategy]]
