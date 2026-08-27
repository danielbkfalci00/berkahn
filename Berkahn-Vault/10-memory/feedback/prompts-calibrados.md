---
tipo: memory
criado: 2026-04-13
atualizado: 2026-08-27
tags:
  - ai/memory
  - ai/locked
  - status/active
  - project/blog
  - project/linkedin
ai_summary: Prompts de conteúdo (LinkedIn, brainstorm, pesquisa, criação) foram calibrados por iteração e NÃO devem ser alterados sem permissão. Os de Bruno são intocáveis; os criados por Claude podem ser ajustados.
status: active
subtipo: feedback
why: "Os prompts passaram por múltiplas rodadas de refinamento. Especialmente o de LinkedIn, com regras sobre vícios de linguagem, terminologia LSF vs Steel Frame, tom 'engenheiro experiente', extensão 100-180 palavras. Alterar sem entender o histórico degrada qualidade."
how_to_apply: "Ao usar prompt de 30-prompts/, executar fielmente. Se identificar melhoria, sugerir ao Bruno antes de aplicar. Distinguir prompts de Bruno vs prompts criados por Claude."
---

# Prompts de conteúdo são calibrados

Todos os prompts de conteúdo foram calibrados por iteração extensiva e NÃO devem ser alterados sem permissão explícita do Bruno. Cada regra tem razão de ser.

## Prompts de Bruno (intocáveis)

Vieram do Bruno e devem ser executados fielmente:
- [[linkedin-post]]
- [[blog-brainstorm]]
- [[blog-pesquisa]]
- [[blog-criacao]]

## Prompts criados por Claude (mais flexíveis)

Podem ser ajustados com mais liberdade:
- [[presentation-slide]]
- [[canva-briefing]]
- [[seo-page-audit]]

## Histórico de recalibragem

### [[linkedin-post]] v1.1 → v1.2 (2026-08-27)

Autorizada pelo Bruno nesta conversa. Fecha uma contradição que estava fazendo
o mesmo defeito voltar toda semana: o prompt mandava "frases curtas e médias",
e o feedback do Bruno pedia o oposto desde 18/08, em quatro rodadas seguidas.
A regra correta só existia no verificador `scripts/conteudo/check-linkedin.mjs`,
então o gerador e o gate discordavam e o texto nascia reprovado.

| Mudança | Motivo |
|---|---|
| Tom de voz agora pede texto contínuo ligado por conectivos | "quero um texto contínuo, que faça sentido, sem jargões de IA" (25/08) |
| Vício de frase de impacto passa a valer para uma única por parágrafo | a regra antiga só pegava duas em sequência, e uma por parágrafo mantinha o tom de manifesto |
| `check-linkedin.mjs` vira gate no filtro de humanização | leitura em voz alta é subjetiva e falhou quatro vezes |
| Imagem: fotografia documental sem props encenados vira padrão | "achei muito falso essa prancheta" (18/08), mais duas pautas seguidas em que a foto limpa foi a escolha aprovada |
| Uma foto serve Blog e LinkedIn, em 1200x800 e 1080x1350 | decisão do Bruno em 18/08, repetida em 25/08 |

Em 25/08 o Bruno respondeu "deixa como está, sigo registrando" quando levei só a
parte de imagem. Em 27/08 ele mudou de posição e pediu que o feedback entrasse no
processo, o que autorizou as duas partes.

### [[linkedin-post]] v1.2 → v1.2.1 (2026-08-27)

O texto escrito logo depois da v1.2 passou no `check-linkedin.mjs` em 20 de 20 e o
Bruno reprovou por confuso. Ele estava certo, e o defeito não era checável por
regex: o post abria falando em altura de muro antes de o leitor saber que altura
importava, e usava "empuxo" e "platô" sem apresentar nenhum dos dois.

A causa foi compressão para chegar perto de 140 palavras, e as palavras cortadas
eram justamente as que ligavam uma ideia na outra. Três posts seguidos deste fluxo
fecharam em 148, 146 e 157 palavras, sempre acima do alvo, o que sugere que para
assunto denso de número o alvo de 110 a 140 briga com a compreensão.

A v1.2.1 escreve duas coisas no filtro de humanização: **o gate confere
conformidade e não legibilidade**, então releia depois do 0; e não comprima para
bater a contagem, prefira 140 a 160 com o raciocínio inteiro.

### [[linkedin-post]] v1.2.1 → v1.2.2 (2026-08-27)

Feedback do Bruno ao gerador de imagem, trazido para o prompt: "gere 5 versões
separadas em cenários completamente diferentes" e "precisa parecer imperfeito e
não feito por IA".

Duas correções de processo. A primeira é de método: pedir **cinco cenários
distintos de uma vez** em vez de refinar um enquadramento, porque com uma imagem
só não dá para saber se o enquadramento certo era outro. A segunda corrige uma
contradição que a própria v1.2 introduziu: o prompt pedia obra "varrida e quieta",
e canteiro varrido demais é justamente o que denuncia imagem gerada. Imperfeição
passou a ser requisito escrito.

## Como sinalizar no vault

Notas com `locked: true` no frontmatter têm essa proteção. Hook `validate-write` (futuro) bloqueia edits sem flag explícita.
