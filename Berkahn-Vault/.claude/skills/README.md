# Obsidian Skills

As skills `obsidian`, `obsidian-cli`, `obsidian-bases`, `obsidian-markdown` estão disponíveis no ambiente global do Claude Code (via plugin `kepano/obsidian-skills`).

**Não é necessário clonar localmente** — Claude Code já invoca via skill manager.

## Skills disponíveis

| Skill | Uso |
|-------|-----|
| `obsidian-markdown` | Criar/editar nota com sintaxe nativa (wikilinks, callouts, properties, embeds) |
| `obsidian-cli` | Operações headless: search, list, get backlinks |
| `obsidian-bases` | Editar arquivos `.base` (queries estruturadas) |
| `obsidian` | Workflow orchestration |

## Quando clonar localmente

Se quiser versionar uma cópia local (ex: para customizar skills sem afetar global):

```bash
git clone --depth 1 https://github.com/kepano/obsidian-skills.git
```

Hoje, default = usar skills do plugin global.
