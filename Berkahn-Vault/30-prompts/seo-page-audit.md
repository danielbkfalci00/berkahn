---
tipo: prompt
versao: 1.0
calibrado_em: 2026-04-13
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/prompt
  - project/site
  - project/blog
status: active
ai_summary: Auditar SEO e AEO de uma página específica do site Berkahn. Criado por Claude — pode ser ajustado. Usado por /seo. Saída em 40-content/auditorias-seo/.
---

> [!note] Prompt criado por Claude
> Pode ser ajustado com mais liberdade que prompts de Bruno.

Leia a estratégia SEO/AEO em [[seo-aeo-strategy]].

## Tarefa

Auditar a página especificada para SEO (Google) e AEO (AI engines), identificando problemas e oportunidades.

## Processo

### 1. Ler o código da página
- Componente principal (page.tsx)
- Layout associado
- Componentes importados
- Metadata/generateMetadata

### 2. Verificar meta tags
- [ ] `title` presente e com keyword (max 60 chars)
- [ ] `description` presente (150-160 chars, com CTA implícito)
- [ ] `og:title`, `og:description`, `og:image` configurados
- [ ] `canonical` correto
- [ ] `robots` não está bloqueando indexação

### 3. Verificar structured data
- [ ] JSON-LD presente e válido
- [ ] Schema type apropriado (LocalBusiness, Service, BlogPosting, FAQPage, etc.)
- [ ] Campos obrigatórios preenchidos

### 4. Verificar hierarquia de headings
- [ ] H1 único por página, com keyword principal
- [ ] H2s para seções principais
- [ ] Sem pulos de nível (H1 → H3 sem H2)
- [ ] Headings descritivos (não genéricos)

### 5. Verificar conteúdo para AEO
- [ ] Passagens autocontidas de 50-150 palavras
- [ ] Padrão "ski ramp" (resposta primeiro)
- [ ] Dados com fonte quando aplicável
- [ ] Linguagem assertiva e específica
- [ ] answer_summary presente (se for artigo)

### 6. Verificar performance
- [ ] Imagens em WebP com lazy loading
- [ ] Componentes code-split (dynamic imports)
- [ ] Sem layout shifts visíveis (CLS)
- [ ] LCP estimado < 2.5s

### 7. Verificar internal linking
- [ ] Links para páginas relacionadas
- [ ] Texto âncora descritivo
- [ ] Sem links quebrados

### 8. Verificar acessibilidade
- [ ] Alt text em imagens
- [ ] HTML semântico (nav, main, article, section)
- [ ] Contraste de cores adequado
- [ ] Navegação por teclado funcional

## Formato de Entrega

```markdown
## Auditoria SEO/AEO: [nome da página]

### Score: [X/100]

### Problemas Críticos
[Lista priorizada de issues que impedem indexação ou ranqueamento]

### Melhorias Recomendadas
[Lista priorizada de otimizações com impacto esperado]

### O que está bom
[Lista do que já está implementado corretamente]

### Ações Imediatas (< 30 min)
[Quick wins que podem ser implementados agora]
```
