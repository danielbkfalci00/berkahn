---
tipo: prompt
criado: 2026-04-13
atualizado: 2026-06-17
tags:
  - ai/prompt
  - ai/locked
  - project/blog
ai_summary: Prompt master de implementação de artigo (22KB, +600 linhas). Transforma markdown em artigo no blog com componentes interativos + INSERT Supabase. Usado por /artigo. SECRETS REDACTED em 2026-05-21 (linha do SERVICE_KEY agora usa process.env). 2026-06-17: passo final entrega a URL do post com UTM para LinkedIn (Fase 4.4) + URL canônica corrigida para www/atualidades.
status: locked
locked: true
versao: 1.0
calibrado_em: 2026-04-13
secrets_redacted: 2026-05-21
---

> [!warning] PROMPT CALIBRADO + SANITIZADO — NÃO ALTERAR sem permissão
> Este prompt foi sanitizado em 2026-05-21: Supabase service_role key removida da linha do SERVICE_KEY (agora `process.env.SUPABASE_SERVICE_KEY`). Ver [[supabase-config]] e [[prompts-calibrados]].

# 📝 Prompt de Implementação de Artigo - Site Berkahn

> **Objetivo**: Transformar conteúdo markdown em um artigo excepcional, interativo e memorável no blog /atualidade
>
> **Automação Completa**: Este prompt executa TODO o processo - desde análise até inserção no Supabase

---

## 🎯 CONTEXTO DO PROJETO

Este artigo faz parte do blog técnico da Berkahn, empresa especializada em Steel Frame. O público-alvo são:
- Potenciais clientes interessados em construção Steel Frame
- Arquitetos e engenheiros buscando informações técnicas
- Pessoas em fase de decisão de projeto residencial/comercial

**Diferenciais esperados**:
- Experiência visual excepcional (não apenas funcional)
- Elementos interativos que engajam o leitor
- Design que reflete a modernidade e qualidade da Berkahn
- Conteúdo que educa e inspira confiança

---

## 🚀 EXECUÇÃO AUTOMATIZADA

**IMPORTANTE**: Ao receber este prompt com um artigo, você DEVE:

1. ✅ Analisar o conteúdo e sugerir componentes interativos
2. ✅ Criar o objeto completo do artigo com componentes JSONB
3. ✅ Criar o script Node.js de inserção
4. ✅ **EXECUTAR o script** para adicionar no Supabase
5. ✅ Validar que o artigo foi inserido com sucesso
6. ✅ Fornecer a URL de acesso
7. ✅ Confirmar que aparece no grid /atualidades
8. ✅ **Ao final do output, entregar a URL do post já parametrizada com UTM** para colar direto no LinkedIn (ver Fase 4.4)

**Não peça confirmação do usuário para executar - faça tudo automaticamente.**

---

## 📋 FASE 1: PLANEJAMENTO (Multiagent Exploration)

### 1.1 Análise do Conteúdo

**Artigo fornecido**:
```markdown
[COLE O CONTEÚDO MARKDOWN AQUI]
```

**Metadados do artigo**:
- **Título**: [título completo do artigo]
- **Slug**: [url-amigavel-do-artigo]
- **Excerpt**: [resumo de 150-200 caracteres que aparecerá no card]
- **Categoria**: [escolher: Tecnologia | Sustentabilidade | Projetos | Mercado | Guias]
- **Tags**: [array de 3-5 tags relevantes]
- **Tempo de leitura**: [estimativa em minutos]
- **Featured**: [true/false - se deve aparecer em destaque]

**Imagem de capa**:
- **Caminho**: [ex: /images/blog/nome-do-artigo/cover.webp]
- **Descrição**: [descrição da imagem para alt text]
- **Dimensões recomendadas**: 1200x800px (aspect ratio 3:2)
- **Fonte/créditos**: [se aplicável]

### 1.2 Identificação de Oportunidades Interativas

