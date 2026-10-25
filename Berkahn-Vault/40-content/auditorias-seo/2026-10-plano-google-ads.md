---
tipo: pesquisa
criado: 2026-10-21
atualizado: 2026-10-21
tags:
  - domain/seo
  - project/seo-aeo
  - project/site
  - status/draft
  - source/pesquisa
ai_summary: "Plano preliminar de Google Ads para apresentar aos sócios: base de analytics (≈1.000 a 1.300 cliques orgânicos/mês, 2,6% a 3% de usuários viram lead, 15 leads em setembro), faixas de custo por cenário (piloto R$ 3 mil/mês de mídia), pré-requisitos, fases com critério de parada e perguntas para os sócios. Os CPCs são estimativas de blogs brasileiros de imobiliário, sem benchmark de construção no Brasil: validar no Planejador de Palavras-chave antes de decidir."
status: draft
projeto: seo-aeo
projetos_relacionados:
  - site
  - blog
---

# Plano preliminar de Google Ads (out/2026)

Objetivo: decidir **se** e **quanto** investir em mídia paga antes de montar a conta. Nada foi configurado. Base de dados em [[2026-10-performance-blog]] e [[2026-10-diagnostico-queda-trafego]]; hub em [[seo-aeo]].

> [!warning] O que é fato e o que é estimativa
> Fatos: os números de analytics da Berkahn. Estimativas: CPC, taxa de conversão do anúncio e taxa de lead qualificado. Não existe benchmark público confiável de construção no Brasil. As faixas abaixo vêm de blogs de agência brasileiros para **imobiliário** e de relatórios dos EUA. Servem para dimensionar, não para prometer resultado.

## 1. Base de analytics (o que já temos)

| Indicador | Valor | Fonte |
|---|---|---|
| Cliques orgânicos (GSC) | 498 em 17 dias de out (-32% MoM); ≈730 no mesmo período de set | [[2026-10-performance-blog]] |
| Impressões orgânicas | 21,3 mil em 17 dias, posição média 4,7 | idem |
| Usuários GA4 | 242 em 17 dias | idem |
| Leads (`generate_lead`) | 15 em set inteiro; 6 em 1 a 17/out | [[2026-10-diagnostico-queda-trafego]] |
| Taxa usuário para lead | 2,6% a 3,0% | idem |
| Cliques em WhatsApp | 14 em 17 dias | idem |
| Concentração | 1 artigo gera ≈47% dos cliques (234 de 498) | idem |
| Fonte | Google orgânico 72%, direto 15%, ChatGPT 7% | idem |

Leitura: o orgânico traz volume de **pesquisa de preço** ("steel frame valor m2", "casa steel frame 100m2 preço"). É público em fase de pesquisa e, em boa parte, de casa pequena, fora do porte-alvo (R$ 500 mil a R$ 2 milhões). Anúncio em termos de preço atrairia o mesmo público. O dinheiro rende mais em termos de **contratar**: "construtora steel frame", "empresas de steel frame em sp" (já aparecem no GSC com 13 a 14 impressões e CTR de 15% a 21%) e na fase de projeto.

## 2. Mercado e tendências 2026

- **CPC de referência (imobiliário, Brasil):** R$ 3 a R$ 15 na Pesquisa; conversão de 1% a 3% (blogs de agência). Construção nos EUA: CPC ≈ US$ 8 e CPL ≈ US$ 91 (sem equivalência direta com o Brasil).
- **Automação:** o Google exige lance automatizado (CPC melhorado foi descontinuado). AI Max e Performance Max estão maduros, mas em conta nova com poucas conversões rendem mal. Começar em **Pesquisa pura** e testar AI Max só depois, com parte pequena do orçamento.
- **Sinal de conversão é o ponto central:** em ticket alto, o algoritmo otimiza para quem preenche formulário, não para quem fecha. Importar lead qualificado (offline) para o Google Ads é o que separa campanha boa de campanha que enche o CRM de curiosos.
- **IA nas buscas:** anúncios podem aparecer em AI Overviews, sem lance direto. O efeito é mais busca de marca depois, o que reforça cuidar do Perfil da Empresa ([[google-perfil-empresa]]).
- **Mercado:** insumos em alta pressionam o orçamento das construtoras. Concorrentes diretos anunciando (ex.: steelcorp aparece em buscas de marca) tendem a encarecer o leilão em termos de fundo de funil.

## 3. Cenários de custo (mensal)

Premissas: CPC R$ 7 (central), conversão clique para lead 3% (a mesma do orgânico, otimista para tráfego pago), 25% dos leads qualificados para o porte-alvo (**chute**, medir no piloto).

| Cenário | Mídia/mês | Cliques | Leads | Qualificados | Custo/lead | Custo/qualificado |
|---|---:|---:|---:|---:|---:|---:|
| Piloto | R$ 3.000 | ≈430 | ≈13 | ≈3 | ≈R$ 233 | ≈R$ 930 |
| Base | R$ 6.000 | ≈860 | ≈26 | ≈6 | ≈R$ 233 | ≈R$ 930 |
| Escala | R$ 12.000 | ≈1.700 | ≈51 | ≈13 | ≈R$ 233 | ≈R$ 930 |

Sensibilidade do custo por lead qualificado, mesmo orçamento:

| Hipótese | CPC | Conversão | Qualificados | Custo/qualificado |
|---|---:|---:|---:|---:|
| Pessimista | R$ 12 | 1,5% | 15% | ≈R$ 5.300 |
| Central | R$ 7 | 3% | 25% | ≈R$ 930 |
| Otimista | R$ 4 | 4% | 30% | ≈R$ 330 |

A faixa é larga (16x) porque as três premissas são incertas. Por isso o piloto existe: trocar premissa por dado.

