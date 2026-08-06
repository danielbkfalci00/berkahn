---
description: Criar post para LinkedIn da Berkahn
---

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/berkahn-brand.md` — identidade, voz, terminologia
- `Berkahn-Vault/20-context/article-pipeline.md` — regras de arquivo de publicações
- `Berkahn-Vault/30-prompts/linkedin-post.md` — prompt completo do LinkedIn (LOCKED — executar fielmente)

## 1. Achar a pauta

Pergunte qual **pauta** é a base — não qual artigo. A pauta já carrega o artigo
vinculado, o ângulo do calendário e as capas.

```bash
node scripts/conteudo/pauta.mjs buscar "<termo>"
node scripts/conteudo/pauta.mjs buscar --slug=<slug-do-artigo>   # caminho exato
```

Os 22 cards de LinkedIn do acervo já nascem com o artigo vinculado, então a
busca por slug acerta de primeira. Com mais de um resultado, **pergunte**.
Com nenhum, **pergunte** — não crie pauta por conta própria.

Depois, leia a pauta para aproveitar o que já existe:

```bash
node scripts/conteudo/pauta.mjs ver <id>
```

O bloco `linkedin_briefing` traz o **ângulo do calendário editorial** (ângulo +
dado-âncora). Use como direção do post. **Nunca grave nesse bloco** — ele é a
única cópia daquele briefing.

## 2. Executar o prompt

Execute o prompt LOCKED fielmente. Entregue:

1. **Post pronto** para copiar e colar
2. **Briefing de imagem**, com os quatro itens que o prompt pede (textos da
   imagem, foto ou visual de referência, direção visual, identidade constante)
3. **Prompt de geração em inglês** — a tradução do briefing acima para colar
   num gerador de imagem por IA

O item 3 é adição, não substituição: o prompt LOCKED descreve briefing de Canva
e a prática migrou para IA. Entregue os dois; mexer no prompt calibrado exige
permissão explícita do Bruno.

## 3. Gravar na pauta

Escreva cada texto num arquivo temporário do scratchpad da sessão (**nunca** no
vault) e grave:

```bash
node scripts/conteudo/pauta.mjs gravar <id> --bloco=linkedin          --arquivo=<post.txt>
node scripts/conteudo/pauta.mjs gravar <id> --bloco=imagem-prompt     --arquivo=<prompt-en.txt>
node scripts/conteudo/pauta.mjs gravar <id> --bloco=imagem-briefing   --arquivo=<briefing-pt.txt>
```

O prompt em inglês vai separado do briefing em português de propósito: o botão
de copiar do admin precisa entregar só o inglês, sem a justificativa junto.

Se algum bloco já tiver conteúdo o script recusa e mostra o que está lá —
mostre ao Bruno e pergunte antes de repetir com `--forcar`.

**Não crie pasta em `40-content/linkedin/`.** As três pastas antigas de lá são
acervo congelado; o texto novo vive na pauta.

## 4. A imagem

Depois de gerar a imagem com o prompt, diga ao Bruno para subi-la no bloco
**Capa Linkedin** em `/admin/conteudo/<id>` — o admin comprime e guarda no
bucket. Não peça para salvar arquivo no vault.

### Se o script não existir

`/scripts/` é gitignored, então num clone novo ele não está lá. Nesse caso
**não invente outro caminho**: entregue os textos no chat e diga ao Bruno para
colar nos blocos correspondentes em `/admin/conteudo/<id>`.

$ARGUMENTS