Analise o conteúdo e identifique seções que podem se beneficiar de componentes interativos:

**Componentes disponíveis**:

1. **StatsGrid** - Para destacar números e estatísticas
   - Exemplo: "30% mais rápido", "50% mais sustentável"
   - Usa ícones Lucide React para visual

2. **DataTable** - Para comparações lado a lado
   - Exemplo: Steel Frame vs. Alvenaria
   - Colunas customizáveis com destaque

3. **ChartSection** - Para dados visuais
   - Tipos: bar, line, radar, pie
   - Ideal para custos, prazos, comparações

4. **MythBuster** - Para derrubar mitos comuns
   - Formato: "Mito" vs "Verdade"
   - Ícones X e Check para contraste

5. **ChecklistSection** - Para listas de verificação
   - Itens com checkmark
   - Descrições opcionais

6. **Gallery** - Para múltiplas imagens
   - Grid responsivo
   - Lightbox integrado

7. **NormsSection** - Para normas técnicas
   - Accordion colapsável
   - Ideal para NBRs, regulamentações

8. **CTA (Call-to-Action)** - Para conversão contextual ao final do artigo
   - **OBRIGATÓRIO em todo artigo** — cada artigo DEVE ter um CTA contextualizado
   - Dois modos: `dialog` (abre formulário de contato) ou `link` (navega para página)
   - `defaultSegment`: pré-seleciona "residencial" ou "comercial" no formulário
   - Copy deve ser contextual ao tema do artigo (não genérico)
   - Exemplo: artigo sobre financiamento → CTA "Consultar Financiamento" (dialog, residencial)
   - Exemplo: artigo informacional → CTA "Ver Nossos Projetos" (link, /servicos)

9. **FAQSection** - Perguntas frequentes (**OBRIGATÓRIO em todo artigo**)
   - Mínimo 3 perguntas, máximo 7
   - Perguntas baseadas na intenção de busca real ("O que é X?", "Quanto custa X?", "X vale a pena?")
   - Respostas assertivas de 2-4 frases — sem hedging ("pode ser", "talvez", "depende", "em alguns casos")
   - Cobrir dúvidas NÃO respondidas no corpo do artigo (complementar, não repetir)
   - Posicionar com `[FAQ:faq-id]` antes do `[CTA:cta-id]` final
   - **Por quê é obrigatório**: FAQPage schema = +41% taxa de citação por IA (BrightEdge 2026); cada pergunta é um alvo independente para Google AI Overviews e Perplexity

**Minhas sugestões de componentes interativos para este artigo**:
- [Descreva aqui onde e como usar cada componente]

### 1.3 Estratégia Visual

**Hierarquia de informação**:
- [Como organizar o conteúdo para melhor legibilidade]

**Elementos visuais adicionais**:
- [Infográficos, diagramas, ícones personalizados necessários]

**Tipografia e espaçamento**:
- [Seções que precisam de destaque especial]

---

## 🛠️ FASE 2: IMPLEMENTAÇÃO

### 2.1 Skills e Ferramentas Obrigatórias

**IMPORTANTE**: Esta implementação DEVE usar:

1. **Frontend Designer Skill** (`/frontend-designer`)
   - Para garantir qualidade visual excepcional
   - Atenção a detalhes de spacing, alinhamento, hierarquia
   - Animações sutis e transições suaves

2. **shadcn/ui via MCP** (`mcp__shadcn__*`)
   - Buscar exemplos de uso real dos componentes
   - Garantir consistência com design system existente
   - Usar componentes do registry @shadcn quando aplicável

### 2.2 Estrutura de Dados

O artigo será inserido no Supabase com a seguinte estrutura:

