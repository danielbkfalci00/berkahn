---
tipo: documentacao
criado: 2026-10-27
atualizado: 2026-10-27
tags:
  - project/blog
  - project/linkedin
  - project/site
  - status/active
  - source/manual
ai_summary: "Handoff de sessão do Claude Code em 27/10/2026, por troca de conta. Cobre o lote de cinco pautas dos sócios (publicado, três posts de LinkedIn pendentes de ação humana), a reconciliação de um mês de trabalho de conteúdo/SEO que só existia local, a atualização do sócio Fábio Carvalho no site e apresentação, e os gotchas de ambiente descobertos nesta sessão: preview_start sempre aponta pro checkout principal, Turbopack cacheia de forma persistente entre reinícios, e existe uma branch com 170 arquivos não commitados que não é desta frente de trabalho."
status: active
projeto: blog
projetos_relacionados:
  - blog
  - linkedin
  - site
  - seo-aeo
---

# Handoff — sessão de conteúdo, 27/10/2026

> [!warning] Por que esta nota existe
> A conta do Claude Code vai trocar. Esta nota é o que uma sessão nova precisa
> saber para continuar sem repetir trabalho nem reabrir decisões já tomadas.
> O prompt para colar na sessão nova está no fim, em "Prompt de abertura".

## O que este handoff cobre

Trabalho de conteúdo de 22/09 a 27/10/2026: o lote de cinco pautas dos sócios,
a reconciliação de um mês de trabalho de SEO/conteúdo que estava só local, e
a atualização do sócio Fábio Carvalho no site e na apresentação executiva.

## 1. Lote das cinco pautas dos sócios — publicado, LinkedIn com 3 pendências

Os sócios pediram cinco pautas em 16/09: fachada, instalações hidráulicas e
elétricas, projeto integrado, automação residencial, instalações
internacionais. As cinco foram pesquisadas, escritas, verificadas
adversarialmente (achou e corrigiu uma contradição real entre dois artigos
sobre o teto de furo no montante de aço) e **publicadas no blog com capa**.
Contrato de fronteiras completo em
`Berkahn-Vault/40-content/estrategia/2026-09-socios-cinco-fronteiras.md`.

**Capas**: catalogamos as 41 fotos de `Docs/banco-imagens/obras-projetos/
obra-carrossel-*.jpeg` por conteúdo pela primeira vez — índice em
[[indices-obras-projetos]]. Quatro das cinco capas saíram de foto real em vez
de gerada por IA; só `projeto-integrado-light-steel-frame` precisou de
geração (a `obra-carrossel-13` quase servia, mas é 720 px de largura e exigia
1,5× de ampliação).

**Status real do LinkedIn, pauta por pauta**:

| Pauta | id | Blog | LinkedIn |
|---|---|---|---|
| Fachada | `777926d7` | publicado | **publicado**, confirmado |
| Hidráulica | `f4d25753` | publicado | combinado p/ 30/09, **card sem URL/data, não confirmado** |
| Projeto integrado | `67715d77` | publicado | **publicado**, confirmado 30/09 |
| Automação | `159d3128` | publicado | texto pronto, passa nos 2 gates, **aguarda aprovação** |
| Instalações internacionais | `0820e59d` | publicado | texto pronto, passa nos 2 gates, **aguarda aprovação** |

Comandos para conferir ou reaprovar:

```bash
node scripts/conteudo/pauta.mjs ver <id>
node scripts/conteudo/check-linkedin.mjs <arquivo.txt>
node scripts/conteudo/check-lote-linkedin.mjs --dir=<pasta> --glob=""
```

## 2. Um mês de trabalho de SEO/conteúdo que só existia local — já no repositório

Em 25/10 descobrimos que `2026-10-diagnostico-queda-trafego.md`,
`2026-10-reedicao-rascunhos-e-calendario.md`, o plano de Google Ads, 4
artigos republicados e a auditoria de claims de obra (`Docs/revisoes-blog/`)
nunca tinham sido commitados — nem local nem remoto. Trouxemos pelo PR #144,
separando cirurgicamente esses 84 arquivos de ~170 arquivos de um trabalho de
engenharia diferente (admin/analytics) que estava solto na mesma working
tree.

**O que isso deixou pendente**:

- [[2026-10-diagnostico-queda-trafego]]: o artigo campeão
  `custo-steel-frame-m2-2026` caiu 32% de clique em outubro. Causa
  provável: troca de `meta_title`/`description` em 16/09. **O fix já está em
  produção desde 20/10** (conferido ao vivo). Falta medir se o CTR volta a
  2,8%+ numa janela de 7 dias.
- [[2026-10-reedicao-rascunhos-e-calendario]]: 12 rascunhos cortados para
  950-1.600 palavras, público recalibrado para ticket R$ 500 mil-2 milhões
  (sem casa de 70 ou 100 m²), novo calendário até 15/02/2027. O próximo da
  fila é `normas-light-steel-frame-brasil`.
