---
tipo: context
criado: 2025-12-15
atualizado: 2026-05-21
tags:
  - ai/context
  - project/site
  - project/blog
  - domain/architecture
ai_summary: Comparativo da infraestrutura de blog Berkahn (Next.js + Supabase + componentes interativos) vs WordPress equivalente. Material de pitch para usuários WordPress entenderem o sistema atual e o que precisariam para replicar.
status: active
escopo: berkahn
---

# Como Replicar o Blog da Berkahn no WordPress

> [!info] Migração para vault
> Migrado de `Docs/site/infraestrutura-blog-wordpress-vs-berkahn.md`. Stack técnico em [[stack-nextjs-supabase]]. Pipeline editorial em [[article-pipeline]].

**Para quem é esse documento?**
Para você, que usa WordPress e quer entender como é a infraestrutura de blog da Berkahn — com gráficos interativos, tabelas, FAQs, calculadoras e muito mais — e descobrir se é possível fazer algo parecido no seu site.

Não precisa saber programar para ler isso. Cada termo técnico tem uma explicação simples no [Glossário](#glossario) no final do documento.

---

## Índice

1. [Como funciona o blog da Berkahn hoje](#parte-1)
2. [Como funciona o WordPress](#parte-2)
3. [Comparação: o que é igual e o que é diferente](#parte-3)
4. [Os 3 caminhos para replicar essa estrutura](#parte-4)
5. [Qual caminho escolher?](#parte-5)
6. [Glossário](#glossario)

---

<a name="parte-1"></a>
## Parte 1 — Como funciona o blog da Berkahn hoje

### A ideia geral

Imagine que um artigo de blog é como um **documento com partes especiais**. Tem o texto normal (palavras, frases, parágrafos), mas no meio do texto tem "marcadores" que dizem: "aqui entra um gráfico", "aqui entra uma tabela comparativa", "aqui entra uma calculadora interativa".

A Berkahn construiu um sistema que interpreta esses marcadores e, na hora que o visitante abre o artigo no navegador, substitui cada marcador pelo componente visual correspondente.

---

### As três peças principais

O blog da Berkahn é construído sobre três peças que trabalham juntas:

#### Peça 1: O banco de dados (Supabase)

Todos os artigos ficam guardados em um **banco de dados na nuvem** chamado Supabase. Cada artigo é como uma linha em uma planilha gigante, com colunas como:

| Campo | O que guarda |
|-------|-------------|
| `título` | O título do artigo |
| `slug` | O endereço na URL (ex: `/normas-light-steel-frame`) |
| `conteúdo` | O texto do artigo com os marcadores |
| `componentes` | Os dados dos gráficos, tabelas, FAQs, etc. |
| `capa` | O endereço da imagem de capa |
| `status` | Se está publicado, rascunho ou arquivado |
| `SEO` | Títulos e descrições para aparecer no Google |

A parte mais importante é essa separação: o **texto** fica em um lugar, e os **dados dos componentes visuais** ficam em outro. Eles se conectam pelos marcadores.

#### Peça 2: O motor (Next.js + React)

O site da Berkahn é construído com uma tecnologia chamada **Next.js**, que funciona como um motor que monta as páginas. Junto com ele, existe o **React**, que é a linguagem usada para criar os componentes visuais.

Quando alguém acessa um artigo:
1. O motor busca o artigo no banco de dados
2. Lê o texto e encontra os marcadores
3. Para cada marcador, monta o componente visual com os dados correspondentes
4. Entrega a página pronta para o visitante

#### Peça 3: A biblioteca de componentes

A Berkahn tem mais de 24 componentes visuais prontos para usar nos artigos. Pense neles como "blocos especiais" que podem ser inseridos em qualquer artigo. Alguns exemplos:

| Componente | O que faz |
|------------|-----------|
| Gráfico (`[CHART]`) | Gráfico de barras, linhas, pizza ou radar, com hover interativo |
| Tabela (`[TABLE]`) | Tabela comparativa com destaque de colunas |
| Estatísticas (`[STATS]`) | Números grandes com animação de contagem |
| FAQ (`[FAQ]`) | Perguntas e respostas em acordeão, com dados para o Google |
| Linha do tempo (`[TIMELINE]`) | Cronologia de etapas com ícones |
| Calculadora (`[CALCULATOR]`) | Calculadora dinâmica (ex: custo por m²) |
| Antes e depois (`[BEFOREAFTER]`) | Slider de imagem comparando dois estados |
| Mitos e verdades (`[MYTHS]`) | Cards que revelam a verdade ao clicar |
| Normas técnicas (`[NORMS]`) | Lista de normas ABNT com descrições |
| Download (`[RESOURCES]`) | Botão para baixar PDF ou material |
| Vídeo (`[VIDEO]`) | Embed de YouTube ou Vimeo |
| CTA (`[CTA]`) | Botão de chamada para ação personalizado |

---

### Como um artigo é criado e publicado

O processo funciona assim:

```
1. Escritor redige o texto em Markdown (formato simples de texto)
2. No texto, insere os marcadores onde quer os componentes
   Exemplo: "Veja os dados abaixo:\n\n[CHART:grafico-comparativo]"
3. Define os dados dos componentes (números do gráfico, linhas da tabela, etc.)
4. Um script envia tudo para o banco de dados Supabase
5. O artigo fica disponível no site em segundos
```

---

### O sistema de marcadores (placeholders)

Esse é o coração do sistema. No texto do artigo, em vez de colocar o gráfico diretamente, você escreve um código simples:

```
[CHART:grafico-comparativo-custos]
```

Isso diz ao motor: "quando você chegar nessa linha, procure nos dados do artigo o gráfico chamado `grafico-comparativo-custos` e mostre ele aqui."

Os dados desse gráfico ficam guardados separadamente no banco, mais ou menos assim:

```json
{
  "charts": [
    {
      "id": "grafico-comparativo-custos",
      "tipo": "barra",
      "título": "Custo por m² — Comparativo",
      "dados": [
        { "nome": "Alvenaria", "valor": 2400 },
        { "nome": "Steel Frame", "valor": 1800 }
      ]
    }
  ]
}
```

Essa separação permite que o mesmo componente de gráfico seja reutilizado em qualquer artigo, com dados diferentes em cada um.

---

<a name="parte-2"></a>
## Parte 2 — Como funciona o WordPress

### O que é o WordPress

O WordPress é o sistema de gerenciamento de conteúdo (CMS) mais popular do mundo. Ele é gratuito, de código aberto, e funciona em praticamente qualquer servidor. Cerca de 43% de todos os sites do mundo usam WordPress.

Diferente do sistema da Berkahn que foi construído do zero com tecnologias modernas, o WordPress é uma plataforma pronta com muita coisa já inclusa.

---

### Como o WordPress guarda os artigos

O WordPress usa um banco de dados chamado **MySQL** (que fica no seu servidor de hospedagem). Cada artigo fica guardado na tabela `wp_posts`, com campos como:

| Campo | O que guarda |
|-------|-------------|
| `post_title` | Título |
| `post_content` | Todo o conteúdo (HTML ou blocos) |
| `post_status` | Publicado, rascunho, etc. |
| `post_date` | Data de publicação |

O ponto importante: no WordPress, o **conteúdo visual fica junto com o texto**. Quando você insere uma tabela no editor, o código HTML da tabela entra diretamente no campo `post_content`. Não existe a separação de "texto aqui, dados visuais ali" que a Berkahn usa.

---

### O editor Gutenberg

Desde 2018, o WordPress usa um editor chamado **Gutenberg**, que funciona com o conceito de **blocos**. Cada parágrafo, cada imagem, cada vídeo é um bloco independente que você pode arrastar e reorganizar.

Blocos nativos do WordPress incluem:
- Parágrafo, Título, Lista
- Imagem, Galeria, Vídeo
- Tabela básica
- Botão, Separador
- Colunas, Grupo

Para ter recursos avançados (gráficos interativos, calculadoras, FAQs com Schema.org), você precisa instalar **plugins** que adicionam blocos extras.

---

### Plugins — a maior força do WordPress

Um **plugin** é uma extensão que adiciona funcionalidades ao WordPress. Existem mais de 59.000 plugins no repositório oficial. Isso significa que quase tudo que você imaginar já tem um plugin pronto.

A lógica é: se a Berkahn construiu um componente de FAQ do zero, você pode instalar um plugin de FAQ que faz algo parecido.

A diferença está no **grau de controle**: os componentes da Berkahn foram desenhados com a identidade visual exata da empresa, com animações específicas, e integrados num sistema único. Plugins de WordPress são genéricos e podem exigir customização visual.

---

### Temas — a aparência do site

O **tema** controla a aparência geral do site. Existem milhares de temas gratuitos e pagos. Temas mais avançados (como os que usam construtores de página como Elementor ou Divi) permitem construir layouts complexos sem programar.

---

### Hospedagem

O WordPress precisa de um servidor para funcionar. Existem empresas de hospedagem que oferecem planos específicos para WordPress, como Hostgator, WP Engine, Kinsta, SiteGround, entre outras.

---

<a name="parte-3"></a>
## Parte 3 — Comparação: o que é igual e o que é diferente

| Função | Berkahn (Next.js + Supabase) | WordPress |
|--------|------------------------------|-----------|
| **Onde os artigos ficam** | Banco de dados na nuvem (Supabase) | Banco de dados no servidor (MySQL) |
| **Como se edita o conteúdo** | Arquivo de texto + script de publicação | Editor visual com blocos (Gutenberg) |
| **Gráficos interativos** | Componente React customizado (Recharts) | Plugin (ex: Visualizer, wpDataTables) |
| **Tabelas comparativas** | Componente React com destaque de coluna | Plugin TablePress ou bloco nativo |
| **FAQ com dados para o Google** | Componente com Schema.org embutido | Plugin Ultimate FAQ ou Yoast SEO |
| **Calculadora dinâmica** | Componente React com fórmulas | Plugin Calculated Fields Form |
| **Antes e depois (slider)** | Componente BeforeAfter customizado | Plugin Twenty20 Image Before-After |
| **Linha do tempo animada** | Componente Timeline com animações | Plugin Timeline ou bloco de terceiro |
| **Velocidade de carregamento** | Muito rápida (página pré-renderizada) | Variável (depende de plugins e hosting) |
| **SEO técnico** | Configurado na base do sistema | Plugin Yoast SEO ou Rank Math |
| **Identidade visual unificada** | 100% customizado para a marca | Depende do tema e customização |
| **Custo para editar um artigo** | Requer suporte técnico | Qualquer pessoa consegue usar |
| **Adicionar novas funcionalidades** | Requer desenvolvedor React | Muitas vezes tem plugin pronto |
| **Escala (muitos artigos)** | Excelente | Bom (com hospedagem adequada) |

---

### O que o WordPress consegue replicar bem

- **Texto rico**: parágrafos, títulos, negrito, links, listas — idêntico
- **Imagens**: upload e exibição de imagens com qualidade igual
- **Tabelas simples**: o plugin TablePress é excelente
- **FAQs em acordeão**: vários plugins fazem isso bem
- **SEO técnico**: Yoast SEO ou Rank Math cobrem bem
- **Galeria de imagens**: recurso nativo já funciona
- **Vídeos incorporados**: recurso nativo já funciona

---

### O que é mais difícil de replicar no WordPress

- **Gráficos com a mesma identidade visual e animações** — plugins genéricos existem, mas a aparência vai diferir do restante do site
- **Sistema de placeholders unificado** — no WordPress, cada componente é um bloco separado no editor, não um marcador no texto
- **Velocidade de carregamento otimizada** — Next.js é significativamente mais rápido que WordPress em condições equivalentes
- **Calculadoras com fórmulas complexas** — possível com plugins, mas com menor flexibilidade
- **Experiência visual completamente unificada** — no WordPress, cada plugin traz sua própria aparência

---

<a name="parte-4"></a>
## Parte 4 — Os 3 caminhos para replicar essa estrutura

### Caminho 1 — WordPress puro com plugins
**Nível de dificuldade:** Iniciante
**Precisa de desenvolvedor?** Não (para a maioria das funções)
**Custo estimado:** R$ 0 a R$ 500/ano em plugins

Este é o caminho mais acessível. Você mantém o WordPress que já tem e adiciona plugins para cada tipo de componente interativo.

#### Plugins recomendados para replicar os componentes da Berkahn:

| Componente Berkahn | Plugin WordPress | Versão gratuita? |
|-------------------|-----------------|-----------------|
| Gráficos | **Visualizer** ou **wpDataTables** | Sim (limitada) |
| Tabelas comparativas | **TablePress** | Sim |
| FAQ com Schema.org | **Ultimate FAQ** ou **WP Shortcode** | Sim |
| Calculadora | **Calculated Fields Form** | Sim (limitada) |
| Antes e depois | **WP Before After Image Slider** | Sim |
| Linha do tempo | **Cool Timeline** | Sim |
| Depoimentos | **Strong Testimonials** | Sim |
| Downloads de PDF | **Download Manager** | Sim |
| SEO técnico | **Yoast SEO** | Sim |
| Velocidade | **WP Rocket** ou **LiteSpeed Cache** | Não/Sim |

#### Como funciona na prática:

1. Você instala os plugins desejados
2. Cada plugin adiciona um ou mais blocos novos no editor Gutenberg
3. Ao escrever um artigo, você insere esses blocos onde quiser
4. Configura os dados diretamente no editor (sem precisar de script)

#### Vantagens:
- Você mesmo consegue fazer, sem programador
- Editor visual intuitivo
- Grande comunidade de suporte
- Rápido de implementar

#### Limitações:
- Cada plugin tem sua própria aparência visual — vai parecer "colcha de retalhos" se não houver um tema coeso
- Muitos plugins podem deixar o site lento
- Menos flexibilidade para criar experiências únicas
- Plugins podem parar de funcionar com atualizações do WordPress

---

### Caminho 2 — WordPress como CMS + frontend React (Headless)
**Nível de dificuldade:** Intermediário / Avançado
**Precisa de desenvolvedor?** Sim
**Custo estimado:** R$ 5.000 a R$ 20.000 para desenvolver

Este é o "melhor dos dois mundos" para quem quer a experiência de edição do WordPress com a qualidade visual e técnica da Berkahn.

#### Como funciona:

O WordPress continua existindo, mas você o usa apenas como **painel de administração para escrever e organizar os artigos**. O site em si que o visitante vê é construído com React/Next.js, exatamente como a Berkahn.

```
Você escreve no WordPress → WordPress guarda no banco de dados
                         → Site Next.js busca os dados via API
                         → Site Next.js monta a página com os componentes
                         → Visitante vê uma página rápida e interativa
```

#### O que o desenvolvedor precisaria fazer:

1. Instalar o plugin **WPGraphQL** ou usar a **WordPress REST API** para expor os dados do WordPress
2. Construir um frontend Next.js que consome esses dados
3. Criar (ou adaptar do código da Berkahn) os componentes interativos
4. Conectar tudo

#### Vantagens:
- Você continua usando o editor familiar do WordPress
- Qualidade visual e performance equivalente à Berkahn
- Total controle sobre a aparência dos componentes
- Pode usar os mesmos componentes da Berkahn como base

#### Limitações:
- Requer um desenvolvedor React/Next.js para montar o sistema
- Mais complexo para manter
- Custo inicial maior

---

### Caminho 3 — Migrar para Next.js + Supabase (do zero)
**Nível de dificuldade:** Avançado
**Precisa de desenvolvedor?** Sim, com experiência em React e Next.js
**Custo estimado:** R$ 15.000 a R$ 50.000+ dependendo do escopo

Este caminho significa abandonar o WordPress e construir um site com a mesma tecnologia que a Berkahn usa.

#### Como funciona:

O desenvolvedor constrói o site do zero usando:
- **Next.js** como motor do site
- **Supabase** como banco de dados
- **React** para os componentes interativos
- **Tailwind CSS** para o design

Pode usar o código da Berkahn como referência e base, adaptando para a identidade visual da sua marca.

#### Vantagens:
- Resultado idêntico ao que a Berkahn tem
- Performance máxima (páginas muito rápidas)
- Flexibilidade total para qualquer funcionalidade
- SEO técnico de alto nível

#### Limitações:
- Custo maior de desenvolvimento
- Dependência de desenvolvedor para todas as atualizações de conteúdo (até que um painel admin seja construído)
- Curva de aprendizado maior para a equipe

---

<a name="parte-5"></a>
## Parte 5 — Qual caminho escolher?

Use este guia rápido para decidir:

---

**"Quero melhorar meu blog sem gastar muito nem depender de ninguém"**
→ **Caminho 1** (plugins no WordPress)

Comece instalando TablePress, Ultimate FAQ e Visualizer. São gratuitos, fáceis de usar e já vão dar um salto de qualidade. A aparência não vai ser igual à Berkahn, mas o conteúdo vai ser mais rico.

---

**"Tenho orçamento para contratar um desenvolvedor e quero algo próximo da Berkahn, mas sem abandonar o WordPress"**
→ **Caminho 2** (WordPress Headless)

Procure um desenvolvedor com experiência em Next.js. Explique que você quer usar o WordPress como CMS mas ter um frontend moderno. Esse é o meio-termo mais inteligente para quem já tem muito conteúdo no WordPress e não quer perder o histórico.

---

**"Quero exatamente o que a Berkahn tem, do jeito que está"**
→ **Caminho 3** (Next.js + Supabase do zero)

Procure um desenvolvedor ou agência com experiência em Next.js e Supabase. O custo é maior, mas o resultado é o mais próximo possível da infraestrutura da Berkahn. Se tiver acesso ao código da Berkahn, compartilhe com o desenvolvedor — ele pode usar como referência e reduzir bastante o tempo de desenvolvimento.

---

### Comparativo rápido dos 3 caminhos

| | Caminho 1 | Caminho 2 | Caminho 3 |
|-|-----------|-----------|-----------|
| **Precisa de dev?** | Não | Sim | Sim |
| **Custo** | Baixo | Médio | Alto |
| **Resultado visual** | Bom | Muito bom | Excelente |
| **Performance** | Média | Muito boa | Excelente |
| **Tempo para lançar** | Dias | Semanas | Meses |
| **Facilidade de edição** | Alta | Alta | Média |
| **Similaridade com Berkahn** | Baixa | Alta | Muito alta |

---

<a name="glossario"></a>
## Glossário

**API**
Uma "ponte" que permite que dois sistemas conversem. O WordPress pode expor seus dados via API para que um frontend Next.js os consuma.

**Banco de dados**
Um sistema que guarda informações de forma organizada. O WordPress usa MySQL; a Berkahn usa Supabase.

**CMS (Content Management System)**
Sistema de gerenciamento de conteúdo. É o painel onde você escreve e organiza os artigos. WordPress e Supabase com painel admin são exemplos.

**Componente**
Um "bloco visual" reutilizável. Um gráfico de barras, uma tabela, uma FAQ — cada um é um componente que pode aparecer em vários artigos.

**CSS**
A linguagem que define a aparência visual de um site: cores, tamanhos, espaçamentos, animações.

**Editor Gutenberg**
O editor de artigos atual do WordPress, que funciona com blocos. Lançado em 2018.

**Headless CMS**
Quando o painel de administração (como o WordPress) é separado do site que o visitante vê. O painel guarda o conteúdo; o frontend (Next.js) exibe ele.

**Hospedagem**
O servidor onde o site fica guardado e acessível na internet.

**HTML**
A linguagem básica das páginas web. Define a estrutura do conteúdo.

**ISR (Incremental Static Regeneration)**
Técnica do Next.js que mantém as páginas muito rápidas mas permite atualizar o conteúdo sem reconstruir o site inteiro.

**JSON**
Um formato de dados simples, parecido com uma lista ou planilha, usado para guardar informações estruturadas como os dados de um gráfico.

**Markdown**
Um formato de texto simples onde você escreve `**negrito**` para ficar em negrito, `# Título` para criar um título, etc. É fácil de aprender e escrever.

**MySQL**
O banco de dados usado pelo WordPress. Fica no servidor de hospedagem.

**Next.js**
Um motor para construir sites e aplicativos web modernos, que usa React. É o que a Berkahn usa.

**PHP**
A linguagem de programação usada pelo WordPress no servidor.

**Placeholder / Marcador**
Um código no texto (como `[CHART:id]`) que o sistema substitui por um componente visual na hora de exibir a página.

**Plugin**
Uma extensão que adiciona funcionalidades ao WordPress. Como instalar um aplicativo no celular.

**React**
Uma biblioteca JavaScript para criar componentes visuais interativos. É a "linguagem" usada para construir os componentes da Berkahn.

**Schema.org / Dados Estruturados**
Um padrão de marcação que ajuda o Google a entender o conteúdo do site. FAQs com Schema.org aparecem expandidas nos resultados do Google.

**SEO (Search Engine Optimization)**
Otimização para mecanismos de busca. Técnicas que ajudam o site a aparecer melhor no Google.

**SSG (Static Site Generation)**
Técnica onde as páginas são geradas com antecedência, tornando o carregamento muito rápido.

**Supabase**
Um banco de dados moderno na nuvem (baseado em PostgreSQL) que a Berkahn usa para guardar os artigos.

**Tailwind CSS**
Uma biblioteca de CSS que facilita criar estilos visuais de forma rápida e consistente.

**Tema (WordPress)**
O conjunto de arquivos que define a aparência geral do site WordPress: layout, cores, tipografia.

**TypeScript**
Uma versão mais rigorosa do JavaScript que ajuda a evitar erros no código.

---

*Documento preparado com base na análise da infraestrutura da Berkahn — maio de 2026.*