```typescript
{
  id: uuid,
  title: string,
  slug: string,
  excerpt: string,
  content: string, // Markdown base do artigo
  cover_image: string,
  category: string,
  tags: string[],
  author: "Berkahn",
  status: "published",
  published_at: timestamptz, // Now
  read_time: number,
  featured: boolean,
  meta_title: string,       // SEO: ≤60 chars, keyword-alvo nos primeiros 30 chars
                            // ✅ Correto: "Steel Frame: Custo por m² em 2026 | Berkahn"
                            // ❌ Errado:  "Berkahn: tudo sobre o custo do steel frame"
  meta_description: string, // SEO: 150-160 chars, keyword + proposta de valor + CTA implícito
                            // ✅ Exemplo: "Descubra o custo real do Steel Frame em 2026: R$ 1.800–2.400/m². Comparativo com alvenaria, cronograma e o que afeta o preço final."
  answer_summary: string,   // AEO OBRIGATÓRIO: 80-120 palavras
                            // - Primeira frase = resposta direta à pergunta principal do artigo
                            // - Incluir 1-2 dados quantitativos com contexto ("40% mais rápido, segundo NBR 15253")
                            // - Linguagem assertiva — NUNCA usar: pode, talvez, possivelmente, em alguns casos, depende
                            // - Autossuficiente: uma IA deve conseguir citar sem precisar do restante do artigo
                            // - NÃO começar com nome da empresa ou título do artigo
                            // Por quê: 44.2% das citações por IA vêm dos primeiros 30% da página
  components: jsonb // Objeto JSONB com arrays nomeados (charts, stats, tables, faqs, ctas, etc.)
}
```

**Estruturas JSONB corretas por tipo de componente**:

```json
{
  "stats": [
    {
      "id": "numeros-steel-frame",
      "title": "Steel Frame em Números",
      "stats": [
        {
          "value": 30,
          "suffix": "%",
          "label": "Mais rápido que alvenaria",
          "description": "Redução no prazo de obra"
        }
      ]
    }
  ],
```
⚠️ STATS: `value` é sempre `number` (não string). Use `suffix` para "%", "x", "m²" etc. NÃO existe campo `icon`.

```json
  "norms": [
    { "code": "NBR 16970", "title": "Light Steel Frame", "year": "2022", "description": "..." },
    { "code": "NBR 15575", "title": "Desempenho Habitacional", "year": "2021", "description": "..." }
  ],
```
⚠️ NORMS: array **flat** de objetos `{code, title, year, description}`. NÃO envolver em objeto com `id`. O renderer usa todo o array para qualquer placeholder `[NORMS:*]`.

```json
  "timelines": [
    {
      "id": "cronograma-exemplo",
      "title": "Título da Timeline",
      "milestones": [
        {
          "number": 1,
          "title": "Título longo da etapa",
          "shortTitle": "Label curto",
          "description": "Descrição detalhada da etapa.",
          "duration": "X dias"
        }
      ]
    }
  ],
```
⚠️ TIMELINE: usa `milestones` (não `steps`). Cada milestone requer `number` (int), `title`, `shortTitle` e `description`. `duration` é opcional.

```json
  "ctas": [
    {
      "id": "cta-artigo-orcamento",
  "ctas": [
    {
      "id": "cta-artigo-orcamento",
      "label": "PRÓXIMO PASSO",
      "title": "Pronto para construir com Steel Frame?",
      "description": "Solicite um orçamento personalizado.",
      "actionType": "dialog",
      "actionText": "Solicitar Orçamento",
      "defaultSegment": "residencial"
    }
  ]
}
```

**Interface ArticleCTA** (definida em `types/article.ts`):
- `id` (string) - Identificador único, corresponde ao placeholder `[CTA:id]`
- `label` (string) - Texto pequeno acima do título (e.g., "PRÓXIMO PASSO")
- `title` (string) - Título principal do CTA
- `description` (string) - Descrição/motivação
- `actionType` ("dialog" | "link") - Dialog abre formulário, link navega
- `actionText` (string) - Texto do botão
- `actionHref` (string) - URL destino (apenas para `actionType: "link"`)
- `defaultSegment` ("residencial" | "comercial" | "") - Segmento pré-selecionado no formulário

