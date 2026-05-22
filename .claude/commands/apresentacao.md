---
description: Criar ou editar slide na apresentacao executiva
---

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/presentation-system.md` — arquitetura de slides e como adicionar novos
- `Berkahn-Vault/20-context/berkahn-brand.md` — identidade e voz
- `Berkahn-Vault/30-prompts/presentation-slide.md` — prompt de criação de slides

Pergunte ao usuário:
1. Quer criar um slide novo ou editar um existente?
2. Qual o tema/conteúdo do slide?
3. Onde deve ficar na sequência (entre quais slides)?

Depois execute seguindo o prompt e os padrões documentados.

**Arquivar roteiro/notas no vault:**
O componente .tsx fica em `components/presentation/slides/` (build-time, fora do vault). Mas o roteiro/notas/decisões ficam em `Berkahn-Vault/40-content/apresentacoes/[deck-nome]/slide-NN.md` com frontmatter (tipo: meta, tags: project/apresentacao, ai_summary).

$ARGUMENTS
