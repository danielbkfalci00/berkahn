---
description: Criar post para LinkedIn da Berkahn
---

Antes de cada escrita, rode `node scripts/conteudo/pauta.mjs proxima <id> --json`, capture `atualizado_em` e passe `--expected-updated-at=<valor>`. Depois de uma escrita bem-sucedida, carregue novamente antes da próxima; isso impede sobrescrever uma edição feita no admin.

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

## 3. Passar no gate antes de gravar

Escreva o texto num arquivo do scratchpad e rode o verificador. Ele lê as regras
do prompt calibrado v1.2 e sai em 0 ou 1:

```bash
node scripts/conteudo/check-linkedin.mjs <arquivo.txt>
```

Só grave na pauta com saída 0. Se ele reprovar, reescreva o texto inteiro; não
remende só a frase apontada, porque o problema costuma ser o ritmo do parágrafo.
A URL com UTM fica em **linha própria entre o CTA e as hashtags**, e não conta
na extensão. Cole a saída do gate no pacote de aprovação.

## 4. Gravar na pauta

Escreva cada texto num arquivo temporário do scratchpad da sessão (**nunca** no
vault) e grave:

```bash
node scripts/conteudo/pauta.mjs gravar <id> --bloco=linkedin          --arquivo=<post.txt> --expected-updated-at=<atualizado_em>
node scripts/conteudo/pauta.mjs gravar <id> --bloco=imagem-prompt     --arquivo=<prompt-en.txt> --expected-updated-at=<atualizado_em>
node scripts/conteudo/pauta.mjs gravar <id> --bloco=imagem-briefing   --arquivo=<briefing-pt.txt> --expected-updated-at=<atualizado_em>
```

O prompt em inglês vai separado do briefing em português de propósito: o botão
de copiar do admin precisa entregar só o inglês, sem a justificativa junto.

Se algum bloco já tiver conteúdo o script recusa e mostra o que está lá —
mostre ao Bruno e pergunte antes de repetir com
`--forcar --confirmar-substituicao`.

**Não crie pasta em `40-content/linkedin/`.** As quatro pastas antigas de lá são
acervo congelado; o texto novo vive na pauta.

## 5. A imagem

Depois de gerar a imagem com o prompt, diga ao Bruno para subi-la no bloco
**Capa Linkedin** em `/admin/conteudo/<id>` — o admin comprime e guarda no
bucket. A imagem precisa ter **1080×1350, proporção 4:5**; outra proporção é
recusada. Quando texto e capa estiverem presentes, a trilha chega a
`produzido`. Aprovação e publicação continuam manuais.

$ARGUMENTS
