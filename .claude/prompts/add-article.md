# 🚀 Adicionar Artigo ao Blog - Prompt Único

> **Copie este prompt + seu artigo em markdown → IA faz todo o resto**

---

```
🎯 IMPLEMENTAR ARTIGO NO BLOG BERKAHN

Analise o artigo markdown abaixo e execute TUDO automaticamente:

1. **ANÁLISE E METADADOS** (você define):
   - Extraia o título do H1
   - Gere slug amigável (lowercase, hifens)
   - Crie excerpt vendedor (150-200 chars)
   - Escolha categoria: [Tecnologia | Sustentabilidade | Projetos | Mercado | Guias]
   - Extraia 3-5 tags relevantes do conteúdo
   - Calcule tempo de leitura (~200 palavras/min)
   - Decida se deve ser featured (true/false)
   - Sugira caminho para imagem de capa
   - **meta_title** (≤60 chars, keyword nos primeiros 30 chars)
     - ✅ "Steel Frame: Custo por m² em 2026 | Berkahn"
     - ❌ "Berkahn: tudo sobre o custo do steel frame"
   - **meta_description** (150-160 chars, keyword + proposta de valor + CTA implícito)
   - **answer_summary** (80-120 palavras — campo AEO mais importante):
     - Primeira frase = resposta direta à pergunta principal do artigo
     - 1-2 dados quantitativos com contexto ("40% mais rápido, segundo NBR 15253")
     - Linguagem 100% assertiva — NUNCA: pode, talvez, possivelmente, em alguns casos, depende
     - Autossuficiente: IA deve conseguir citar sem precisar do restante do artigo

2. **COMPONENTES INTERATIVOS** (você decide):
   - Identifique onde adicionar StatsGrid, DataTable, Charts, MythBuster, etc.
   - Posicione estrategicamente para engajamento
   - Crie conteúdo dos componentes baseado no texto
   - **FAQ é OBRIGATÓRIO** (mínimo 3 perguntas):
     - Perguntas baseadas na intenção de busca ("O que é X?", "Quanto custa X?", "X vale a pena?")
     - Respostas assertivas de 2-4 frases, sem hedging
     - Posicionar `[FAQ:faq-id]` antes do `[CTA:cta-id]` final
     - Gera FAQPage schema = +41% citações por IA

3. **IMPLEMENTAÇÃO**:
   - Use Frontend Designer Skill para qualidade visual
   - Use shadcn/ui via MCP para padrões
   - Crie objeto completo com JSONB components

4. **EXECUÇÃO AUTOMÁTICA**:
   - Crie script em scripts/add-article-[slug].mjs
   - EXECUTE o script no Supabase
   - Valide inserção (status 201)
   - Confirme URL funcionando

---

**ARTIGO EM MARKDOWN**:

```markdown
[COLE SEU ARTIGO AQUI - APENAS O MARKDOWN, NADA MAIS]
```

---

**IMPORTANTE**:
- NÃO me peça para preencher metadados - VOCÊ decide tudo
- NÃO peça confirmação - execute automaticamente
- CRIE e EXECUTE o script no Supabase
- VALIDE que funcionou e me dê a URL final
```

---

## 📋 Exemplo de Uso

Você cola apenas isto:

```
🎯 IMPLEMENTAR ARTIGO NO BLOG BERKAHN

Analise o artigo markdown abaixo e execute TUDO automaticamente.

**ARTIGO EM MARKDOWN**:

```markdown
# 5 Vantagens do Steel Frame Que Você Precisa Conhecer

O Steel Frame está transformando a forma como construímos no Brasil...

## 1. Velocidade de Construção

Uma obra em Steel Frame pode ser até 30% mais rápida...

## 2. Sustentabilidade

O Steel Frame é um dos sistemas mais sustentáveis...

[... resto do artigo]
```
```

E a IA faz TODO o resto:
- Define todos os metadados
- Cria componentes interativos
- Insere no Supabase
- Te dá a URL final

**SEM você ter que preencher NADA manualmente.**
