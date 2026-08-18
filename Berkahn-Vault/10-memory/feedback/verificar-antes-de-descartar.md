---
tipo: memory
criado: 2026-08-18
atualizado: 2026-08-18
tags:
  - ai/memory
  - status/active
  - project/blog
  - project/linkedin
ai_summary: Nunca classificar como falso positivo um check que falhou, nem ler ausência de dado como sinal, sem antes conferir a regra ou o estado real. Aconteceu duas vezes em 2026-08-18, e as duas vezes a máquina estava certa e a suposição estava errada.
status: active
subtipo: feedback
why: "Em 2026-08-18 entreguei um post de LinkedIn sem o link do artigo. O verificador tinha apontado `❌ UTM na convenção do vault` e eu decidi de cabeça que era esperado, sem abrir o prompt. Bruno percebeu na leitura: 'cade o link do post do blog no post do linkedin???'. No mesmo dia afirmei que `orcamento-steel-frame` estava sem tráfego porque não aparecia no relatório de julho; ele nunca tinha sido publicado."
how_to_apply: "Check que falha só vira falso positivo depois de abrir a regra que ele testa e mostrar por que não se aplica. Ausência de um item num relatório só vira sinal depois de confirmar que o item existia no período. Vale para verificador próprio, linter, validador e relatório de performance."
---

# Verificar antes de descartar

Um check que falha e um dado que falta são afirmações sobre o mundo. Nenhum dos
dois pode ser descartado por julgamento de cabeça, porque é exatamente aí que a
suposição passa despercebida.

## Os dois casos que geraram a regra

**O check descartado.** O `check-linkedin.mjs` apontou `❌ UTM na convenção do
vault` no post de custos ocultos. Concluí que a UTM ficava fora do texto, porque
eu a entregava numa linha separada, e segui. O prompt calibrado [[linkedin-post]]
diz o contrário em duas linhas: a URL entra como linha própria entre o CTA e as
hashtags, e a contagem de 110 a 140 palavras exclui URL e hashtags justamente
porque elas fazem parte do post. O post aprovado da pauta anterior já seguia esse
formato. Bastava abrir o arquivo.

**A ausência lida como sinal.** No mesmo dia, montando a análise de canibalização
do cluster de custo, registrei que `orcamento-steel-frame` estava sem tráfego por
não aparecer no relatório de performance de julho, e o classifiquei como página
morta candidata a merge. Ele nunca foi publicado, não existe em `posts`, e a
ausência era o resultado esperado. O bloqueio dele já estava nomeado em [[blog]].

## A regra

Antes de tratar um check vermelho como falso positivo, abrir a regra que ele
testa e mostrar por que não se aplica àquele caso. Antes de ler ausência como
sinal, confirmar que o item existia no período medido.

Isso vale para verificador escrito na própria sessão, para o `vault-validate.mjs`,
para o linter e para relatório de performance. Um verificador existe porque a
avaliação de cabeça falha; usá-lo e depois ignorá-lo por avaliação de cabeça
devolve o problema inteiro.

## Sinal de alerta

A frase "isso é esperado" dita sobre um resultado negativo, sem um arquivo ou uma
consulta citada logo em seguida, é o próprio erro acontecendo.

---

**Relacionado**: [[copy-sem-travessao]] · [[prompts-calibrados]] · [[linkedin]] · [[blog]]

**Contexto aplicado**: [[quadro-conteudo]] · [[workflow-conteudo]]