### 2.3 Checklist de Implementação

- [ ] **Conteúdo markdown formatado corretamente**
  - Headers hierarquizados (h2, h3)
  - Parágrafos bem espaçados
  - Links com contexto claro
  - Listas quando apropriado

- [ ] **Componentes interativos posicionados estrategicamente**
  - Não sobrecarregar o artigo
  - **Usar placeholders para intercalar componentes no texto** (ver seção 2.3.1)
  - Cada componente adiciona valor real

#### 2.3.1 Sistema de Placeholders para Intercalação

**IMPORTANTE**: Para posicionar componentes DURANTE o texto (não apenas no final), use placeholders no markdown:

**Sintaxe dos placeholders**:
```markdown
## Seção do artigo

Texto explicativo sobre custos...

[CHART:anatomia-preco-pronto]

Mais texto após o gráfico...

[TABLE:tabela-precos-regioes]

Continuação do texto...

[STATS:numeros-steel-frame]
```

**Placeholders disponíveis**:

**Básicos**:
- `[CHART:chart-id]` - Insere um gráfico específico (bar, line, pie, radar)
- `[TABLE:table-id]` - Insere uma tabela específica
- `[STATS:stats-id]` - Insere um grid de estatísticas
- `[CHECKLIST:checklist-id]` - Insere uma checklist
- `[MYTHS:myths-id]` - Insere seção myth-buster
- `[GALLERY:gallery-id]` - Insere galeria de imagens
- `[IMAGE:image-id]` - Insere imagem única otimizada (com lightbox opcional)
- `[NORMS:norms-id]` - Insere seção de normas técnicas
- `[VIDEO:video-id]` - Insere embed de vídeo (YouTube, Vimeo ou direto)
- `[BEFOREAFTER:beforeafter-id]` - Insere comparação visual antes/depois
- `[TIMELINE:timeline-id]` - Insere linha do tempo de cronograma
- `[FAQ:faq-id]` - Insere seção de perguntas frequentes (com schema.org)

**Engajamento**:
- `[CALCULATOR:calc-id]` - Insere calculadora dinâmica (ROI, custos, estimativas)
- `[CERTIFICATIONS:cert-id]` - Insere badges de certificações (ABNT, LEED, ISO)
- `[TESTIMONIAL:testimonial-id]` - Insere depoimentos de clientes com avaliações
- `[RESOURCES:resources-id]` - Insere biblioteca de downloads (PDFs, planilhas)

**Avançados**:
- `[COMPARISON3D:comparison-id]` - Insere comparação multidimensional com radar chart
- `[SPECSHEET:spec-id]` - Insere ficha técnica completa de materiais

**Conversão**:
- `[CTA:cta-id]` - Insere seção de Call-to-Action contextualizada (dialog ou link)

**Regras importantes**:
1. O `id` no placeholder DEVE corresponder ao `id` no objeto do componente JSONB
2. Placeholders devem estar em linhas separadas (não inline)
3. Se um componente não tiver placeholder, será renderizado no final automaticamente
4. Placeholders inválidos (id não encontrado) serão removidos silenciosamente
5. **Todo artigo DEVE ter um `[CTA:cta-id]` ao final do conteúdo** — é obrigatório para conversão

- [ ] **Imagem de capa otimizada**
  - Formato WebP — destino: `public/images/img_blog/[slug]/cover.webp`
  - Tamanho adequado (1200x800px, aspect ratio 3:2)
  - Alt text descritivo
  - Carregamento otimizado

- [ ] **Metadados SEO/AEO completos** — validar ANTES do INSERT
  - `meta_title`: ≤60 chars, keyword nos primeiros 30 chars
  - `meta_description`: 150-160 chars com keyword + proposta de valor
  - `answer_summary`: 80-120 palavras, assertivo, com dado quantitativo, sem hedging
  - `tags`: 3-5 tags preenchidas
  - `category`: uma de [Tecnologia, Sustentabilidade, Projetos, Mercado, Guias]

