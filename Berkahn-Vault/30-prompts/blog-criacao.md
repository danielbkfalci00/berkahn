---
tipo: prompt
criado: 2026-04-13
atualizado: 2026-10-20
tags:
  - ai/prompt
  - ai/locked
  - project/blog
ai_summary: Escrever artigo final para o blog com base na pesquisa anterior. Etapa 3 do pipeline (após /pesquisa). Regras rígidas de qualidade. v1.1 (20/10/2026) prioriza leitura leve, resposta no início e público de médio a grande porte. Calibrado por Bruno.
status: locked
locked: true
versao: 1.1
calibrado_em: 2026-10-20
---

> [!warning] PROMPT CALIBRADO — NÃO ALTERAR sem permissão de Bruno
> Ver [[prompts-calibrados]] para histórico de calibragem.

Com base na pesquisa feita anteriormente, escreva o artigo final para o blog da Berkahn.

## REGRAS INEGOCIÁVEIS

**Extensão (v1.1):** a meta depende do tipo de artigo. Artigo de preço, custo ou resposta direta: 900 a 1.300 palavras. Artigo técnico ou comparativo: até 1.800. Guia pilar: até 2.500. Se passar, corte o que for menos essencial. Artigo denso não é artigo longo. Nos artigos de preço e resposta, o leitor que chega pelo Google quer a resposta primeiro e o detalhe depois.

**Resposta no início (v1.1):** nos dois primeiros parágrafos o leitor precisa encontrar a resposta à pergunta do título, em 40 a 60 palavras, com o número ou a conclusão principal. O contexto e a explicação vêm depois, nunca antes.

**Leitura leve (v1.1):** parágrafos de no máximo 4 linhas. Um H2 a cada 150 a 250 palavras, para o leitor se orientar passando o olho. Cada artigo precisa de pelo menos uma tabela ou um box de destaque quando houver dado comparável. Frases com uma ideia só.

**Tom:** acessível e conversacional, como se um engenheiro experiente estivesse explicando para um amigo inteligente que não é da área. Leitura leve, dinâmica, que flui sem esforço. Nada de tom acadêmico, nada de "corporativês".

**Estrutura de texto:** parágrafos corridos. Sem listas de bullets no corpo do artigo, com duas exceções: FAQ no final, onde o formato pergunta-resposta é natural, e tabelas para dados comparáveis (v1.1). Uma lista curta de até 5 itens é aceita só quando os itens são paralelos e o leitor vai consultá-los em vez de lê-los em sequência.

**Dados:** toda métrica precisa de contexto e fonte. Se a pesquisa trouxe um dado, use-o com a referência. Se não trouxe fonte confiável, não invente. Prefira ranges a números exatos quando houver variação.

## VOZ E PÚBLICO

O artigo é assinado pela "Equipe Berkahn". A voz é impessoal no corpo do texto (sem "nós" ou "a gente" no desenvolvimento), mas pode usar "nós" naturalmente na abertura para posicionar a Berkahn e no CTA final.

A Berkahn atende três segmentos: residencial alto padrão, comercial e industrial. O foco é obra de médio a grande porte, com ticket médio residencial de R$ 500 mil a R$ 2 milhões. Casa de 70 ou 100 m², casa popular e programas de habitação de baixa renda não são o público e não devem ser tema nem exemplo (v1.1). Para exemplos de preço e metragem, use casas de 150 a 400 m² e obras comerciais ou industriais. Com base no tema do artigo, defina para qual público o texto conversa. Pode ser um, dois ou os três, desde que a escolha seja intencional e não force encaixe. Isso influencia:
- Exemplos e referências de preço
- Profundidade técnica de cada seção
- Tom dos CTAs
- Tipo de pergunta no FAQ

Na seção de observações para implementação, indique qual público foi priorizado e por quê.

## VÍCIOS DE LINGUAGEM PROIBIDOS

Estes padrões denunciam texto gerado por IA. Evite todos:

- Travessão ou hífen como recurso estilístico (ex: "e isso muda tudo — literalmente")
- Dois pontos como recurso estilístico em parágrafos (podem ser usados em contextos técnicos ou tabelas)
- "Quase ninguém fala/sabe sobre isso"
- "Você sabia que...?", "Nos últimos anos...", "Vamos falar sobre..."
- "Não é apenas X, é Y" ou "Mais do que X, é Y"
- "E" ou "Mas" isolados no início de parágrafo como efeito dramático
- Superlativos vazios: "incrível", "revolucionário", "game changer", "divisor de águas"
- Frases curtas com ponto final dramático em sequência (tom de manifesto)
- "Genuinamente", "honestamente", "de forma straightforward"
- Qualquer estrutura que pareça retórica artificial ou clichê corporativo

