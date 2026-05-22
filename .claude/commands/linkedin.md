---
description: Criar post para LinkedIn da Berkahn
---

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/berkahn-brand.md` — identidade, voz, terminologia
- `Berkahn-Vault/20-context/article-pipeline.md` — regras de arquivo de publicações
- `Berkahn-Vault/30-prompts/linkedin-post.md` — prompt completo do LinkedIn (LOCKED — executar fielmente)

Depois, pergunte ao usuário qual artigo ou tema será a base do post.

Execute o prompt de LinkedIn fielmente. Entregue:
1. Post pronto para copiar e colar
2. Briefing de imagem para Canva (em seção separada)

**Após gerar o conteúdo, arquivar automaticamente no vault:**
1. Criar pasta `Berkahn-Vault/40-content/linkedin/[YYYY-MM-DD]-[tema-curto]/`
   - Usar a data de hoje e um resumo curto do tema (ex: `2026-04-13-custo-m2`)
2. Salvar o texto do post em `post.md` com frontmatter (tipo: draft-content, status: draft, tags: project/linkedin, ai_summary, relacionado: [[blog/slug]])
3. Salvar o briefing da imagem em `briefing-imagem.md`
4. Informar o Bruno: "Quando exportar a imagem do Canva, salve como `imagem-final.png` na pasta `Berkahn-Vault/40-content/linkedin/[YYYY-MM-DD]-[tema-curto]/`"

$ARGUMENTS
