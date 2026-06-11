---
tipo: memory
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - ai/memory
  - status/active
  - project/apresentacao
  - project/comercial
ai_summary: Workflow do projeto Comercial / Apresentações comerciais — pipeline vendas lead → proposta → apresentação → contrato. Apresentação executiva (/apresentacao-executiva 16 slides) é material principal. Quando lead aparece, customizar deck conforme perfil (residencial vs comercial-industrial).
status: active
subtipo: project
why: "Vendas LSF alto padrão (R$500k-R$2M+) exigem material visual sofisticado + dados confiáveis + processo claro. Workflow garante apresentação consistente em qualquer reunião comercial sem reinventar a roda."
how_to_apply: "Lead chega → triar segmento (residencial/comercial) → puxar /apresentacao-executiva (slides padrão) + customizações pontuais → reunião → followup com orçamento + proposta visual seguindo [[guia-orcamento]]."
---

# Workflow do projeto Comercial / Apresentações

> Hub: [[apresentacoes]] · Sistema: [[presentation-system]] · Brand: [[berkahn-brand]] · Pesquisa: [[guia-orcamento]]

## Pipeline

```
1. Lead (Google Sheets via Apps Script ou contato direto)
       ↓
2. Triagem (residencial/comercial-industrial, valor estimado, urgência)
       ↓
3. Reunião comercial
   ├─ Apresentação base: /apresentacao-executiva (16 slides)
   ├─ Customizações pontuais por perfil
   └─ Dados de mercado: SlideGlobalOverview, SlideBrazilOpportunity
       ↓
4. Followup
   ├─ Orçamento (template baseado em [[guia-orcamento]])
   ├─ Proposta visual (Canva, briefing via /material)
   └─ Anexos: PDFs técnicos, casos relevantes
       ↓
5. Negociação → Contrato
```

## Etapas

### 1. Lead capture
- Origem: formulário do site → Google Sheets via Apps Script (ver [[google-sheets]])
- Bruno recebe email de notificação
- **Fase 4.1** (futuro): sync Google Sheets → HubSpot CRM

### 2. Triagem
- Segmentar: `residencial` ou `comercial-industrial`
- Valor estimado, prazo, localização (área servida pelo geo schema)
- Decidir: presencial / remota / qualificação telefônica primeiro

### 3. Reunião comercial — material padrão
- **Deck base**: `/apresentacao-executiva` em produção
- **16 slides** (ver [[presentation-system]]): Cover → About → Methodology → Diferenciais → Global → Brazil → Founders → Services → Projects (×3) → Partners → Gallery → Contact
- **Customizações comuns**:
  - Trocar Projects (slides 11-13) por casos mais alinhados ao perfil
  - Ajustar foco em SlideServices (residencial vs comercial)
  - Adicionar slide específico se prospect tem demanda peculiar

### 4. Followup (24-48h)
- **Orçamento**: gerar conforme template em [[guia-orcamento]] (Canva ou PDF estruturado)
- **Briefing imagem** (se necessário): rodar `/material` para gerar briefing Canva
- **Anexos**: selecionar de [[indices-imagens-orcamento]], [[indices-imagens-equipe]], casos em `Docs/Imagens/projetos/`

### 5. Pós-followup
- Atualizar pipeline (Google Sheets ou HubSpot futuro)
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

- Sem pipeline de vendas formalizado (HubSpot inativo — Fase 4.1)
- Sem template de proposta padronizado (basear em [[guia-orcamento]])
- Sem rastreamento bidirecional lead ↔ projeto ↔ apresentação usada