- Claims de execução de obra: 18 dos 48 artigos publicados e 3 componentes
  do site (`StatsCounter`, `MiniGaleria`, `ArchitectMetrics`) ainda afirmam
  histórico de obras entregues. **O Bruno pediu explicitamente para não
  mexer nisso agora** (27/10: "a gente já executou sim, só que foi bem
  pequeno... não esquenta com isso"). Não reabrir sem pedido dele. Detalhe
  em `10-memory/project/project-berkahn-sem-obra-real.md` (memória nativa,
  fora do vault).

## 3. Fábio Carvalho — sócio atualizado no site, apresentação e PDF

Gabriel Vidal saiu, Fábio Carvalho entrou como Diretor de Projetos. A
mudança já existia pronta havia dias numa branch nunca enviada ao remoto;
trouxemos pelos PRs #145 e #146. Três lugares, sempre em sincronia:

- `components/sections/Founders.tsx` (site, `/empresa`)
- `components/presentation/slides/SlideFounders.tsx` (apresentação
  executiva, `/apresentacao-executiva`)
- `lib/institucional-data.ts` (fonte do PDF institucional)

Bio atual, confirmada ao vivo nos três:

> Engenheiro Civil graduado pela Universidade Católica do Salvador (UCSal),
> com Pós-Graduação em Estruturas e Fundações (INBEC), MBA em Gerenciamento
> de Projetos (FGV) e Diretor de Projetos.

Se o Bruno pedir outro ajuste de bio/cargo/foto de qualquer sócio, mexer
sempre nos três arquivos juntos, nunca só num.

## 4. Achado que fica para o Bruno decidir: a branch órfã

`codex/admin-performance-mobile` (branch local do checkout principal) está
**61 commits atrás** da `main` e **16 à frente**, com **~170 arquivos não
commitados** de uma frente de trabalho de admin/analytics que não é esta.
Ela carrega uma versão desatualizada do `PARCEIROS` em
`lib/institucional-data.ts` (nomes "Brand 01"/"Lumen" em vez de
"Eternit"/"SICLA", porque a branch nasceu em 26/08, antes da correção de
22/09). **Não é um dado errado que alguém mudou de propósito** — é staleness
de uma branch de dois meses nunca rebaseada. Não mergear essa branch como
está. Avisar o Bruno se ele perguntar de novo sobre isso.

## 5. Gotchas de ambiente descobertos nesta sessão

- **`preview_start` com um nome de `.claude/launch.json` sempre aponta para
  o checkout principal** (`cwd` fixo), nunca para o worktree atual, mesmo
  rodando de dentro de um worktree. Se precisar verificar uma mudança feita
  num worktree, ou (a) aplica a mudança temporariamente no checkout
  principal também, verifica, e reverte com `git checkout -- <arquivo>`, ou
  (b) confirma via `curl` direto contra o servidor já rodando, que não
  depende da aba do browser.
- **O Turbopack (Next 16) cacheia entre reinícios do servidor** de um jeito
  que sobrevive a `rm -rf .next` às vezes. Se o preview mostrar conteúdo
  velho depois de editar um arquivo, pare o servidor, confirme com
  `curl localhost:3000/<rota> | grep "<texto novo>"` antes de desconfiar do
  código.
- **Credencial de push**: a conta ativa do `gh` (`scalewithlumen-ai`) não
  tem permissão no repositório. Usar sempre
  `git -c credential.helper= -c credential.helper='!f(){ echo
  username=brunofalci00; echo "password=$(gh auth token -u brunofalci00)";
  }; f' push ...` e `GH_TOKEN=$(gh auth token -u brunofalci00) gh pr ...`,
  sem trocar a conta ativa do `gh` (outras sessões podem depender dela).
- **Padrão de trabalho usado o tempo todo**: nunca commitar do checkout
  principal (está permanentemente sujo com outra frente de trabalho). Sempre
  `git worktree add -q .worktrees/<nome> -b <branch> origin/main`, editar
  lá, `node scripts/vault-validate.mjs` antes de commitar, PR, esperar
  checks, squash merge, confirmar ao vivo com `curl`.

## Prompt de abertura para a sessão nova

Cole isto como primeira mensagem na sessão nova:

~~~text
Continuando o trabalho de conteúdo da Berkahn. Leia primeiro
Berkahn-Vault/00-meta/handoff-2026-10-27-claude-code.md — é o handoff
completo da sessão anterior, com o que foi feito, o que falta e os gotchas
de ambiente (preview_start aponta pro checkout errado, Turbopack cacheia,
qual conta do gh usar pra push). Depois leia sprint-ativa.md e os hubs
blog.md/linkedin.md/site.md para o estado atual.

As pendências que só eu resolvo, nessa ordem:
1. Confirmar se postei o LinkedIn da pauta f4d25753 (hidráulica) em 30/09
2. Aprovar e postar os LinkedIn de 159d3128 (automação) e 0820e59d
   (instalações internacionais) — texto e capa já prontos no card
3. Pedir reindexação no Search Console das URLs publicadas desde 20/09
4. Decidir o que fazer com a branch codex/admin-performance-mobile

Não mexer nos claims de execução de obra (18 artigos + 3 componentes) sem
eu pedir de novo. Não mergear a branch codex/admin-performance-mobile sem
antes tirar o array PARCEIROS desatualizado dela.
~~~
