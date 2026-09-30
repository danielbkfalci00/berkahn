---
tipo: context
criado: 2025-12-01
atualizado: 2026-09-30
tags:
  - ai/context
  - project/site
  - domain/admin
ai_summary: Sistema Admin Berkahn com quatro papéis, CRM e PWA/Web Push. Sprints até PR132 publicados. Exportação prepara todas as abas; KPIs, tendências de consultas e recomendações SEO explicitam os limites das evidências. PDF final e matriz manual de perfis permanecem pendentes.
status: active
projeto: site
escopo: berkahn
---

# Sistema Admin Berkahn

## Melhoria integral do ADMIN (29/09/2026)

Escopo autorizado: implementar a auditoria do repositório em ciclos de correção e validação. Fonte de continuidade: esta nota, vinculada a [[site]] e [[quadro-conteudo]]. As alterações editoriais locais que já existiam no início devem ser preservadas.

Critérios de aceite no repositório (a ativação hospedada é separada):
- [x] Editorial: revisão publicada em staging, data preservada, autosave sequencial com conflito explícito, preview seguro e saída protegida.
- [x] CRM: papéis consistentes, WhatsApp internacional, atendimento com próximo passo, timeline legível, fila por pendência, correção de contato e retry idempotente.
- [x] Orçamentos: vínculo ao lead, PDF renovável/versionado, dirty state correto e paginação.
- [x] Analytics: períodos comparáveis, denominador correto, falha diferente de zero, aprovação das recomendações, séries recortadas e insights fundamentados.
- [x] Interface: atalhos por papel, menu/foco acessíveis, estados vazios úteis e retirada de CTAs sem destino.
- [x] Carregamento: projeções/paginação, painéis sob demanda e isolamento dos componentes públicos.
- [x] Banco: migration aditiva para os contratos novos, guardas de papel e agregados corretos, sem apagar acervo.
- [x] Verificação: testes de regressão, lint, typecheck e build serializados; registrar limites reais de SQL/produção.

Aplicação e deploy autorizados em 29/09. A migration hospedada foi aplicada em 29/09/2026 às 13h11 BRT, após dry-run com ROLLBACK e testes transacionais. O PR118 foi integrado em `ee1157a` e publicado nos dois projetos Vercel (site e ADMIN). Não iniciar Docker/WSL, Supabase local, n8n nem servidores persistentes.


### Entrega no repositório

- **Editorial:** `app/admin/posts/actions.ts:10`, `components/admin/posts/PostEditor.tsx:64` e a migration separam revisão de conteúdo live. Salvar cria/atualiza o payload da pauta com comparação de versões; publicar exige um clique explícito e preserva a data original. Publicação pelo ADMIN registra `sync_vault_pendente`: a cópia editorial deve ser reconciliada no vault.
- **Autosave e saída:** `lib/conteudo/autosave.ts` serializa gravações e preserva o texto em falhas; `salvarBloco` faz comparação atômica do valor anterior. `hooks/use-unsaved-changes.ts:70` reúne pendências para links, histórico e logout. Em navegadores sem Navigation API, entradas anteriores ao rastreamento podem exigir restaurar o formulário substituindo o ramo Avançar; os dados locais são preservados.
- **CRM:** `components/admin/analytics/LeadsQueue.tsx:98` e `app/admin/leads/actions.ts:74` concentram atendimento, etapa e próximo passo, edição de contato, filtros, prioridade e histórico paginado. Encerrar lead limpa ação pendente. Conversão mantém seu marco temporal. Contatos e downloads de materiais passam a ter classificação explícita.
- **Captação:** `lib/contact.ts:48` e `app/api/leads/route.ts:81` usam UUID + hash canônico por submissão, mantendo retry após troca de rede. Storage do navegador guarda somente hash e UUID; identificadores técnicos entram na anonimização do lead.
- **Orçamentos:** associação com lead, listagem paginada, estado salvo por snapshot, autorização por papel e revisão de PDF por hash do conteúdo. URLs são renovadas no download; geração confirma HTTP e identidade do orçamento, usa caminho único e compara versão antes de atualizar o registro. PDFs do acervo permanecem acessíveis com aviso de versão não verificada.
- **Notificações:** `lib/push/dispatch.ts:39` revalida a pendência, direciona ações vencidas ao responsável e novos leads conforme preferências, guarda recibos por dispositivo e limita o trabalho por prazo. Entregas não tentadas voltam à fila sem consumir tentativa. Continua sendo entrega com possíveis repetições após interrupção entre envio e comprovante, não garantia de envio único.
- **Analytics:** períodos parciais usam baseline equivalente; conversão inclui desqualificados no denominador; estado atual da coorte é identificado como atual. Falhas GA4/GSC/inspeção ficam distintas de zero. Consultas ausentes respeitam limites de cobertura, sugestões exibem evidência/aprovação e séries param no mês escolhido.
- **Carregamento e interface:** `PublicLayout` cria uma fronteira para o código institucional; abas e preview pesados ficam sob demanda; projeções e paginação reduzem respostas. Dashboard usa métricas do fluxo de orçamentos existente; a rota Propostas é um redirect. Navegação respeita papéis, largura recolhida, foco, tablet e safe area. Erros têm recuperação explícita em `app/admin/error.tsx:7`.

### Evidência de validação e carregamento

Testes offline aprovados: `test:conteudo` (ordenação, autosave, estados e renderer), `test:analytics` (76 asserções nos mapas/funil e 39 de integridade, além do aprendizado), `test:crm` (idempotência, concorrência de gravação/PDF e entrega parcial/prazo do push) e `test:admin` (links/histórico/logout, estado do Next e bloqueio do harness em produção). `typecheck` passou; lint completo sem erros, seguido de lint sem erros e sem avisos nos arquivos alterados na revisão final. O build final de produção passou, incluindo TypeScript e geração de 98 páginas. As exceções do `.gitignore` e o CI incluem os três novos testes offline; `git diff --check` passou.

Comparação com o build local anterior disponível, usando a soma dos mesmos conjuntos de chunks em `entryJSFiles` + `rootMainFiles`, sem compressão ou cache:

| Rota | Antes | Depois | Redução |
|---|---:|---:|---:|
| `/admin/analytics` | 1.560.549 bytes | 880.442 bytes | 43,6% |
| `/admin` | 807.357 bytes | 747.442 bytes | 7,4% |
| `/admin/orcamentos/novo/form` | 845.608 bytes | 787.391 bytes | 6,9% |
| `/admin/leads` | 888.603 bytes | 838.908 bytes | 5,6% |
| `/admin/posts/[id]` | 844.977 bytes | 797.849 bytes | 5,6% |
| `/admin/conteudo` | 977.127 bytes | 948.166 bytes | 3,0% |

Isso mede JavaScript inicial associado à rota, não tempo real de resposta, transferência comprimida ou Core Web Vitals. O baseline é o artefato local anterior disponível, não um experimento controlado de produção. O build encontrou o harness local ignorado pelo Git; `proxy.ts:4` agora bloqueia `/dev-harness/**` em produção antes de qualquer consulta, com regressão automatizada e matcher confirmado no `functions-config-manifest.json` gerado. Nenhum desses arquivos locais foi apagado. Os comandos de validação encerraram; nenhum servidor de desenvolvimento ou stack local foi iniciado.

### Banco e entrada em operação

Migration preparada: `supabase/migrations/20260929141528_admin_reliability.sql`. Deve ser aplicada **antes** do deploy correspondente. Contém colunas/índices, RPCs atômicas, guardas de papel, agregados com RLS e extensão da retenção. A normalização dos telefones legados preserva `atualizado_em`, para não reiniciar o prazo de retenção. O backfill de materiais usa somente os quatro marcadores determinísticos da captura antiga.

A migration foi aplicada no projeto hospedado `sfqaknxomxwmviarpwfy` (SHA-256 `9185309e792c5b0f6ed603db4335a69c19ee8dd437b19f7043eb167e0ac635a2`). As definições anteriores das funções foram guardadas localmente, sem exportação dos dados dos leads. A conciliação preservou as migrations 032–034 e os recursos recentes de feedback, LGPD, WhatsApp e gestos. CI do main `36597492753` e deploys Vercel concluídos. O smoke autenticado verificou Dashboard, Leads, Conteúdo, Orçamentos e Analytics; as telas verificadas em 320 px não apresentaram overflow horizontal. Site público e login responderam 200, API de orçamentos sem autenticação respondeu 401 e `/dev-harness` respondeu 404. Nenhum registro comercial foi alterado no smoke. Os snapshots históricos não foram recalculados; a contagem do dashboard distingue ausência dos novos campos de um valor zero.

Checks SQL executados antes e depois da aplicação, sempre com rollback: `npm run test:admin:db` verifica staging/publicação/versões/RLS; `npm run test:leads` verifica CRM/RLS/atendimento/retenção de marcos e idempotência. Esses checks não iniciam infraestrutura.

Cobertura manual ainda pendente: matriz dos quatro papéis, confirmação nativa de saída com edição, lead→orçamento→registro de envio, PDF vencido/alterado, dispositivo revogado e impressão completa das abas. A proteção de navegação tem testes automatizados; a tentativa de validar o diálogo nativo no navegador ficou inconclusiva e não foi registrada como aprovada.

### Continuação dos sprints: dados e continuidade dos fluxos

- **Analytics:** `lib/analytics/comparability.ts` reutiliza o gerador de insights com os dados do próprio período, removendo interpretações legadas sem regravar fatos, datas ou comparações válidas. `AnalyticsHeader` sinaliza cobertura atrasada e fechamento pendente, respeitando a coleta semanal e o lag de três dias do GSC. O pipeline hospedado exige confirmação da persistência em `analytics_snapshots`; erros de publicação deixam de aparecer como sucesso.
- **Orçamentos:** edição, finalização, arquivamento, capa e geração de PDF comparam a revisão exata de `atualizado_em`. Conflito mantém os dados do formulário e orienta conferir a versão atual. A API devolve a nova revisão e aceita `If-Match` nas operações correspondentes. Remover a capa passa a persistir a remoção; o download valida novamente a revisão do PDF.
- **Continuidade editorial:** listas de Posts e Conteúdo preservam busca, filtros e página ao abrir, salvar e voltar. O retorno pauta→editor→pauta mantém a origem no quadro. `lib/admin/return-to.ts` centraliza a allowlist porque o CRM tinha apenas uma validação inline, sem helper reutilizável. A paginação se recupera após excluir o último item ou abrir uma página fora do total.