Se a frase parece gerada por IA, reescreva até parecer humana.

## KEYWORDS E SEO

**Keyword principal:** [KEYWORD]
**Keywords secundárias:** [LISTA]
**Keywords Berkahn (integrar naturalmente):** Light Steel Frame, Steel Frame, construção industrializada, construção a seco

A primeira menção ao Light Steel Frame deve incluir explicação breve do que é. Depois, pode usar "Steel Frame" ou "LSF".

Densidade de keywords: natural. Se parecer forçado, está errado. Priorize fluidez sobre SEO mecânico.

## ESTRUTURA DO ARTIGO

1. **Abertura (1-2 parágrafos):** Hook com dado concreto ou fato surpreendente. Estabeleça relevância imediata e dê ao leitor um motivo para continuar.

2. **Desenvolvimento (H2s e H3s):** Organize conforme o tema pedir. Cada seção deve entregar valor próprio. Se o leitor ler só uma seção, ele deve sair com algo útil.

3. **Conexão com LSF:** uma seção dedicada (não forçada) mostrando como o Light Steel Frame se conecta com o tema do artigo. Deve fazer sentido orgânico, não parecer propaganda inserida.

4. **FAQ (3-6 perguntas):** Perguntas reais que as pessoas fazem no Google sobre o tema. Respostas diretas, 2-4 linhas cada.

5. **Fechamento (1-2 parágrafos):** Síntese do valor + CTA para a Berkahn (consultoria, orçamento). Sem tom de vendedor.

## ELEMENTOS VISUAIS (para implementação)

Ao longo do artigo, identifique oportunidades para elementos visuais e interativos. Para cada um, descreva:
- O que é (tabela, infográfico, box de destaque, diagrama, etc.)
- O que mostra e por que é relevante
- Onde inserir no artigo (após qual seção/parágrafo)

Critério: só proponha se realmente facilitar a compreensão ou tornar a leitura mais dinâmica. Não encha de elementos por encher.

## FORMATO DE ENTREGA

```markdown
---
title: "[Título otimizado - máx 60 caracteres]"
description: "[Meta description 150-160 chars]"
keywords: [keyword1, keyword2, keyword3]
author: "Equipe Berkahn"
date: "YYYY-MM-DD"
readTime: "[X] min"
category: "[categoria]"
---

# [Título H1]

[ARTIGO COMPLETO]

---

## ESPECIFICAÇÕES TÉCNICAS PARA IMPLEMENTAÇÃO:

**Elementos visuais/interativos sugeridos:**
[Lista numerada com descrição, posição e relevância]

**Internal links sugeridos:**
[Texto âncora → destino]

**External links incluídos:**
[Fonte: URL]

**Imagens necessárias:**
[Descrição, alt text, posição]

**Schema markup recomendado:**
[Article / FAQPage / HowTo / etc]

**Observações para implementação:**
[Contagem de palavras, público priorizado e por quê, notas técnicas]
```

## O QUE USAR DA PESQUISA

- Priorize dados com fonte verificável
- Descarte informação redundante ou fraca
- Se a pesquisa trouxe 15 pontos, use os 8 melhores. Menos é mais.
- Traga perspectiva que outros artigos sobre o tema não trouxeram

## CHECKLIST ANTES DE ENTREGAR

- [ ] Dentro da meta de palavras do tipo de artigo (900 a 1.300 preço/resposta, até 1.800 técnico, até 2.500 pilar)?
- [ ] Resposta à pergunta do título nos dois primeiros parágrafos?
- [ ] Parágrafos de até 4 linhas e um H2 a cada 150 a 250 palavras?
- [ ] Pelo menos uma tabela ou box quando há dado comparável?
- [ ] Exemplos de porte médio a grande, sem casa de 70 ou 100 m²?
- [ ] Abertura com hook concreto (não genérico)?
- [ ] Sem bullets no corpo (exceto FAQ)?
- [ ] Nenhum vício de linguagem da lista de proibidos?
- [ ] LSF explicado na primeira menção?
- [ ] Conexão com LSF faz sentido orgânico?
- [ ] Todo dado tem contexto/fonte?
- [ ] Leitura flui sem esforço?
- [ ] CTA final sem tom de vendedor?
- [ ] Público-alvo definido e coerente com o tema?
