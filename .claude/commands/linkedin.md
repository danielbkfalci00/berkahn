---
description: Criar post para LinkedIn da Berkahn
---

Leia os seguintes arquivos de contexto:
- `.claude/context/berkahn-brand.md` — identidade, voz, terminologia
- `.claude/context/article-pipeline.md` — regras de arquivo de publicações
- `.claude/prompts/linkedin-post.md` — prompt completo do LinkedIn

Depois, pergunte ao usuário qual artigo ou tema será a base do post.

Execute o prompt de LinkedIn fielmente. Entregue:
1. Post pronto para copiar e colar
2. Briefing de imagem para Canva (em seção separada)

**Após gerar o conteúdo, arquivar automaticamente:**
1. Criar pasta `Docs/publicados/linkedin/[YYYY-MM-DD]-[tema-curto]/`
   - Usar a data de hoje e um resumo curto do tema (ex: `2026-04-13-custo-m2`)
2. Salvar o texto do post em `post.md`
3. Salvar o briefing da imagem em `briefing-imagem.md`
4. Informar o Bruno: "Quando exportar a imagem do Canva, salve como `imagem-final.png` na pasta `Docs/publicados/linkedin/[YYYY-MM-DD]-[tema-curto]/`"

$ARGUMENTS