Regressões incorporadas nos testes existentes `test:analytics`, `test:crm` e `test:admin`, sem uma segunda infraestrutura de testes. Este lote não exige migration. O CI [36609723266](https://github.com/danielbkfalci00/berkahn/actions/runs/36609723266) aprovou lint, TypeScript, conteúdo, CRM, navegação, build e analytics no código do [PR119](https://github.com/danielbkfalci00/berkahn/pull/119). A primeira tentativa encontrou uma variável reservada no teste; foi corrigida antes da aprovação. Builds locais foram evitados porque havia verificações TypeScript de outras tarefas em execução. A nova tentativa de smoke pelo navegador integrado não conseguiu abrir a aba de teste; nenhuma aba temporária ficou aberta e nenhum dado comercial foi alterado. Capas anteriores são preservadas fisicamente porque podem ser compartilhadas/importadas; somente uploads novos rejeitados pela gravação são limpos.

O workflow [36610054808](https://github.com/danielbkfalci00/berkahn/actions/runs/36610054808), executado com o código já aprovado pelo CI, confirmou a publicação do parcial de setembro. Consulta de leitura no Supabase verificou coleta em `2026-09-29T18:14:39.453Z`, período de 01 a 26/09, 26 dias e `partial: true`; o claim antigo sobre triplicar cliques não consta mais do snapshot. Históricos fechados permanecem armazenados como coletados. Próximo foco: completar a matriz de smoke manual pendente acima, incluindo dois editores e geração/download de PDF após troca de capa.

### Continuação: consistência operacional e smoke de navegação

- **Coorte e acesso:** `lib/analytics/leads-queries.ts` mantém arquivados no total recebido e na conversão, preservando a exclusão de anonimizados. Arquivar organiza a fila sem melhorar artificialmente o resultado comercial. Perfis `conteudo` e `viewer` continuam vendo Analytics, mas não consultam leads nem recebem indicadores CRM zerados por falta de permissão.
- **Criação de orçamento:** `app/admin/orcamentos/actions.ts`, `OrcamentoWizard` e `PlanilhaUpload` reutilizam a PK como identificador estável da tentativa. Repetir após resposta perdida recupera apenas o registro do mesmo autor e com os mesmos dados; divergência preserva a edição local e oferece consulta do registro existente. A importação volta à prévia em falhas. A chave dura enquanto a tela estiver aberta; fechar/reabrir inicia outra tentativa.
- **Respostas antigas no CRM:** `LeadsQueue` reverte somente o status afetado por falha, sem restaurar uma seleção anterior ou substituir os outros campos. A paginação do histórico é invalidada quando a primeira página é renovada; lotes antigos não podem misturar versões nem liberar uma requisição nova.
- **Interface:** a saudação do Dashboard deixou de depender do relógio/fuso do cliente e do servidor, removendo essa fonte de divergência de hidratação. A data da tabela de Posts fica em uma linha. O ajuste de largura mantém espaço para as quatro ações e usa os cartões existentes abaixo de 1280 px, evitando que a data empurre os botões para fora da área visível.

O smoke autenticado em produção confirmou busca de Posts → editor → retorno à mesma busca, menu mobile a 320 px, foco inicial no botão de fechar, Escape com retorno de foco e fechamento ao trocar de seção. O quadro Conteúdo não apresentou overflow horizontal nesse recorte. O percurso quadro filtrado → pauta revelou que a URL recebia a busca, mas os links ainda guardavam o retorno sem filtro; esse caso foi incluído na correção e na regressão do lote. Nenhum conteúdo editorial ou registro comercial foi salvo nesses testes. A cobertura acima é do perfil owner; a matriz manual dos demais papéis e os cenários de PDF/edição simultânea continuam pendentes.

O CI [36617603862](https://github.com/danielbkfalci00/berkahn/actions/runs/36617603862) aprovou lint, TypeScript, conteúdo, CRM, navegação, build e Analytics no código do [PR121](https://github.com/danielbkfalci00/berkahn/pull/121); os dois previews Vercel também passaram. O teste integrado inclui o main `6fb0f20`, preservando a alteração de WhatsApp feita em paralelo. As regressões cobrem resposta perdida após commit, autoria/conflito na criação, arredondamento monetário, retry atravessando meia-noite, denominador e permissões do CRM, troca de prévia, refresh antes de falha, paginação renovada e retorno dos filtros nas três visões editoriais. Não há migration nova. Builds/testes locais foram evitados enquanto outras tarefas executavam processos de desenvolvimento na máquina. Próximo lote de jornada: preservar também filtros/página de Leads ao criar um orçamento e voltar do detalhe ou registro de envio.

PR121 integrado em `014a19e`, com CI do main [36618494115](https://github.com/danielbkfalci00/berkahn/actions/runs/36618494115) e deploys do site/ADMIN aprovados. O smoke pós-deploy confirmou quadro com busca “Projeto integrado” → pauta → artigo → pauta → quadro, preservando a busca e o resultado único; o Dashboard recarregou com saudação estável e sem erro de hidratação nessa verificação. Site/login responderam 200, API não autenticada 401 e harness de desenvolvimento 404. A checagem visual revelou que a data sem quebra comprimira a coluna de ações; o ajuste de largura descrito acima complementa essa entrega.

### Continuação: jornada comercial e retorno ao contexto

- `lib/admin/return-to.ts:44` estende o validador existente com destinos comerciais explícitos: filas de leads/orçamentos e uma ficha de lead com sua fila. Rejeita destinos externos, caminhos normalizados e encadeamentos de detalhes. O retorno não reabre o formulário transitório de registro de envio.
- `components/admin/analytics/LeadsQueue.tsx:852` mantém filtros, busca, visão e página nos links de criação, orçamentos vinculados e histórico. As páginas de detalhe/edição, a finalização e a importação carregam a mesma origem. `OrcamentoWizard.tsx:359` oferece acesso direto ao orçamento salvo.
- `app/admin/orcamentos/page.tsx:113` recupera a última página válida após redução do total, preserva busca/status e trata parâmetros repetidos sem erro de renderização. Falhas de contagem continuam explícitas.
- `app/admin/orcamentos/[id]/page.tsx:237` usa a existência do arquivo armazenado para mostrar o PDF arquivado, mesmo sem URL assinada antiga; a renovação e a verificação de versão continuam no endpoint de download.

As regressões locais `test-admin-navigation.mjs` e `test-lead-flow.mjs` passaram com módulos reais e dependências externas simuladas: criação a partir da ficha, retorno de edição, salvamento/finalização, importação, registro de envio, destinos inválidos, paginação e arquivo legado arquivado. Não há migration nem alteração de registros comerciais neste lote. O [PR124](https://github.com/danielbkfalci00/berkahn/pull/124) foi integrado em `bfdc6b4`: CI do PR [36624291734](https://github.com/danielbkfalci00/berkahn/actions/runs/36624291734), CI da main [36624803127](https://github.com/danielbkfalci00/berkahn/actions/runs/36624803127) e os dois deploys Vercel passaram. O smoke owner confirmou lista de orçamentos filtrada → detalhe → editor → lista e fila filtrada de leads → ficha já visualizada → criação preenchida → ficha → fila. Nenhum formulário foi salvo. A tentativa de confirmar download no navegador expirou sem resultado conclusivo. Os cenários manuais de múltiplos papéis, edição simultânea e PDF alterado continuam separados da cobertura automatizada.

O smoke revelou erro de hidratação por horários diferentes no servidor e navegador. A regressão reproduziu o texto divergente sob UTC e São Paulo; `LeadsQueue.tsx:60` agora reutiliza dois formatadores no fuso `America/Sao_Paulo`, já adotado pelo Dashboard, para recebimento, próxima ação e timeline. A comparação também cobre Tóquio e virada de dia. O atalho “Abrir lead” em `steps/Step1Cliente.tsx` recebe a mesma origem do formulário para não perder a fila.

O [PR125](https://github.com/danielbkfalci00/berkahn/pull/125) foi integrado em `c161ed1`; CI da main [36626211773](https://github.com/danielbkfalci00/berkahn/actions/runs/36626211773) e deploys do site/ADMIN passaram. O smoke owner confirmou a ficha e o atalho de retorno ao lead sem novos erros de hidratação.

### Continuação: geração de PDF e matriz automatizada de acesso

- `app/api/admin/orcamentos/[id]/pdf/route.ts:113` troca a espera fixa de 800 ms pela confirmação de carregamento das imagens. Imagem quebrada ou timeout impedem a publicação. A comparação de versão continua rejeitando edição ocorrida durante a renderização.
- `app/orcamento/estimativa/[id]/page.tsx:29` interrompe a renderização se não consegue assinar a capa selecionada. A capa padrão permanece somente para orçamento sem capa própria.
- A gravação do PDF consulta o registro novamente quando a resposta do banco é ambígua. Arquivo confirmado permanece acessível; confirmação indisponível devolve 503 e preserva o upload possivelmente referenciado. Falhas de limpeza ficam registradas sem transformar gravação bem-sucedida em erro nem mascarar conflito 409. Não há fila nova de limpeza: resíduos após indisponibilidade continuam sendo uma limitação operacional.
- `GerarPdfButton` e `BaixarPdfButton` bloqueiam chamadas duplicadas antes da atualização visual do React e liberam nova tentativa ao terminar. Conflitos e respostas ambíguas oferecem “Atualizar orçamento”. `lib/supabase/sessao.ts:38` distingue sessão ausente (401) de papel ativo sem permissão (403).

`scripts/test-lead-flow.mjs` executa handlers, sessão, renderer e botões reais com banco, navegador e Storage simulados. Cobre quatro papéis, usuário inativo/sem sessão, edição durante a geração, capa alterada, renovação de URL, imagem quebrada, resposta perdida após commit, falha na confirmação/limpeza, cliques duplicados e recuperação. O [PR126](https://github.com/danielbkfalci00/berkahn/pull/126) foi integrado em `e8fd190`, com [CI da main](https://github.com/danielbkfalci00/berkahn/actions/runs/36642307635) e ambos os deploys Vercel aprovados. Smoke owner confirmou ficha e console sem erros, site/login 200, API sem sessão 401 e harness 404; o evento de download não foi confirmado pela ferramenta. Não houve alteração de registros comerciais nem migration. Impressão visual do PDF e matriz manual de perfis continuam pendentes.

### Continuação: exportação completa do Analytics

`app/admin/analytics/AnalyticsContent.tsx` inclui as quatro abas mesmo ao exportar do comparativo, espera os módulos/fontes/gráficos, abre os detalhes antes de medir e mantém o relatório até `afterprint`. Uma trava síncrona impede duas exportações; cancelamento, troca de período e desmontagem invalidam a preparação, com limpeza de timers/listeners. No PR127, o limite era de 15 segundos somente para o carregamento visual; a continuação abaixo inclui os módulos no prazo total. O menu nativo continua limitado às seções abertas, com aviso no rodapé; Exportar PDF e Ctrl/Cmd+P preparam o conjunto completo.

`components/admin/analytics/DataTable.tsx` reaproveita os modelos de linha e componentes existentes para imprimir todas as linhas/colunas **disponíveis na coleta**, sem o limite visual de 15 ou filtros locais. Não amplia os limites de captura GA4/GSC. Ordenação, filtros e preferências de colunas da tela permanecem guardados. O relatório explica seu escopo no rodapé. CSS de impressão escopado evita corte horizontal, títulos truncados e espaço da sidebar recolhida; a matriz mobile deixa de duplicar a tabela na impressão.

Regressões incorporadas a `scripts/test-admin-navigation.mjs`: relatório normal/comparativo, clique duplo, Ctrl/Cmd+P, fontes/seções/gráficos atrasados, erro de chunk e retry, timeout/cancelamento/troca de mês/saída, detalhes previamente abertos e navegador com `print()` não bloqueante. Os modelos reais do TanStack confirmam 23 linhas na exportação e restauração dos filtros/colunas depois. A suíte local passou. O [PR127](https://github.com/danielbkfalci00/berkahn/pull/127) foi integrado em `dfabcaa`, com [CI da main](https://github.com/danielbkfalci00/berkahn/actions/runs/36649601575) e deploys do site/ADMIN aprovados. Não há nova migration ou dependência. A impressão visual completa nas famílias de navegador e os demais smokes manuais da lista inicial não são substituídos pelos testes simulados.

### Continuação: filtros do Analytics sincronizados

O smoke em produção encontrou busca na URL sem atualização do campo/tabela. `lib/analytics/use-url-filters.ts:11` deixa o App Router preservar seu próprio estado; repassar `history.state` com `__NA` fazia o Next ignorar a atualização de `useSearchParams`. As operações partem da URL atual para acumular mudanças feitas antes do próximo render, mantendo mês, aba e filtros externos. Continua sendo uma atualização local, sem buscar novamente os dados no servidor a cada tecla.

`scripts/test-admin-navigation.mjs` agora integra o hook, os toolbars de Posts/Queries e os modelos reais do TanStack com a semântica de histórico do Next simulada. A regressão falhou no código anterior e passou após a correção. Cobre entrada por link filtrado, digitação sem acentos, filtros combinados, limpeza parcial/total, atualização por histórico e exportação/restauração sem alterar a URL. O [PR128](https://github.com/danielbkfalci00/berkahn/pull/128) foi integrado em `418467d`, com [CI da main](https://github.com/danielbkfalci00/berkahn/actions/runs/36652011853) e ambos os deploys aprovados. Smoke owner confirmou troca da busca e limpeza em Posts (28 registros) e Queries (380), sem erros de console. A exportação chegou a montar as quatro abas e todas as linhas de Posts, mas terminou com timeout; outra tentativa encerrou a página no navegador integrado. A impressão visual permanece sem aprovação e a causa exata desse episódio não foi confirmada.

### Continuação: preparação de exportação com prazo e cancelamento

`app/admin/analytics/AnalyticsContent.tsx` reutiliza a espera existente, com prazo total de 30 segundos desde a importação dos módulos. Cancelamento, saída e troca de período encerram a espera mesmo se um módulo não responder; resultados tardios não montam uma tentativa antiga sobre a atual. A prontidão exige seções e fontes carregadas, gráficos com largura e altura positivas e duas verificações consecutivas. A conferência a cada 100 ms substitui a dependência de `requestAnimationFrame`, que pode parar em abas ocultas, e reduz a frequência de leituras do layout. Timers/listeners são removidos antes de abrir a impressão; o relatório permanece montado até `afterprint` ou cancelamento. Erros distinguem carregamento, seções, formatação e gráficos sem expor detalhes internos.

`components/admin/analytics/DataTable.tsx` deixa de montar os cartões mobile durante a exportação; a tabela completa já representa os mesmos dados. As preferências e filtros continuam preservados. Nenhum arquivo, serviço, dependência ou migration foi criado.

A regressão local falhou antes da correção porque não existia prazo para módulos pendentes e passou após o ajuste. A suíte também verifica carregamento sem resposta, cancelamento imediato, tentativa antiga seguida de retry, prazo único mesmo com importação lenta, suspensão de quadros de animação, altura zero, mensagens por etapa e ausência dos cartões duplicados. O typecheck local foi interrompido ao detectar testes de outro projeto; o [CI do PR129](https://github.com/danielbkfalci00/berkahn/actions/runs/36660884346) aprovou lint, TypeScript, suítes e build. O [PR129](https://github.com/danielbkfalci00/berkahn/pull/129) foi integrado em `6e03d28`; [CI da main](https://github.com/danielbkfalci00/berkahn/actions/runs/36661141513) e deploys do site/ADMIN passaram.

Após duas falhas de conexão pela abertura direta, `browser.tabs.new()` seguido de navegação recuperou o smoke owner. A exportação montou as quatro abas, os 28 artigos e cinco gráficos com dimensões positivas; não houve alerta de erro nem exceção de console. O cancelamento restaurou somente a aba Resumo e habilitou nova exportação. Houve avisos transitórios de dimensões iniciais do Recharts, antes da medição dos gráficos. A ferramenta não confirmou a janela nativa nem um PDF final, portanto essa cobertura continua pendente.

### Continuação: gráfico efetivo e estado de impressão

O DOM de produção mostrou SVGs de legenda com 8×8 pixels antes do SVG principal em três gráficos. `waitForReport` em `app/admin/analytics/AnalyticsContent.tsx` passa a medir `.recharts-wrapper > svg.recharts-surface`: uma legenda pronta não libera exportação com o gráfico ausente ou sem dimensões. A regressão reproduziu a impressão prematura antes do ajuste e passou após a correção, incluindo ausência, largura e altura zero do gráfico com a legenda presente.

O estado existente foi refinado em preparação, impressão e repouso. `AnalyticsHeader.tsx` distingue “Preparando…” de “Aguardando impressão”; o status informa que o relatório está pronto e oferece concluir no navegador ou cancelar. Isso evita indicar carregamento indefinido quando `print()` retorna sem emitir `afterprint`. O bloqueio de duplicatas e a restauração por cancelamento/`afterprint` permanecem, com regressões para ambos os comportamentos do navegador. Próxima ação: confirmar visualmente o PDF final, incluindo layout mobile; os demais smokes manuais da lista inicial continuam pendentes.

O [PR130](https://github.com/danielbkfalci00/berkahn/pull/130) foi integrado em `804191b`; [CI da main](https://github.com/danielbkfalci00/berkahn/actions/runs/36662095964) e deploys de site/ADMIN passaram. No smoke desktop, as quatro abas, 28 artigos e cinco superfícies de gráfico tinham dimensões positivas e a interface indicou “Aguardando impressão” sem alerta. Em 320 px, a busca por “Financiar” retornou um artigo sem overflow; a ferramenta perdeu resposta ao acionar a exportação. A janela nativa, o PDF final e a exportação mobile continuam sem confirmação. As tentativas de limpar a aba temporária expiraram; ela não foi marcada para persistir na sessão seguinte.

### Continuação: evidência e linguagem dos indicadores

`lib/analytics/narrative.ts` descreve indexação abaixo de 50% como cobertura atual baixa, sem fabricar “queda de 50%” sem baseline. `WinCard` distingue falta de comparação de ausência de ganho acima de 10%; `RedFlagCard` limita a conclusão aos riscos monitorados nos dados disponíveis. `lib/analytics/red-flags.ts` orienta identificar no Search Console a página e intenção de uma consulta antes de sugerir edição de título/descrição.

`lib/analytics/comparability.ts` também omite listas de consultas em alta e em queda quando o baseline GSC é inválido. Consulta e página absolutas continuam disponíveis; o snapshot armazenado não é regravado. A regressão em `scripts/analytics/testar-integridade.mjs` reproduziu cinco afirmações frágeis e duas tendências sem baseline antes dos ajustes. Próxima verificação: CI completo, deploy e leitura do Analytics nos estados sem comparação. A confirmação nativa do PDF e os demais smokes manuais seguem pendentes.

O [PR131](https://github.com/danielbkfalci00/berkahn/pull/131) foi integrado em `7d619d6`; [CI do PR](https://github.com/danielbkfalci00/berkahn/actions/runs/36664495499), [CI da main](https://github.com/danielbkfalci00/berkahn/actions/runs/36664753839) e deploys do site/ADMIN passaram. Localmente, 74 asserções de integridade, TypeScript, lint dos arquivos alterados, diff e gitleaks passaram. O smoke owner de setembro mostrou “Nenhum ganho acima de 10% nas métricas com comparação válida”, sem alertas ou erros de console. O estado com baseline GSC totalmente ausente foi verificado por regressão, não por uma alteração de dados em produção.

O mesmo smoke revelou dois pontos finais quando o risco já chegava pontuado, além de “maior risco” em minúscula após um ponto. `narrativeAct0Status` passa a retirar o ponto terminal de cada trecho e capitaliza os rótulos antes de montar a frase. A regressão falhou com o texto de produção e passou com o ajuste (75 asserções). Próxima verificação: CI, deploy e resumo de setembro com pontuação correta. A janela nativa/PDF final, a exportação mobile e os demais smokes manuais seguem pendentes.

O [PR132](https://github.com/danielbkfalci00/berkahn/pull/132) foi integrado em `3914183`; CI da main e os dois deploys passaram. O smoke owner confirmou a narrativa com “Maior risco” capitalizado e um único ponto final, sem alertas ou erros de console. Um download de PDF do acervo foi acionado na lista de orçamentos sem alerta, mas o navegador integrado não informou evento de download; isso não confirma arquivo nem layout final.

### Continuação: linguagem e disponibilidade do Health Score

`narrativeAct0Status` passa a qualificar “Bom” e as demais faixas como leitura do Health Score com os componentes disponíveis, sem julgar o mês inteiro. `HeroMetric` usa o mesmo estado calculado para mostrar “comparação indisponível” ao lado de Cliques quando falta baseline GSC. A regressão renderiza o componente real nos dois estados; o PDF nativo e a matriz manual de perfis continuam pendentes.

> [!info] Migração para vault
> Este arquivo era duplicado em `Docs/ADMIN_SETUP.md` e `Docs/site/ADMIN_SETUP.md`. Consolidado aqui como fonte única. Referenciado por [[stack-nextjs-supabase]].

## Visão Geral

O Sistema Admin Berkahn é um painel administrativo para gerenciar:
- **Posts de Blog** (Atualidade)
- **Leads e operação comercial**
- **Conteúdo e documentação interna**
- **Orçamentos vinculados a leads**
- **Apresentações Executivas**
- **Propostas legadas** (a antiga rota administrativa redireciona para Orçamentos)

## Arquitetura

```
berkahn.com.br (Site Público)     admin.berkahn.com.br (Painel Admin)
         │                                    │
         ▼                                    ▼
   Next.js SSG + ISR                   Next.js Dynamic
   (mesmo build, `npm run build`)      server-side
         │                                    │
         └──────────────┬─────────────────────┘
                        │
                   Supabase
              (Database + Auth + Storage)
```

O admin é uma superfície operacional autocontida: `ConditionalFooter` não
renderiza em nenhuma rota `/admin/**`. O footer institucional permanece apenas
nas páginas públicas, onde navegação legal e social fazem sentido.

### Shell e hierarquia responsiva

No desktop, o admin mantém a sidebar. No celular, a navegação principal fixa
os atalhos adequados ao papel: comercial/owner com Dashboard, Leads e Orçamentos;
conteúdo com Dashboard, Conteúdo e Posts; viewer com Dashboard, Analytics e Documentações.
Os demais destinos permitidos ficam em **Mais**. Header, conteúdo, drawer e barra inferior
respeitam as safe areas do iOS/PWA.
Nas três rotas principais, o gesto horizontal no conteúdo troca para a próxima
aba permitida ao papel. O gesto não começa sobre controles, diálogos, gráficos
ou listas com rolagem horizontal; as bordas da tela ficam livres para o gesto
de voltar do sistema. A barra inferior continua sendo a navegação explícita.

O Dashboard prioriza o backlog comercial ativo: leads novos, ações vencidas e
leads sem responsável. Falha de consulta nunca é convertida em zero ou atividade
fictícia. Analytics usa as abas Resumo, Aquisição, Conteúdo e Diagnóstico; todas
as seções são carregadas sob demanda; Exportar PDF e Ctrl/Cmd+P preparam o relatório completo. A impressão pelo menu nativo do navegador identifica as seções abertas. A Inbox é a operação móvel de
Leads; o Kanban também oferece navegação por etapa no celular. A prévia do lead mantém altura estável, rolagem interna e gesto no cabeçalho para fechar.

> [!warning] Corrigido em 2026-07-31
> Este diagrama dizia `output: "export"` para o site público, e a seção de
> produção mandava usar `npm run build:static` com output `out`. **Nunca foi o
> que roda.** `vercel.json` define `buildCommand: "npm run build"`, que vale
> para os dois projetos e tem precedência sobre a configuração do dashboard.
> O modo estático foi removido do repositório — ver `next.config.ts`.

## Estrutura de Arquivos

```
app/
├── admin/                    # Rotas do admin
│   ├── layout.tsx           # Layout com sidebar/header
│   ├── page.tsx             # Dashboard
│   ├── login/
│   │   └── page.tsx         # Página de login
│   ├── posts/
│   │   ├── page.tsx         # Lista de posts
│   │   ├── new/page.tsx     # Criar post
│   │   └── [id]/page.tsx    # Editar post
│   ├── propostas/
│   │   └── page.tsx         # Lista de propostas
│   ├── apresentacoes/
│   │   └── page.tsx         # Lista de apresentações
│   └── configuracoes/
│       └── page.tsx         # Configurações
├── ...                       # Outras rotas do site público

components/
├── admin/                    # Componentes do admin
│   ├── AdminLayoutClient.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   ├── DashboardContent.tsx
│   ├── LoginForm.tsx
│   └── posts/
│       ├── PostsTable.tsx
│       └── PostEditor.tsx
├── ...                       # Outros componentes

lib/
├── supabase/                 # Cliente Supabase
│   ├── client.ts            # Cliente para browser
│   ├── server.ts            # Cliente para server
│   ├── middleware.ts        # Middleware de auth
│   └── index.ts             # Re-exports

types/
├── admin.ts                  # Tipos do admin
├── ...                       # Outros tipos

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Schema do banco
```

## Setup Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a URL e a chave anônima do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# URLs
NEXT_PUBLIC_SITE_URL=https://berkahn.com.br
NEXT_PUBLIC_ADMIN_URL=https://admin.berkahn.com.br
```

### 3. Executar Migrations

1. Acesse o SQL Editor no painel do Supabase
2. Cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Execute o script

### 4. Configurar Storage Buckets

No painel do Supabase, vá em Storage e crie os buckets:
- `posts` (público) - para imagens dos posts
- `presentations` (público) - para assets das apresentações
- `proposals` (privado) - para anexos das propostas

### 5. Criar Usuário Admin

No painel do Supabase, vá em Authentication > Users e crie um usuário com email/senha.

## Desenvolvimento

### Rodar em desenvolvimento

```bash
npm run dev
```

O admin estará disponível em `http://localhost:3000/admin`

### Build

```bash
# Único build. Serve os dois domínios.
npm run build
```

## Configuração de Produção

Dois projetos Vercel apontando para o **mesmo repositório e o mesmo build**:

| Projeto | Domínio | Build |
|---|---|---|
| `berkahn` | `berkahn.com.br` | `npm run build` (de `vercel.json`) |
| `berkahn-admin` | `admin.berkahn.com.br` | `npm run build` (de `vercel.json`) |

O que separa os dois é o **middleware**, não o build: `middleware.ts` tem matcher
`['/', '/admin/:path*']` e exige sessão em tudo sob `/admin`. O output é `.next`
nos dois.

### Opção 2: Projeto Único

Configure um único projeto Vercel com o build completo:
- Domains: `berkahn.com.br`, `admin.berkahn.com.br`
- Build Command: `npm run build`

### Configurar DNS na Hostinger

1. Acesse o painel da Hostinger
2. Vá em DNS Zone
3. Adicione registro CNAME:
   - Nome: `admin`
   - Aponta para: `cname.vercel-dns.com`

## Módulos

### CRM de leads

`/admin/leads` é a fila operacional única. A Inbox usa paginação server-side de 25; o Kanban carrega até 150 resultados filtrados e oferece drag-and-drop mais seletor acessível. Busca, filtros, badge de não visualizados e KPIs por coorte de 28 dias são compartilhados. O detalhe concentra contato, origem consentida, funil, responsável, prioridade, último status, próxima ação, timeline, retry da notificação, arquivos e vínculos comerciais. A lista antiga foi removida de `/admin/analytics`, que mantém somente agregados e aprendizado.

O funil canônico é `novo` → `em_contato` → `qualificado` → `proposta_enviada` → `convertido`, com `desqualificado` exigindo motivo. `qualificado_em` registra a primeira qualificação e não é apagado por regressão posterior; `convertido_em` representa fechamento efetivo. Cadastro manual aceita WhatsApp, telefone, email e indicação, mostra candidatos a duplicidade e nunca dispara GA4.

As mutações de funil vivem em RPCs transacionais da migration `024_leads_crm_supabase.sql`; `027_lead_operations_artifacts.sql` acrescenta equipe, prioridade, resumo operacional e anexos, e `029_lead_artifact_atomic_delete.sql` torna a remoção do vínculo + entrada na fila de Storage uma única transação. A migration `031_admin_members_multiuser.sql` reaproveita `lead_responsaveis` como cadastro de membros, vincula cada linha a `auth.users` e substitui o email canônico por papéis ativos. Logs usam `Lead <prefixo-do-UUID>` em `entity_name`; PII e notas ficam em `details` e seguem a retenção. A `032_lead_lgpd_hardening.sql` (aplicada em 2026-09-22) completa a anonimização (utm, landing_page, sheet_sync_error; `origem_legado` fica por ser a chave de idempotência do import), faz o relógio de retenção contar de `GREATEST(criado_em, ultimo_contato_em)` em vez de `atualizado_em`, cria a flag de retenção legal (`set_lead_retention_exception`, só owner) e a eliminação auditada a pedido do titular (`anonymize_lead_on_request`, só owner, recusa convertido ou lead em retenção), e amarra a autoria de `activity_logs` a `auth.uid()` por trigger. As duas RPCs aparecem no detalhe do lead, na seção "Privacidade (LGPD)", visível só ao owner. A `033_leads_busca_e_limpeza.sql` cria índices GIN trigram em nome, email e telefones para a busca com ILIKE; as colunas `sheet_sync_*` continuam porque `scripts/leads/import-leads-csv.mjs` ainda as grava. O mural de feedback (034) está em [[admin-feedback]]. A matriz anon / membro sem papel / comercial / conteúdo / proprietário / service role, a reversão atômica, a fila de arquivos e o payload push sem PII são cobertos por RLS e pelos testes transacionais do CRM.

### Identidade e papéis

O acesso é por convite no Supabase Auth. Cada pessoa recebe email, define a própria senha em `/admin/definir-senha` e usa o mesmo login em todos os dispositivos. A conta `contato.berkahn@gmail.com` foi preservada como `owner`; não existe mais senha compartilhada na UX. `/admin/configuracoes` concentra convite, ativação e papel:

| Papel | Acesso principal |
|---|---|
| `owner` | Todos os módulos, convites e configuração da equipe |
| `comercial` | Leads, orçamentos, propostas e analytics |
| `conteudo` | Conteúdo, posts, documentações, apresentações e analytics |
| `viewer` | Dashboard, analytics e documentações em leitura |

O `proxy.ts:4` bloqueia rotas incompatíveis antes da renderização; RLS e RPCs repetem a autorização no banco. `is_berkahn_admin()` permanece como guarda comercial para RPCs legados, enquanto `has_admin_role()` expressa leituras e mutações dos outros domínios.

Arquivos de até 6 MB (`PDF`, `DOCX`, `XLSX`, `JPEG`, `PNG`, `WebP`) usam upload assinado direto ao bucket privado `lead-files`; o arquivo não atravessa a função Vercel. Arquivos grandes e pastas permanecem no Drive e entram como URL HTTPS. O Drive não é duplicado nem sincronizado automaticamente. Ao anonimizar, links externos são removidos e objetos privados entram em `lead_storage_cleanup` até a Edge Function confirmar a exclusão.

A PWA do admin usa o manifesto estático `public/admin/manifest.webmanifest`, servido em `/admin/manifest.webmanifest`, com `id: /admin/`, `scope: /admin` e `start_url: /admin`. O escopo inclui o endereço inicial e as subrotas, sem alterar o identificador de instalações existentes. O manifesto público continua separado e abre `/`. Instalações antigas que ainda abrem a home precisam ser removidas e instaladas novamente. O `/admin-sw.js` permanece exclusivo para push, sem cachear telas ou PII. O shell captura `beforeinstallprompt` mesmo antes de abrir Configurações; a tela oferece o botão quando o navegador emite esse evento e orienta a instalação manual pelo menu do Chrome/Edge no PC ou pelo Compartilhar no iPhone. Navegadores integrados podem não oferecer instalação. Cada usuário escolhe os tipos de alerta e cada dispositivo opta separadamente por Web Push. A outbox `lead_notification_outbox` recebe apenas título, texto, URL genérica e tag; não contém nome, contato ou UUID do lead. Novos contatos e próximas ações vencidas são deduplicados. As chaves abaixo foram configuradas nos dois projetos Vercel em 2026-08-14:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT=mailto:administrativo@berkahn.com.br
LEAD_PUSH_CRON_SECRET
```

O mesmo `LEAD_PUSH_CRON_SECRET` está no Supabase Vault como `lead_push_cron_secret`. O job `berkahn-lead-push-dispatch` (job 1) chama `https://admin.berkahn.com.br/api/admin/push/dispatch` a cada 15 minutos. O dispatcher é aceito sem cookie somente nessa rota e autentica por segredo constante; no domínio público `/api/admin/**` continua 404. Ele envia apenas para membros `owner`/`comercial` ativos, respeita a preferência individual e registra `skipped_no_subscribers` quando não há dispositivo elegível, em vez de marcar falsamente como enviado. Para receber notificações, cada navegador precisa abrir `/admin/configuracoes`, instalar a PWA se desejado e ativar a assinatura.

### Analytics mensal hospedado

`.github/workflows/analytics-monthly.yml` executa toda quarta-feira às 12:00 UTC para atualizar o mês corrente como parcial, com janela equivalente e lag do GSC. No dia 4 às 12:00 UTC executa também o fechamento oficial do mês anterior. A concorrência é serializada por workflow. O job reutiliza `scripts/analytics/generate-report.mjs`, grava `analytics_snapshots` no Supabase e aceita disparo manual com `month=AAAA-MM`; se o mês solicitado for o corrente, o script marca automaticamente como parcial. OAuth vem dos segredos JSON `GOOGLE_OAUTH_CLIENT_JSON` e `GOOGLE_OAUTH_TOKENS_JSON`; o job também exige `GA4_PROPERTY_ID`, `GSC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_KEY`. Uma falha deixa o workflow vermelho e não depende de tarefa local, computador ligado ou worktree persistente.

Orçamentos e propostas têm `lead_id`. “Criar orçamento” abre o wizard existente com contato e vínculo preenchidos; salvar rascunho não move o funil e finalizar somente registra atividade. O módulo de propostas continua placeholder.

Importação histórica: `node --env-file=.env.local scripts/leads/import-leads-csv.mjs --file=C:\\caminho-fora-do-repo\\leads.csv --dry-run`, seguido de `--apply`. O identificador `sheet:<hash-do-arquivo>:<linha>` torna a repetição idempotente sem fundir linhas repetidas. O script não imprime PII.

Retenção: leads não convertidos, sem exceção e sem atualização por 24 meses são candidatos. A RPC revalida e bloqueia o registro, anonimiza transacionalmente lead, logs, orçamentos, propostas, resumo operacional e vínculos externos. PDFs de orçamento ficam em `retencao_storage_pendente`; uploads de lead ficam em `lead_storage_cleanup`. Só depois a Edge Function `lead-retention` remove os objetos dos buckets `orcamento-pdfs` e `lead-files`; falhas preservam os paths para retry. Em 2026-08-14, a função foi publicada na versão 1 sem verificação JWT, protegida por `RETENTION_CRON_SECRET` no ambiente da Edge e `lead_retention_cron_secret` no Vault. O job `berkahn-lead-retention-monthly` (job 2) roda às 03:15 no primeiro dia de cada mês. O rollout encontrou zero candidatos e zero objetos pendentes; não foi feita execução destrutiva manual.

### Posts de Blog

O módulo de posts permite:
- Criar/editar posts em Markdown
- Upload de imagens
- Categorização e tags
- Agendamento de publicação
- Preview em tempo real

### Apresentações (Em Desenvolvimento)

O módulo de apresentações permitirá:
- Criar slides interativos
- Compartilhar via link único
- Rastrear visualizações
- Exportar para PDF

### Propostas (Em Desenvolvimento)

O módulo de propostas permitirá:
- Criar orçamentos detalhados
- Enviar por email
- Rastrear status (enviado, visualizado, aprovado)
- Gerar relatórios

## Integrações

### Integrações operacionais

- Supabase é fonte única de leads e PII.
- Google Sheets e Apps Script estão desativados; alertas opcionais usam Web Push sem PII — ver [[google-sheets]].
- n8n não participa do fluxo de leads atual.

### Vercel Deploy Hook

Configure um deploy hook no Vercel para rebuild automático:
1. Vá em Project Settings > Git > Deploy Hooks
2. Crie um hook e adicione a URL em `.env.local`:
   ```
   VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
   ```

## Segurança

- **Autenticação**: Supabase Auth por convite, email/senha individual e recuperação de senha
- **RLS**: Row Level Security em todas as tabelas
- **Middleware**: Proteção de rotas `/admin/*`
- **HTTPS**: Obrigatório via Vercel

## Troubleshooting

### Erro de login "Invalid API key"
Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas.

### Erro "Cannot read properties of null (reading 'getUser')"
O Supabase não está inicializado corretamente. Verifique as variáveis de ambiente.

### Página de admin retorna 404
Verifique se o middleware está ativo e se a rota está sob `/admin`. (Até
2026-07-31 esta seção culpava `output: "export"`, que não existe mais no
projeto.)
