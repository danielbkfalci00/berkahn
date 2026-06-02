---
tipo: meta
criado: 2026-06-02
atualizado: 2026-06-02
tags:
  - project/site
  - status/done
projeto: site
ai_summary: Doc de revisao do piloto Rosmari Calefe (Sprint 1 da substituicao de arquitetos mock por reais). Separa dados REAIS extraidos (bio, formacao, areas, contatos) do que e PROVISORIO e precisa da confirmacao do Bruno/Rosmari (nomes e anos de projeto, metricas, headshot, mapeamento imagem-projeto, enquadramento da parceria vs steel frame).
status: done
---

# Revisao — Rosmari Calefe (piloto)

Pipeline rodado: 32 imagens raspadas (IMB + Google Sites), 31 otimizadas em `public/images/arquitetos/rosmari-calefe/`, perfil extraido por WebFetch. TypeScript compila (0 erros). Entrada provisoria ja inserida em `lib/architects-data.ts` (1ª do array, marcada com flags PROVISORIO).

Contact sheet das 31 imagens: `scripts/.cache/architects-raw/rosmari-calefe/_contact-sheet.png`.

## O que e REAL (extraido das fontes dela)

- **Quem**: Rosmari Calefe, escritorio em **Cerquilho/SP**, atende a regiao.
- **Formacao**: Arquitetura e Urbanismo **CEUNSP (2005)** + especializacao em **Paisagismo** (Escola Paulista de Paisagismo e SECOVI).
- **Atuacao**: residencial, comercial e industrial + paisagismo + administracao de obra. Atendimento presencial ou virtual. Forte em especificacao de materiais de acabamento.
- **5 projetos com areas reais** (terreno / construido):
  1. 442 / **145 m²** · 3 dorms (1 suite)
  2. 886,79 / **232,68 m²** · 3 suites
  3. 623,20 / **216,18 m²** · 3 dorms (1 suite) · 2 pisos
  4. 600 / **186,49 m²** · 2 suites
  5. 1.358,03 / **383,33 m²** · 3 suites · 2 pisos
- **Contato**: tel (15) 3284-1541 e (15) 99141-2006 (WhatsApp) · rosmaricalefe@terra.com.br · http://www.rosmaricalefe.com.br · IG @arq.rosmaricalefe.

## Curadoria visual proposta (das 31 imagens)

- **Projeto-ancora** = sobrado de concreto + madeira ripada + piscina (imagens **#25 fachada noturna, #21 deck/piscina, #28 terraco, #04 area gourmet**). #25/#21/#28 sao confirmadamente a mesma casa; #04 provavelmente a mesma (confirmar).
- **Galeria** (1 casa cada): **#01** (terrea, carport, dusk), **#03** (branca c/ piscina), **#20** (madeira/grafite), **#14** (branca, jardim).
- **Descartadas do showcase**: plantas tecnicas (#06, 11, 16, 17, 22, 29, 30) e faixa/banner (#31). Posso reaproveitar 1-2 plantas como "processo" se voce quiser.

## Bio proposta (voz de marca [[copy-sem-travessao]], zero travessao)

> Rosmari Calefe comanda seu escritorio de arquitetura em Cerquilho, no interior de Sao Paulo, atendendo toda a regiao com projetos residenciais, comerciais e industriais. Formada em Arquitetura e Urbanismo pelo CEUNSP em 2005 e com especializacao em Paisagismo pela Escola Paulista de Paisagismo e pelo SECOVI, soma cerca de duas decadas desenhando a identidade de cada projeto junto com o cliente.
>
> O trabalho dela une um conhecimento forte em especificacao de materiais de acabamento com a administracao da obra do comeco ao fim. O atendimento acontece de forma presencial ou virtual, o que mantem cada etapa proxima da rotina de quem vai morar ou trabalhar no espaco.

## PRECISO de voce para finalizar (decisoes/factos)

1. **Enquadramento da parceria (decisao que afeta TODO o hub)**: a Rosmari e arquiteta generalista (residencial/comercial/paisagismo), **nao especialista em steel frame**. Hoje o hub diz que os escritorios "dominam steel frame". Proposta: reposicionar como **"arquitetos parceiros que assinam o projeto; a Berkahn constroi em Light Steel Frame"**. Confirma essa virada de copy? (vale p/ Bianchi e Airos tambem).
2. **Metricas reais** (hoje PROVISORIAS no codigo): anos de atuacao (~20?), **nº de projetos entregues**, **m² construidos**. Sem isso fica placeholder.
3. **Nomes + anos reais dos projetos** e **qual render e qual projeto** (so tenho as 5 areas; os nomes "Residencia Contemporanea" etc. sao descritivos meus).
4. **Headshot da Rosmari** (foto dela). Hoje o portrait esta com um render provisorio.
5. **Timeline**: confirmar marcos reais (so tenho 2005 = formacao).
6. **Instagram**: quer que eu puxe imagens do @arq.rosmaricalefe tambem? (entra manual na pasta de intake).
7. **Permissao de uso** das imagens confirmada com a Rosmari?

## Assim que confirmar
Ajusto a entrada da Rosmari para 100% real, removo as flags PROVISORIO, e sigo replicando o mesmo pipeline para **Bianchi** e **Airos** (Sprint 2).

---
Relacionado: [[intake-checklist]] · [[copy-sem-travessao]] · [[berkahn-brand]] · projeto [[site]]