**Mais custos fora da mídia:** gestão (agência costuma cobrar valor fixo ou percentual da mídia; pedir 2 a 3 orçamentos), página de destino e rastreamento (horas de desenvolvimento, só mediante pedido explícito para mexer no site), tempo comercial para atender leads em minutos. Faixas de agência não foram verificadas.

**Conta de retorno (a preencher pelos sócios):** custo por qualificado ÷ taxa de fechamento = custo de aquisição de um contrato. Com ticket de R$ 500 mil a R$ 2 milhões, mesmo R$ 5 mil por qualificado pode fechar a conta se a taxa de fechamento for de poucos por cento. Faltam dois números que só os sócios têm: margem por contrato e taxa de fechamento esperada.

## 4. Pré-requisitos (custo zero de mídia)

1. **Medição:** conferir `generate_lead`, `whatsapp_click` e `form_submit` no GA4 e marcá-los como conversão; vincular GA4 ao Google Ads; Consent Mode (LGPD) já que o consentimento hoje filtra os eventos.
2. **Qualificação do lead:** campo ou etapa no CRM `/admin/leads` que marque "qualificado" (porte da obra, terreno, prazo) e permita importar essa conversão de volta.
3. **Perfil da Empresa verificado** ([[google-perfil-empresa]]): habilita extensão de local e sinal de confiança.
4. **Página de destino:** `/contato` existe. Idealmente uma página específica por intenção (construtora em SP, projeto + obra) com oferta clara. **Só com pedido explícito**, pela regra de não mexer no site sem solicitação.
5. **Texto dos anúncios** em linguagem de oferta (sem "obras entregues", sem "nossas obras"), usando só o que é comprovável: ISO 9001, PBQP-H, especialização em Light Steel Frame.
6. **Resposta rápida:** definir quem atende e em quanto tempo (meta: primeira resposta em até 15 minutos em horário comercial).

## 5. Estrutura proposta da conta

- **Só rede de Pesquisa**, sem Display, sem Performance Max no começo.
- **Região:** São Paulo e Grande SP, depois bairros e cidades de padrão alto (a validar com dados de lead).
- **Grupos:** (a) "construtora/empresa de steel frame" (fundo de funil), (b) "projeto + obra casa steel frame", (c) comercial/industrial (galpão, loja). Evitar de início os termos de preço por m², que atraem pesquisa genérica.
- **Negativas desde o dia 1:** popular, minha casa minha vida, barato, kit, curso, pdf, apostila, 60m2/70m2, mão de obra avulsa, vaga, emprego, "o que é".
- **Remarketing:** lista de visitantes do artigo de custo (alto volume, intenção de preço) para anúncios de "orçamento"; só com volume suficiente de usuários.
- **Marca:** campanha pequena para "berkahn" por baixo custo, defende o nome.

## 6. Fases, critério de decisão e parada

| Fase | Duração | Gasto | Entrega |
|---|---|---|---|
| 0. Preparação | 2 semanas | R$ 0 de mídia | Medição, qualificação no CRM, Perfil verificado, Planejador de Palavras-chave com CPC real, orçamentos de agência |
| 1. Piloto | 60 dias | ≈R$ 3 mil/mês | Dados reais de CPC, conversão, qualificação |
| 2. Decisão | 1 semana | n/a | Comparar com a conta de retorno dos sócios |
| 3. Escala ou parada | contínuo | R$ 6 mil a R$ 12 mil | Só se o custo por qualificado couber na conta |

**Parar no piloto se:** após ≈R$ 6 mil gastos houver menos de 3 qualificados, ou custo por qualificado acima do teto definido pelos sócios. **Escalar se:** custo por qualificado ≤ teto por 4 semanas seguidas e atendimento comercial dando conta do volume.

## 7. Alternativas mais baratas que correm em paralelo

- Corrigir o CTR do artigo campeão (3,1% para 2,2% após troca de title em set): recuperar o CTR vale cerca de +150 a +200 cliques/mês, sem custo de mídia. Teste staged em [[2026-10-diagnostico-queda-trafego]].
- Terminar a verificação do Perfil da Empresa e pedir avaliação (só de cliente real).
- Atacar as buscas de contratação que já aparecem ("construtora steel frame", "empresas de steel frame em sp") com conteúdo e página de serviço.
- LinkedIn orgânico, já em operação.

## 8. Perguntas para os sócios

1. Qual a margem bruta típica por contrato e a taxa de fechamento esperada de um lead qualificado?
2. Teto aceitável de custo por lead qualificado e orçamento total para os 60 dias de piloto?
3. Capacidade comercial: quem atende lead, em que horário, qual tempo máximo?
4. Aprovam criar uma página de destino específica para anúncios (mexe no site)?
5. Gestão interna, freelancer ou agência?

## 9. Pendências

- [ ] @bruno: abrir conta no Google Ads e rodar o Planejador de Palavras-chave (gratuito, sem campanha) para substituir as faixas de CPC deste plano por números reais de SP #pendencia
- [ ] @bruno: levar as perguntas da seção 8 aos sócios #pendencia
- [ ] @codex: após a resposta, refazer a tabela de cenários com CPC real, margem e taxa de fechamento #pendencia

## Fontes

Estimativas de CPC e conversão: MasterPlan AI (imobiliário alto padrão), Aintegrare e André Rocha Consultor (imobiliário, Brasil 2026); ALM Corp e Ryze (EUA 2026); relatórios de tendências 2026 de AI Max e Performance Max (almcorp, mentorcruise, clairejarrett). Metodologias não verificadas.

Contexto: [[seo-aeo]] · [[site]] · [[blog]] · [[berkahn-brand]]