- [ ] **FAQ component presente** (obrigatório para FAQPage schema)
  - Mínimo 3 perguntas com respostas assertivas
  - `[FAQ:id]` posicionado antes do `[CTA:id]` no markdown

- [ ] **Links internos inseridos no markdown**
  - 3-5 links para outros artigos do blog Berkahn
  - Texto âncora descritivo: `[construção em steel frame](/atualidades/slug)` — nunca "clique aqui"

- [ ] **Responsividade testada**
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1440px)

- [ ] **Acessibilidade validada**
  - Contraste de cores adequado
  - Hierarquia semântica correta
  - Alt text em todas as imagens
  - Navegação por teclado funcional

- [ ] **Performance otimizada**
  - Imagens lazy-loaded
  - Componentes code-split quando necessário
  - Sem rerenders desnecessários

### 2.4 Script de Inserção e Execução

**OBRIGATÓRIO**: Criar E EXECUTAR o script de inserção no Supabase:

```javascript
// scripts/add-article-[slug].mjs
import https from 'https';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://YOUR-PROJECT.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '{{SUPABASE_SERVICE_KEY}}';
// SECRETS: ler de .env (gitignored). Nunca hardcodar service_role key — bypassa RLS.

const article = {
  title: "...",
  slug: "...",
  excerpt: "...",
  content: `...`,
  cover_image: "...",
  category: "...",
  tags: [...],
  author: "Berkahn",
  status: "published",
  published_at: new Date().toISOString(),
  read_time: ...,
  featured: ...,
  meta_title: "...",
  meta_description: "...",
  components: {
    // Arrays nomeados para cada tipo de componente
    stats: [...],
    charts: [...],
    tables: [...],
    // CTA OBRIGATÓRIO - cada artigo deve ter pelo menos um
    ctas: [{
      id: "cta-[slug]-orcamento",
      label: "PRÓXIMO PASSO",
      title: "...", // Contextual ao tema do artigo
      description: "...",
      actionType: "dialog", // ou "link"
      actionText: "Solicitar Orçamento",
      defaultSegment: "residencial" // ou "comercial" ou ""
    }]
  }
};

const data = JSON.stringify(article);

const options = {
  hostname: 'sfqaknxomxwmviarpwfy.supabase.co',
  path: '/rest/v1/posts',
  method: 'POST',
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const inserted = JSON.parse(responseData)[0];
      console.log('✅ Artigo inserido com sucesso!');
      console.log('📊 ID:', inserted.id);
      console.log('🔗 URL:', `https://berkahn.com.br/atualidade/${inserted.slug}`);
    } else {
      console.error('❌ Erro:', res.statusCode, responseData);
      process.exit(1);
    }
  });
});

