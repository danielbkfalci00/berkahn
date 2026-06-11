---
tipo: prompt
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/prompt
  - ai/locked
  - project/linkedin
ai_summary: Criar post LinkedIn Berkahn a partir de artigo ou tema. Calibrado por Bruno — regras específicas sobre LSF vs Steel Frame, tom engenheiro experiente, 100-180 palavras. Usado por /linkedin.
status: locked
locked: true
versao: 1.0
calibrado_em: 2026-04-13
---

> [!warning] PROMPT CALIBRADO — NÃO ALTERAR sem permissão de Bruno
> Esse é o mais sensível: regras sobre vícios de linguagem, terminologia LSF vs Steel Frame, tom "engenheiro experiente", extensão 100-180 palavras. Ver [[prompts-calibrados]] e [[copy-sem-travessao]].

Crie um post para o LinkedIn da Berkahn sobre o tema/artigo fornecido.

## O QUE É ESSE POST

Um post educativo curto que funciona sozinho (entrega valor mesmo sem clicar no artigo), mas que desperta curiosidade suficiente para o leitor querer o aprofundamento completo. Não é um resumo do artigo. É um recorte inteligente: pegue UM insight, UM dado ou UMA perspectiva do artigo e construa o post inteiro ao redor disso.

## VOZ E PÚBLICO

O post sai da company page da Berkahn. A voz é "nós", como empresa. Não é "a Berkahn fez" (terceira pessoa distante), é "a gente publicou", "no nosso blog", "nós trabalhamos com".

A Berkahn atende três segmentos: residencial alto padrão, comercial e industrial. Com base no tema do artigo, defina para qual público o post conversa. Pode ser um, dois ou os três, desde que a escolha seja intencional e não force encaixe.

## TERMINOLOGIA: LIGHT STEEL FRAME vs. STEEL FRAME

A Berkahn trabalha com Light Steel Frame (LSF), que utiliza perfis leves de aço galvanizado formados a frio. Steel Frame (aço laminado pesado, perfis de grande porte) é um sistema construtivo diferente. Usar o termo errado gera ambiguidade técnica.

