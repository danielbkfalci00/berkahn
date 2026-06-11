---
tipo: context
criado: 2026-06-02
atualizado: 2026-06-02
tags:
  - ai/context
  - project/seo-aeo
  - project/site
  - domain/seo
ai_summary: "Veredito sobre llms.txt: efeito ~zero em citações de IA hoje (SE Ranking 300k domínios; Mueller/Illyes negam; server logs). Baixo custo/risco, útil p/ agentes de IDE, não é bala de prata. Berkahn já tem public/llms.txt. O que realmente funciona está em [[research-seo-aeo]] + [[seo-aeo-strategy]]."
status: active
contextos_aplicados:
  - research-seo-aeo
  - seo-aeo-strategy
escopo: berkahn
---

# llms.txt

> [!warning] Veredito (jun/2026)
> Adicionar um `llms.txt` **não** faz a IA recomendar seu negócio. A evidência atual aponta efeito próximo de zero em citações de IA. É um arquivo barato e sem risco, e a Berkahn já tem o seu em `public/llms.txt`. O que de fato move o ponteiro está em [[research-seo-aeo]] e [[seo-aeo-strategy]], não neste arquivo.

## O que é

`llms.txt` é um arquivo markdown na raiz do domínio (`/llms.txt`) proposto por Jeremy Howard (Answer.AI) em setembro de 2024. A ideia é dar ao modelo um índice curado do site: H1 com o nome, um blockquote de resumo, seções H2 com links anotados e uma seção `## Optional` para o que pode ser omitido em contexto curto. A variante `llms-full.txt` concatena a documentação inteira num só arquivo. Foi desenhado para consumo em tempo de inferência, sobretudo por agentes de IDE como Claude Code e Cursor.

## Funciona para "ser recomendado pela IA"?

Não, e a evidência é consistente:

- **Estudo de 300 mil domínios (SE Ranking, nov/2025)**: zero correlação entre ter `llms.txt` e ser citado por IA. Num modelo de ML, remover a variável `llms.txt` até melhorou a acurácia, ou seja, o arquivo era ruído.
- **Google**: John Mueller e Gary Illyes negaram publicamente que usam ou planejam usar `llms.txt`. Mueller comparou à extinta meta tag "keywords". O material do Google sobre AI Overviews afirma que o arquivo não é necessário.
- **Server logs**: os bots de IA (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot) praticamente não solicitam `/llms.txt`. Se fosse usado, apareceria nos logs.

**O caso do vídeo (7 para 150 visitas/dia)** é correlação, não causalidade. O dono reconstruiu o site e adicionou o `llms.txt` no mesmo período. O ganho quase certamente veio da reconstrução (velocidade, estrutura, schema, conteúdo novo), que comprovadamente gera saltos de tráfego. Creditar o resultado ao arquivo confunde "fiz junto" com "foi por causa de".

**Quando `llms.txt` é útil de verdade**: documentação técnica consumida por agentes de IDE em tempo real. Para uma construtora, o benefício direto em citações é nulo, mas o custo e o risco também são, então não há motivo para remover.

## Status Berkahn

A Berkahn já publica `public/llms.txt`. Foi dado um polish (jun/2026): H1 só com o nome (conforme a spec), blockquote com o diferencial, bloco de contato e seção `## Optional` para o feed RSS. Nada a fazer no `app/robots.ts`: a config atual (liberar bots de busca, bloquear bots de treino) é justamente a recomendada em [[research-seo-aeo]].

## O que realmente move o ponteiro

Não está aqui, para não duplicar. O playbook completo e a prioridade real estão em:

- [[research-seo-aeo]] — blueprint AEO/GEO 2026 (Princeton GEO, ski ramp, schema, comportamento por plataforma, SEO local, presença em terceiros).
- [[seo-aeo-strategy]] — regras operacionais aplicadas na produção de conteúdo.
- [[seo-aeo]] (hub) — onde está o gargalo real: **indexação** (poucas páginas indexadas) e **Google Business Profile**, ambos P0.

Para aplicar em **outros projetos**, há um template portátil mais um checklist de prontidão em `91-templates/llms-txt-starter.txt`.

## Fontes

- Spec: <https://llmstxt.org/> · <https://www.answer.ai/posts/2024-09-03-llmstxt.html>
- Sem efeito (300k domínios): <https://www.searchenginejournal.com/llms-txt-shows-no-clear-effect-on-ai-citations-based-on-300k-domains/561542/> · <https://seranking.com/blog/llms-txt/>
- Google não endossa: <https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html> · <https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/>
