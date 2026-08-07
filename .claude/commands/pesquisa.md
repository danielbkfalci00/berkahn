---
description: Pesquisar tema e escrever artigo completo
---

Antes de cada escrita, rode `node scripts/conteudo/pauta.mjs proxima <id> --json`, capture `atualizado_em` e passe `--expected-updated-at=<valor>`. Depois de uma escrita bem-sucedida, carregue novamente antes da próxima; isso impede sobrescrever uma edição feita no admin.

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/berkahn-brand.md` — identidade e voz
- `Berkahn-Vault/20-context/steel-frame-domain.md` — conhecimento técnico
- `Berkahn-Vault/20-context/seo-aeo-strategy.md` — regras de SEO/AEO
- `Berkahn-Vault/30-prompts/blog-pesquisa.md` — prompt de pesquisa (LOCKED)

Execute a pesquisa em duas fases:
1. FASE 1: Pesquise os melhores artigos sobre o tema, identifique gaps e oportunidades
2. FASE 2: Escreva o artigo completo com elementos visuais e especificações técnicas

---

## Onde o resultado vai: na pauta, não no vault

O quadro de conteúdo (`/admin/conteudo`) é a fonte da verdade da pesquisa.
**Não crie arquivo em `40-content/blog/pesquisa/`** — aquela pasta saiu do fluxo.

### 1. Achar a pauta certa

```bash
node scripts/conteudo/pauta.mjs buscar "<termo do tema>"
```

- **Um resultado** → é essa.
- **Mais de um** → mostre os títulos e **pergunte ao Bruno qual**. Nunca escolha
  sozinho: gravar na pauta errada sobrescreve o trabalho de outra.
- **Nenhum** → **pergunte** se ele quer criar uma pauta nova ou apontar um id.
  Não crie por conta própria: as 66 pautas vêm de um calendário pensado, e um
  tema já planejado com fraseado diferente viraria a 67ª duplicada.

Se ele já passou um id ou a URL de `/admin/conteudo/<id>` em `$ARGUMENTS`, use
direto e pule a busca.

### 2. Gravar

Escreva o texto num arquivo temporário do scratchpad da sessão (**nunca** no
vault) e passe o caminho:

```bash
node scripts/conteudo/pauta.mjs gravar <id> --bloco=pesquisa --arquivo=<caminho> --expected-updated-at=<atualizado_em>
```

O texto vai por arquivo porque o output tem milhares de caracteres com aspas,
`$` e quebras de linha — passar isso por linha de comando quebra no PowerShell.

Se o bloco já tiver conteúdo, o script **recusa** e mostra o que está lá.
Nesse caso mostre ao Bruno e pergunte antes de repetir com
`--forcar --confirmar-substituicao` (que guarda o anterior em
`scripts/.cache/`). O comando simples também avança Blog de `planejada` para
`pesquisa`; nunca avança aprovação.

### 3. Insights, só se estiver vazio

Se a FASE 1 produziu gaps e ângulos que valem guardar **e** o bloco `insights`
estiver vazio (o `buscar` mostra quais estão preenchidos), ofereça gravá-los:

```bash
node scripts/conteudo/pauta.mjs gravar <id> --bloco=insights --arquivo=<caminho> --expected-updated-at=<atualizado_em>
```

**Nunca sobrescreva `insights` preenchido** — ele vem do calendário editorial e
é a justificativa de por que a pauta existe.

$ARGUMENTS
