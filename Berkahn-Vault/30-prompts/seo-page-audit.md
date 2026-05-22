---
description: Auditar SEO e AEO de uma pagina especifica do site Berkahn
---

Leia a estratégia SEO/AEO em `.claude/context/seo-aeo-strategy.md`.

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