Regras:
- Primeira menção no post: sempre "Light Steel Frame" por extenso.
- Menções seguintes: pode usar "LSF" como abreviação.
- Nunca usar "Steel Frame" sozinho como sinônimo de Light Steel Frame no corpo do post. A exceção são hashtags (#SteelFrame, #LightSteelFrame), onde o termo genérico tem valor de alcance.
- Dados e métricas: se o dado é específico do LSF (e não do aço laminado pesado), referenciar como "Light Steel Frame" ou "LSF", nunca como "Steel Frame".
- Ao citar o artigo do blog: se o título do artigo usa "Steel Frame", pode reproduzir o título como está, mas no corpo do post manter "Light Steel Frame" ou "LSF".

## TOM DE VOZ

Educativo, leve e com personalidade. Como se um engenheiro experiente estivesse compartilhando algo interessante que aprendeu, não dando aula.

- Frases curtas e médias. Parágrafos de 1-3 linhas (LinkedIn é leitura vertical no celular)
- Pode usar uma ou duas quebras de expectativa: um dado contraintuitivo, um senso comum desmontado
- Sem emojis. Sem hashtags no meio do texto
- Sem bullet points
- Sem tom de palestrante motivacional ou "corporativês"

## VÍCIOS DE LINGUAGEM PROIBIDOS

Estes padrões denunciam texto gerado por IA. Evite todos:
- Travessão ou hífen como recurso estilístico (ex: "e isso muda tudo — literalmente")
- Dois pontos como recurso estilístico em parágrafos
- "Quase ninguém fala/sabe sobre isso"
- "Você sabia que...?", "Nos últimos anos...", "Vamos falar sobre..."
- "Não é apenas X, é Y" ou "Mais do que X, é Y"
- "E" ou "Mas" isolados no início de parágrafo como efeito dramático
- Superlativos vazios: "incrível", "revolucionário", "game changer", "divisor de águas"
- Frases curtas com ponto final dramático em sequência (tom de manifesto)
- "Genuinamente", "honestamente", "de forma straightforward"
- Qualquer estrutura que pareça retórica artificial ou clichê corporativo
- Endereçar público antes de pergunta no fechamento (ex: "Pra quem gerencia obra:", "Arquitetos:")
- "Na Berkahn, a gente..." como abertura de parágrafo. Esse padrão virou muleta e denuncia repetição entre posts. Variar sempre.

Se a frase parece gerada por IA, reescreva até parecer humana.

## ESTRUTURA

**Linha 1-2 (hook):** A frase que aparece antes do "ver mais". Precisa fazer o leitor parar o scroll. Pode ser um dado surpreendente, uma afirmação provocativa com fundamento, uma pergunta genuína ou uma observação inesperada.

**Corpo (1-2 parágrafos curtos):** Desenvolva o insight de forma concisa. Explique, contextualize, conecte com a realidade do leitor. Máximo 2-3 linhas por parágrafo. Vá direto ao ponto.

**Fechamento institucional (2-3 linhas):** Conecte o tema do post com o propósito da Berkahn. A Berkahn existe para trazer três coisas para a construção civil: leveza, previsibilidade e limpeza. O Light Steel Frame é o sistema que viabiliza isso na prática.

O fechamento deve mostrar, de forma natural e sem forçar, como o tema discutido no post se relaciona com pelo menos um desses três pilares (leveza, previsibilidade, limpeza) e como o LSF entrega isso. Nem todo post vai conectar com os três pilares. Escolha o que faz sentido orgânico com o tema.

O tom aqui é de posicionamento, não de venda. A Berkahn está dizendo o que acredita e como trabalha, não pedindo para alguém comprar. Pense nisso como a assinatura de pensamento da empresa ao final do post.

**IMPORTANTE: como mencionar a Berkahn no fechamento.** O post sai da company page da Berkahn. O leitor já sabe quem está falando. Por isso, o nome "Berkahn" não precisa aparecer em todo post, e quando aparecer, não deve ser sempre no início do parágrafo com a mesma estrutura.

Formas de variar o fechamento institucional:
- Mencionar o sistema (LSF) e o conceito (pilar) sem citar o nome da empresa
- Usar "a gente" ou "nós" de forma natural, sem necessariamente nomear a empresa
- Quando mencionar "Berkahn" por nome, variar a posição na frase (meio, final, nunca sempre no início)
- Em alguns posts, a marca pode aparecer só no CTA e o fechamento ser inteiramente sobre o conceito

O objetivo é que uma pessoa lendo cinco posts seguidos da Berkahn não identifique uma fórmula repetitiva.

**Ponto de reflexão (opcional, 1-2 linhas):** Um fechamento que toca em uma dor real do público. Pode assumir diferentes formatos:
- Afirmação seca que o leitor completa mentalmente
- Pergunta aberta que conecta com experiência real
- Provocação leve com fundamento técnico
- Observação que gera identificação sem pedir resposta

Nem todo post precisa desse elemento. Se nenhum formato encaixar de forma natural no tema, pule direto para o CTA. Forçar reflexão é pior do que não ter nenhuma.

As dores reais do público da Berkahn:
- Medo de obra estourar orçamento
- Medo de atraso interminável
- Frustração com desperdício e sujeira de obra
- Insegurança sobre qual sistema construtivo escolher
- Receio de decisão de centenas de milhares de reais sem informação suficiente
- Obras que viram sinônimo de estresse e imprevisibilidade
- Ter que aceitar as decisões do incorporador quando compra pronto

O ponto de reflexão pode ser integrado ao CTA quando isso tornar o final mais fluido.

NÃO use:
- "E você, concorda?" ou qualquer variação genérica
- "E você, o que acha?" ou qualquer convite vazio de opinião
- Perguntas retóricas óbvias onde só existe uma resposta possível
- Tom de enquete ("Construir ou comprar? Comente abaixo!")
- Endereçamento direto a um público ("Arquitetos, o que vocês acham?")
- Perguntas que soem distantes ou filosóficas demais

**CTA para o artigo:** Uma linha simples. O link já está no corpo do post, então basta indicar: "Tem um artigo completo sobre isso no nosso blog." ou variação natural. Sem "clique aqui", sem "link nos comentários", sem "confira". O CTA pode ser fundido com o ponto de reflexão quando isso funcionar melhor.

**Hashtags:** 3 a 5 no final. Sempre incluir #LightSteelFrame. Pode incluir #SteelFrame como hashtag de alcance. Completar com hashtags do tema.

## EXTENSÃO

100 a 180 palavras no corpo (sem contar hashtags). Se passar, corte.

## O QUE NÃO FAZER

- Não resuma o artigo inteiro. Isso mata a curiosidade.
- Não liste "5 benefícios de X". Formato de IA.
- Não use tom de vendedor. A Berkahn é autoridade técnica, não está pedindo atenção.
- Não force menção ao Light Steel Frame se o tema não conecta diretamente com o corpo do post.
- Não escreva nada que pareça gerado por IA.
- Não endereçe um público antes da pergunta final.
- Não trate o fechamento institucional como slogan ou tagline.
- Não force um ponto de reflexão.
- Não transforme o ponto de reflexão em enquete ou CTA disfarçado.
- Não use "Steel Frame" sozinho como sinônimo de Light Steel Frame no corpo do post.
- Não comece o fechamento institucional com "Na Berkahn, a gente..." em todo post.

## FORMATO DE ENTREGA

Entregue o post pronto para copiar e colar. Um post. Pronto.

Após o post, em seção separada:

### Imagem do post (briefing para Canva)

Toda publicação vai acompanhada de uma imagem. Cada imagem é uma peça única. Não existe template, não existe layout padrão, não existe fórmula.

**Sobre o texto na imagem:**
- O texto da imagem NÃO é um resumo do post. É um ângulo complementar que funciona sozinho no feed e gera curiosidade para ler o post.
- Nunca copie frases do post para a imagem.
- Regra crítica: o texto da imagem precisa ser compreensível por alguém que nunca vai ler o post.
- Sempre que o texto incluir um dado, ele precisa de contexto mínimo que explique o que o número significa.
- A quantidade de texto varia radicalmente entre posts (um número, uma frase, um parágrafo, só o título).
- Não caia no layout "tag pequena no topo / número grande no centro / frase pequena embaixo" em todo post.
- As mesmas regras de vícios de linguagem do post se aplicam ao texto da imagem.

**Sobre a conexão com a Berkahn e o público:**
- A imagem fala com quem está em São Paulo decidindo como construir a própria casa.
- Quando a imagem mencionar a Berkahn, o tom é de posicionamento, não de venda.

**Sobre a foto ou visual:**
- A foto precisa reforçar a mensagem, nunca contradizer.
- Se o post fala sobre Light Steel Frame, a foto não pode mostrar canteiro de alvenaria.
- Nem todo post precisa de foto. Fundo preto com tipografia branca pode chamar mais atenção.
- Variar entre posts com foto dominante, posts com layout dividido e posts só tipografia.

**Formato de entrega do briefing - especifique:**
- **Textos da imagem:** Exatamente o que aparece. Indique o peso relativo entre elementos.
- **Foto ou visual de referência:** O que compõe a peça visualmente. Descreva de forma concreta.
- **Direção visual:** A intenção da peça em uma ou duas frases.
- **Identidade constante:** paleta preto/branco/off-white (#F4F2EC), tipografia Manrope, marca "BERKAHN" e "berkahn.com.br" presentes de forma discreta.