req.on('error', e => {
  console.error('❌ Erro na requisição:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
```

**APÓS CRIAR O SCRIPT**:
1. Salvar em `scripts/add-article-[slug].mjs`
2. **EXECUTAR IMEDIATAMENTE**: `node scripts/add-article-[slug].mjs`
3. Verificar output de sucesso
4. Validar que o artigo aparece em `/atualidade`

---

## ✅ FASE 3: VALIDAÇÃO E QA

### 3.1 Checklist Visual

- [ ] **Hero do artigo**
  - Imagem de capa carrega corretamente
  - Título legível sobre a imagem
  - Categoria e tempo de leitura visíveis
  - Gradient overlay não obscurece a imagem

- [ ] **Corpo do artigo**
  - Tipografia hierárquica clara
  - Espaçamento consistente entre seções
  - Componentes interativos se destacam
  - Imagens alinhadas e com qualidade

- [ ] **Grid de artigos (/atualidade)**
  - Card renderiza corretamente
  - Imagem de capa com aspect ratio correto
  - Hover states funcionando
  - Posicionamento no masonry grid adequado

### 3.2 Testes Funcionais

- [ ] **Navegação**
  - Link do card leva para artigo correto
  - Breadcrumbs funcionando
  - Voltar para /atualidade funciona

- [ ] **Componentes interativos**
  - Animações suaves ao entrar na viewport
  - Clicks/hovers respondem corretamente
  - Dados exibidos corretamente
  - Não há erros no console

- [ ] **SEO e meta tags**
  - `og:image` configurado
  - `og:title` e `og:description` corretos
  - Schema markup se aplicável
  - Sitemap atualizado (ISR cuida disso)

### 3.3 Performance

- [ ] **Métricas Core Web Vitals**
  - LCP < 2.5s (imagem de capa otimizada)
  - FID < 100ms (componentes interativos leves)
  - CLS < 0.1 (sem layout shifts)

- [ ] **Lighthouse Score**
  - Performance > 90
  - Accessibility > 95
  - Best Practices > 90
  - SEO > 95

---

## 🚀 FASE 4: DEPLOYMENT (AUTOMATIZADO)

### 4.1 Execução Automática

**O QUE VOCÊ DEVE FAZER AUTOMATICAMENTE**:

1. **Criar o script de inserção**
   ```bash
   # Criar arquivo scripts/add-article-[slug].mjs com objeto completo
   ```

2. **Executar o script imediatamente**
   ```bash
   node scripts/add-article-[slug].mjs
   ```

3. **Validar inserção**
   ```bash
   # Verificar que retornou sucesso (status 201)
   # Confirmar ID do artigo criado
   ```

4. **Verificar no banco**
   ```bash
   node scripts/check-posts.mjs
   # Deve mostrar o novo artigo na lista
   ```

5. **Confirmar URL de acesso**
   - Dev: `http://localhost:3000/atualidade/[slug]`
   - Produção (após ISR 60s): `https://berkahn.com.br/atualidade/[slug]`

### 4.2 Checklist de Sucesso

Após executar o script, confirme:

- [x] **Script executado sem erros**
- [x] **Artigo inserido no Supabase** (ID retornado)
- [x] **Artigo aparece em check-posts.mjs** (status: published)
- [x] **URL funcionando** (localhost ou produção após ISR)
- [x] **Componentes interativos renderizando** corretamente
- [x] **Imagem de capa carregando** sem erros
- [x] **Artigo no grid /atualidade** (posição correta no masonry)

### 4.3 Output Esperado

```bash
✅ Artigo inserido com sucesso!
📊 ID: 550e8400-e29b-41d4-a716-446655440000
🔗 URL: https://www.berkahn.com.br/atualidades/nome-do-artigo
🔗 LinkedIn (UTM): https://www.berkahn.com.br/atualidades/nome-do-artigo?utm_source=linkedin&utm_medium=social&utm_campaign=post-organico

📝 Próximos passos:
1. Artigo está publicado e acessível via URL acima
2. Aguardar 60 segundos para ISR atualizar o grid /atualidades
3. Imagens de capa: certifique-se que o arquivo existe em /public
4. Deploy já acontece automaticamente via Vercel (push é opcional)
```

### 4.4 Link parametrizado para LinkedIn (entregar no final do output)

**SEMPRE** ao terminar, entregue a URL do post pronta para o LinkedIn, com os parâmetros UTM, em uma linha copiável.

- **URL canônica do post**: `https://www.berkahn.com.br/atualidades/[slug]` (com `www` e `atualidades` no plural)
- **Padrão UTM (post orgânico)**: `?utm_source=linkedin&utm_medium=social&utm_campaign=post-organico`
- **Linha final a entregar**:

```
https://www.berkahn.com.br/atualidades/[slug]?utm_source=linkedin&utm_medium=social&utm_campaign=post-organico
```

Convenção completa de UTM (outros canais, mídia paga, teste A/B com `utm_content`) documentada em [[seo-aeo-strategy]] na seção "Rastreamento de links (UTM)".

---

## 💡 EXPECTATIVAS DE QUALIDADE

**Este não é apenas mais um artigo de blog**. Cada implementação deve:

1. **Surpreender positivamente o leitor**
   - Animações sutis que encantam
   - Transições suaves entre seções
   - Micro-interações que dão feedback

2. **Educar de forma visual**
   - Não apenas texto corrido
   - Dados apresentados de forma digerível
   - Comparações visuais claras

3. **Refletir a qualidade da Berkahn**
   - Design moderno e profissional
   - Atenção aos detalhes
   - Experiência premium

4. **Performar excepcionalmente**
   - Carregamento rápido
   - Sem jank ou delays
   - Responsivo em qualquer dispositivo

5. **Ser memorável**
   - Leitor lembra do artigo depois
   - Vontade de compartilhar
   - Diferenciação da concorrência

---

## 📝 NOTAS FINAIS

- **Use o Frontend Designer Skill** para todas as decisões visuais
- **Consulte shadcn/ui via MCP** para padrões e exemplos
- **Priorize a experiência do usuário** acima de tudo
- **Teste em dispositivos reais** se possível
- **Documente decisões técnicas** no código quando necessário

---

## ✨ PROMPT DE EXECUÇÃO (Cole este template)

```
🎯 IMPLEMENTAÇÃO AUTOMATIZADA DE ARTIGO - SITE BERKAHN

Execute todo o processo seguindo `.claude/prompts/article-implementation-prompt.md`:

**FASE 1 - ANÁLISE**:
1. Analise o conteúdo markdown abaixo
2. Identifique oportunidades para componentes interativos
3. Sugira onde adicionar: StatsGrid, DataTable, ChartSection, MythBuster, ChecklistSection, Gallery, NormsSection

**FASE 2 - IMPLEMENTAÇÃO**:
1. Use Frontend Designer Skill para qualidade visual excepcional
2. Use shadcn/ui via MCP para componentes e exemplos
3. Crie objeto completo do artigo com componentes JSONB
4. Crie script Node.js em scripts/add-article-[slug].mjs

**FASE 3 - EXECUÇÃO AUTOMÁTICA**:
1. **EXECUTE o script de inserção** no Supabase
2. Valide que o artigo foi inserido (status 201)
3. Verifique com check-posts.mjs
4. Confirme URL de acesso

**FASE 4 - VALIDAÇÃO**:
1. Checklist de sucesso completo
2. URL do artigo funcionando
3. Resumo das decisões de design
4. Componentes interativos criados

---

**METADADOS**:
- Título: [título completo]
- Slug: [url-amigavel]
- Excerpt: [resumo 150-200 chars]
- Categoria: [Tecnologia/Sustentabilidade/Projetos/Mercado/Guias]
- Tags: [tag1, tag2, tag3, tag4, tag5]
- Tempo de leitura: [X minutos]
- Featured: [true/false]
- Imagem de capa: [caminho ou descrição]

**CONTEÚDO MARKDOWN**:
```markdown
[COLE SEU ARTIGO AQUI]
```

**COMPONENTES INTERATIVOS DESEJADOS** (opcional):
[Descreva onde quer stats, tabelas, gráficos, etc. Se não especificar, você decide baseado no conteúdo]

**CTA DO ARTIGO** (obrigatório — será criado automaticamente se não especificado):
- Tipo: [dialog/link]
- Segmento: [residencial/comercial/nenhum]
- Texto do botão: [ex: "Solicitar Orçamento"]
- Se link, URL destino: [ex: /servicos]

---

**IMPORTANTE**:
- NÃO PEÇA CONFIRMAÇÃO - execute tudo automaticamente
- INCLUA as credenciais do Supabase no script (já estão no código)
- EXECUTE o script imediatamente após criar
- VALIDE que funcionou antes de finalizar
```

---

**Versão**: 1.2
**Última atualização**: 2026-06-17
**Mantido por**: Equipe de Desenvolvimento Berkahn
