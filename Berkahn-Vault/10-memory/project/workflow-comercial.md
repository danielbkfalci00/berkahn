---
tipo: memory
criado: 2026-05-22
atualizado: 2026-08-10
tags:
  - ai/memory
  - status/active
  - project/apresentacao
  - project/comercial
ai_summary: Workflow comercial: todo contato recebido nasce ou é cadastrado em /admin/leads, recebe responsável, prioridade, último status e próxima ação; arquivos ficam vinculados por upload privado ou Drive. Supabase é a fonte operacional até orçamento, proposta, conversão ou desqualificação.
status: active
subtipo: project
why: "Vendas LSF alto padrão (R$500k-R$2M+) exigem material visual sofisticado + dados confiáveis + processo claro. Workflow garante apresentação consistente em qualquer reunião comercial sem reinventar a roda."
how_to_apply: "Lead chega → triar segmento (residencial/comercial) → puxar /apresentacao-executiva (slides padrão) + customizações pontuais → reunião → followup com orçamento + proposta visual seguindo [[guia-orcamento]]."
---

# Workflow do projeto Comercial / Apresentações

> Hub: [[apresentacoes]] · Sistema: [[presentation-system]] · Brand: [[berkahn-brand]] · Pesquisa: [[guia-orcamento]]

## Pipeline

```
1. Contato recebido → /admin/leads (Supabase)
       ↓
2. Triagem (responsável, prioridade, segmento, próximo passo)
       ↓
3. Reunião comercial
   ├─ Apresentação base: /apresentacao-executiva (16 slides)
   ├─ Customizações pontuais por perfil
   └─ Dados de mercado: SlideGlobalOverview, SlideBrazilOpportunity
       ↓
4. Followup
   ├─ Orçamento vinculado ao lead (template baseado em [[guia-orcamento]])
   ├─ Proposta visual (Canva, briefing via /material)
   └─ Anexos: PDFs técnicos, casos relevantes
       ↓
5. Negociação → Contrato
```

## Etapas

### 1. Lead capture
- Formulário do site: grava primeiro no Supabase; `generate_lead` só dispara após confirmação.
- WhatsApp, telefone, email e indicação: cadastrar manualmente apenas quando a conversa foi recebida.
- Google Sheets e Apps Script estão desativados; captura e operação acontecem somente no Supabase (ver [[google-sheets]]).
- Abrir o detalhe marca o lead como visualizado; clique de WhatsApp continua intenção analítica, não lead confirmado.

### 2. Triagem
- Definir responsável, prioridade e segmento (`residencial`, `comercial` ou `não definido`).
- Escrever “último status” curto e agendar a próxima ação; notas e contatos detalhados entram na timeline.
- Atualizar o funil canônico: novo → em contato → qualificado → proposta enviada → convertido; desqualificação exige motivo.
- Valor estimado, prazo e localização seguem no contexto comercial, sem inventar dado ausente.
- Decidir: presencial / remota / qualificação telefônica primeiro

### 3. Reunião comercial — material padrão
- **Deck base**: `/apresentacao-executiva` em produção
- **16 slides** (ver [[presentation-system]]): Cover → About → Methodology → Diferenciais → Global → Brazil → Founders → Services → Projects (×3) → Partners → Gallery → Contact
- **Customizações comuns**:
  - Trocar Projects (slides 11-13) por casos mais alinhados ao perfil
  - Ajustar foco em SlideServices (residencial vs comercial)
  - Adicionar slide específico se prospect tem demanda peculiar

### 4. Followup (24-48h)
- **Orçamento**: abrir pelo detalhe do lead, preservando `lead_id`; rascunho não move o funil.
- **Briefing imagem** (se necessário): rodar `/material` para gerar briefing Canva
- **Anexos**: uploads de até 6 MB podem ficar no Supabase privado; arquivos grandes e pastas ficam no Drive e recebem vínculo no lead. Não duplicar o Drive no banco.

### 5. Pós-followup
- Atualizar último status, próxima ação e funil no `/admin/leads`.
- Marcar `proposta_enviada` somente por ação explícita; `convertido` significa fechamento efetivo.
- Registrar decisão no hub [[apresentacoes]] ou [[materiais]] se novo material gerado
- Se prospect virou cliente: documentar caso em `40-content/casos/` (criar pasta futura)

## Prompts e bases

- Slash: `/apresentacao` (criar/editar slide específico)
- Slash: `/material` (briefing imagem Canva)
- Prompt: [[presentation-slide]], [[canva-briefing]]
- Bases consumidas: (nenhuma específica ainda)

## Outputs típicos

- Deck customizado (ou variação de /apresentacao-executiva)
- Orçamento PDF (Canva ou ferramenta de propostas)
- Briefing de imagem para Canva
- Update do hub [[apresentacoes]] se novo deck/slide criado

## Subagents úteis

- `@design-review` — validar qualidade visual de slides novos antes de apresentar

## Materiais relacionados

- [[guia-orcamento]] — guia completo de pesquisa de mercado para template orçamento premium
- [[indices-imagens-orcamento]] — protótipos Chalé + estrutura LSF
- [[indices-imagens-equipe]] — fotos para apresentação
- [[indices-identidade-visual]] — logos e brand assets
- [[steel-frame-no-mundo]] — roteiro com dados de mercado global (US$ 37bi/ano)

## Gap atual

- CRM leve formalizado no Supabase; ainda falta o deploy do código da Inbox/Kanban e o smoke autenticado.
- A PWA está implementada, mas alertas push aguardam chaves VAPID e agendamento no ambiente da equipe Vercel.
- Sem template de proposta padronizado (basear em [[guia-orcamento]])
- Sem rastreamento bidirecional lead ↔ projeto ↔ apresentação usada
