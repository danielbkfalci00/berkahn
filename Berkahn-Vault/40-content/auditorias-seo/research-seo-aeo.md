---
tipo: pesquisa
criado: 2026-02-15
atualizado: 2026-05-22
tags:
  - project/site
  - project/blog
  - status/active
  - source/manual
  - domain/seo
ai_summary: Blueprint SEO+AEO 2026 para sites React. SSR não é opcional — AI crawlers (GPTBot, ClaudeBot, PerplexityBot) não executam JS. Googlebot limite 2MB. AI Overviews em 60%+ buscas US. AI-referred traffic converte 14.2% vs 2.8% Google orgânico. Foundation para [[seo-aeo-strategy]].
status: active
projeto: seo-aeo
projetos_relacionados:
  - seo-aeo
  - site
  - blog
  - pesquisas
data_pesquisa: 2026-02-15
---

> Migrado de `Docs/SEO & AEO/research_SEO_AEO.md` em 2026-05-22 (Sprint 1.6). Base teórica dos diagnósticos. Hub: [[seo-aeo]] · [[pesquisas]]. Ver também: [[llms-txt]] (veredito sobre o arquivo llms.txt — este blueprint não o cobre).

# SEO and AEO blueprint for React sites in 2026

**Server-side rendering is no longer optional—it is the single most important architectural decision for both Google and AI visibility.** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) cannot execute JavaScript at all, meaning a client-rendered React SPA is invisible to every AI search system despite ranking on Google. Meanwhile, Google's own Googlebot reduced its file size limit from 15 MB to **2 MB** in February 2026, AI Overviews appear in over 60% of US searches, and AI-referred traffic converts at **14.2%** versus Google organic's 2.8%. For a São Paulo construction company built on React, the path forward demands Next.js on Vercel with SSG/ISR, structured data layered across every page, and content engineered at the passage level for both Google and generative AI extraction.

---

## Next.js on Vercel is the only serious React SEO architecture

Google uses a two-phase indexing system: raw HTML fetch followed by a render queue using headless Chrome. Martin Splitt confirmed in 2025 that 99% of pages render within minutes, but AI crawlers—GPTBot, ClaudeBot, PerplexityBot—see **only raw HTML**. A CSR React SPA can rank #1 on Google while being completely invisible to ChatGPT, Perplexity, and Claude. GPTBot traffic grew **305% year-over-year**, and AI bots now account for 4.2% of all HTML page requests. SSR is essential not just for Google but for AI discoverability.

Next.js versus Vite+React is not a close contest for SEO. Next.js provides built-in SSR/SSG/ISR per page, a native Metadata API with `generateMetadata()`, file-based `sitemap.ts` and `robots.ts` conventions, React Server Components that send zero JavaScript for content, `next/image` with automatic AVIF/WebP optimization, and built-in OG image generation via `opengraph-image.tsx`. Vite is CSR-only by default, requiring manual setup for SSR and third-party libraries for every SEO feature Next.js provides natively. For any SEO-critical site, **Next.js is the only defensible choice**.

The rendering strategy should match each page type. Static pages (about, services, portfolio) use SSG for maximum speed. Blog posts use SSG with ISR fallback—pre-render existing posts at build time, generate new posts on first request, and revalidate on-demand via Supabase webhooks. The homepage uses ISR with hourly revalidation. Service area landing pages use SSG. Search results and filtered pages use SSR. Private dashboards use CSR since they don't need indexing. Next.js's Partial Prerendering (PPR), now in advanced preview, combines static shells delivered instantly from the edge with dynamic content streamed via Suspense boundaries—this will likely become the default rendering model.

Core Web Vitals thresholds remain unchanged (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1) but are now enforced more strictly. Google's March 2026 core update elevated CWV from a tiebreaker to a **ranking filter**—poor performance can prevent even high-quality content from ranking. INP, which replaced FID in March 2024, is the most commonly failed metric, with **43% of sites exceeding the 200ms threshold**. For React apps, the critical optimizations are: use `React.startTransition()` for non-urgent state updates, break long tasks with `scheduler.yield()`, minimize DOM complexity, use `next/image` with the `priority` prop for LCP elements, self-host fonts with `font-display: swap`, and defer non-critical scripts with `next/script strategy="lazyOnload"`. Competitive sites target sub-2s LCP rather than the 2.5s threshold.

---

## How AI systems select sources to cite—and how to win

AI platforms use Retrieval-Augmented Generation (RAG), not traditional ranking. ChatGPT breaks each prompt into **~8.5 sub-queries**, searches web indexes, splits retrieved pages into 50–150 word passages, converts them to vectors, and scores for relevance. Only **2–7 domains** are cited per response. Your content competes at the passage level, not the page level.

The Princeton GEO study (KDD 2024, 10,000 queries) identified the three most effective strategies, each boosting visibility **30–40%**: citing credible sources within your content, including expert quotes, and adding quantitative data. Keyword stuffing *decreased* visibility by 10%. The combination of fluency optimization plus statistics addition outperformed any single strategy by 5.5%.

Several structural patterns dramatically increase citation probability. **44.2% of ChatGPT citations come from the first 30% of page content**—the "ski ramp" pattern. Content must lead with answers, not build toward them. Self-contained passages of **50–150 words** receive 2.3x more citations. Critically, **91% of cited passages contained zero internal links**—links inside extractable paragraphs disrupt AI extraction. Pages with **20,000+ characters** average 10.18 citations versus thin content. Comparison tables increase citations by **32.5%**. Strict heading hierarchies (H1→H2→H3) appear in 68.7% of cited pages.

Each AI platform behaves differently. **ChatGPT** (70% of AI search market) uses Google's search index via SerpAPI; content not indexed by Google is unlikely to appear. **Perplexity** runs its own crawler, with Reddit accounting for 46.5% of citations, and averages 5 cited sources per answer—more than any other platform. **Google AI Overviews** previously drew 76.1% of citations from Google's top 10, but after the January 2026 Gemini 3 upgrade, that correlation dropped to **38%**, opening significant opportunity for newer content. **Claude** uses Brave Search for retrieval and gives a **1.7x citation boost** to content that acknowledges limitations or trade-offs. Only **11% of domains** are cited by both ChatGPT and Perplexity, meaning each platform requires distinct optimization.

Brand authority matters more than backlinks for AI visibility. Brand mentions have a **0.664 correlation with AI visibility**—3x stronger than backlinks. Digital PR is the single most powerful lever: **85% of AI brand mentions originate from third-party sources**. For a construction company, getting listed in ENR, Construction Dive, local business journals, and "Top Contractors in São Paulo" lists directly drives AI citations.

---

## Technical SEO essentials for the Next.js stack

### Robots.txt with granular AI crawler control

A critical 2025–2026 development is the three-tier bot framework. OpenAI, Anthropic, and Google now separate training bots from search bots. The strategic approach: **block training bots** (GPTBot, ClaudeBot, Google-Extended) to prevent content absorption into model training, while **allowing search bots** (OAI-SearchBot, Claude-SearchBot, PerplexityBot) so content gets cited with attribution. Next.js App Router supports native `app/robots.ts`:

```typescript
// Allow search bots, block training bots
rules: [
  { userAgent: 'OAI-SearchBot', allow: ['/'] },
  { userAgent: 'Claude-SearchBot', allow: ['/'] },
  { userAgent: 'PerplexityBot', allow: ['/'] },
  { userAgent: 'GPTBot', disallow: ['/'] },
  { userAgent: 'ClaudeBot', disallow: ['/'] },
  { userAgent: 'Google-Extended', disallow: ['/'] },
]
```

### JSON-LD structured data across every page

Schema markup boosts AI Overview selection by **73%**, and FAQPage schema earns a **41% citation rate versus 15% without**. For a construction company, implement a `@graph` connecting multiple schema types per page: `GeneralContractor` (using the `HomeAndConstructionBusiness` hierarchy), `Organization`, `BreadcrumbList`, `Service` schemas on service pages, `Article`/`BlogPosting` with full author entities on blog posts, `FAQPage` on any Q&A section, and `HowTo` for process content. While Google deprecated HowTo rich results in September 2023, the schema still provides significant value for AI systems that parse structured data.

Every Article schema must include a complete author entity—`Person` with `name`, `jobTitle`, `url`, and `sameAs` linking to LinkedIn. Adding visible author credentials lifts AI citation rates by **40%** across ChatGPT, Perplexity, and AI Overviews. Use `@id` references to connect entities into a cohesive knowledge graph. Keep `dateModified` current—AI systems strongly prefer fresh data, and content not updated quarterly loses citations at **3x the normal rate**.

### Meta tags, canonicals, and Open Graph

Next.js auto-generates charset and viewport tags. Title tags should stay within **50–60 characters** with the primary keyword near the beginning, using the template system (`%s | Brand Name`). Meta descriptions should be **150–160 characters** with target keywords included for bold SERP display. Set `metadataBase` in the root layout so relative canonical URLs resolve correctly. Every page needs a self-referencing canonical via `alternates.canonical` in `generateMetadata()`.

Open Graph images should be **1200 × 630 pixels** (1.91:1 ratio), under 300 KB. Next.js supports dynamic OG image generation via `opengraph-image.tsx` files in route directories, rendering branded images with post titles, categories, and company branding at the edge. These are cached at the CDN after first generation.

### Sitemap and indexing

Generate dynamic sitemaps via `app/sitemap.ts`, querying Supabase for all published posts. Cap each file at 50,000 URLs. Reference the sitemap in robots.txt and submit to Google Search Console. For Bing/Yandex, implement **IndexNow**—80 million+ websites now use it, handling 5 billion daily URL submissions. Google still doesn't support IndexNow; rely on XML sitemaps plus the Search Console URL Inspection API for Google indexing.

---

## Blog architecture for maximum SEO and AI value

### Subpath, not subdomain

Use `/blog` as a subpath of the main domain, never a subdomain. Backlinko's analysis of 11.8 million Google results found subdirectories consistently outperform subdomains. HotPads saw a **98% traffic increase** after migrating from blog.hotpads.com to /blog. Subdirectories consolidate domain authority, share link equity, simplify technical management, and AI retrieval models better understand hierarchy with subdirectory paths.

### Content structure engineered for extraction

Every blog post should follow the "answer-first" pattern: a direct answer in the first 150 words, a definition paragraph before the first H2, then expanded context. Each H2/H3 section should function as a standalone "answer passage"—a self-contained statement of 50–150 words that AI can extract independently. Use question-format headings that mirror user queries. End each section with a clear takeaway. Include 5–10 FAQs at the bottom with FAQPage schema.

Heading hierarchy must be strict: one H1 per page, H2s for major sections, H3s for subsections, never skipping levels. Include the primary keyword naturally in the H1 and secondary keywords in H2s. Maintain at least **3 contextual internal links per post** with descriptive, keyword-rich anchor text. Link new posts to relevant older posts and update older posts to reference new content. Keep important pages within 3 clicks of the homepage.

### Topic clusters for construction content

Clustered content receives **3.2x more AI citations** than standalone posts and drives **30–43% more organic traffic**. Google officially uses "topic authority" as a ranking factor. Structure clusters around pillar pages covering broad topics (3,000+ words) with 10–20 cluster posts targeting specific subtopics, all cross-linked.

For a São Paulo construction company, high-value content types are:

- **Cost guides** ("Quanto custa construir uma casa em São Paulo 2026"): specific price ranges, factor breakdowns, material comparisons. These are extremely citable—AI systems extract specific numbers directly.
- **Material comparisons** ("Telhado metálico vs. telhas cerâmicas"): structured tables with cost, durability, maintenance, lifespan. Comparison tables increase citations by 32.5%.
- **Permit and regulatory guides**: São Paulo-specific building requirements, step-by-step permit processes, code compliance checklists.
- **Case studies with metrics**: "Completed 500m² warehouse in 14 weeks, R$200K under budget." Before/after with measurable outcomes.
- **How-to guides** with HowTo schema: "Como escolher uma construtora confiável em SP."

---

## Local SEO for a construction company in São Paulo

### Google Business Profile as the foundation

Complete profiles receive **70% more visits** and appear **18x more often** in search results. Use "Construtora" or "Empreiteira" as the primary category, with up to 9 secondary categories matching your service pages (Construção Residencial, Reforma, Engenharia Civil). For construction companies operating at client sites without a public office, set up as a Service Area Business (SAB) with a **20–30 km radius** from base of operations. Upload photos from different job sites with geographic EXIF data—Google reads this to verify service areas. Post at least twice weekly with project updates, before/after shots, and service-specific content mentioning São Paulo neighborhoods.

The Q&A feature has been replaced by **"Ask Maps" powered by Gemini AI**, which generates answers from your profile, website, and reviews. This makes comprehensive FAQ content on your website critical—the AI pulls from it directly.

### Brazilian citations and directories

Build citations across these tiers: **Tier 1** (essential)—Google Business Profile, Facebook, Bing Places, Apple Maps; **Tier 2** (important Brazilian directories)—Apontador (23M+ listings, Brazil's leading local search), GuiaMais, TeleListas, Yelp Brasil, Foursquare; **Tier 3** (industry-specific)—Habitissimo.com.br, ConstruaFácil, ObraCerta; **Tier 4** (professional)—LinkedIn, Instagram (critical for visual construction content in Brazil), YouTube, WhatsApp Business. Maintain **exact NAP consistency** across all platforms, using the same business name (matching CNPJ registration), international phone format (+55 11 XXXX-XXXX), and address format including complemento.

Register with **CREA-SP** (engineering council) and **Sinduscon-SP** (construction industry union) for industry authority signals. These institutional links carry significant weight for both Google and AI systems evaluating E-E-A-T.

### Review strategy

Target **40–100+ Google reviews** for São Paulo metro competition. Use Google's review request QR codes (rolled out late 2025) on project completion documents, business cards, and WhatsApp follow-ups. Coach clients to mention specific services and neighborhoods: "A equipe fez uma reforma excelente no nosso apartamento na Vila Mariana" ranks better than "Ótimo serviço, recomendo." Respond to every review within 24–48 hours, naturally incorporating service keywords and location names.

### Portuguese language considerations

Use a **.com.br domain** for maximum local relevance. Set `<html lang="pt-BR">` on all pages. Write in Brazilian Portuguese (never European Portuguese—significant vocabulary differences). Use informal "você" as standard for São Paulo digital content. Over **80% of Brazilian searches are mobile**, making mobile optimization non-negotiable. WhatsApp dominates communication—include WhatsApp contact prominently and optimize for WhatsApp sharing.

---

## Supabase blog backend built for SEO

### Database schema with SEO fields

Store blog content as **Markdown in PostgreSQL TEXT columns**—lightweight, no vendor lock-in, and easily rendered server-side with `react-markdown` or `next-mdx-remote`. The posts table should include dedicated SEO fields: `seo_title` (title tag override), `description` (meta description), `slug` (unique, URL-friendly), `canonical_url`, `og_image_url`, `noindex` boolean, `published_at` and `updated_at` timestamps. Use a `post_status` enum ('draft', 'published', 'archived') with a CHECK constraint ensuring published posts always have a `published_at` timestamp. Add a generated `tsvector` column for full-text search with weighted ranking (title weight 'A', description weight 'B', content weight 'C').

Enable Row Level Security with public read policies filtering by `status = 'published'`, ensuring draft content never leaks to search engines.

### ISR with Supabase webhook revalidation

Use **time-based ISR as a safety net** (`revalidate: 3600`) combined with on-demand revalidation triggered by Supabase Database Webhooks. Create a webhook in Supabase Dashboard that fires on INSERT, UPDATE, DELETE on the posts table, pointing to an API route that calls `revalidatePath('/blog/${slug}')`, `revalidatePath('/blog')`, `revalidatePath('/sitemap.xml')`, and `revalidateTag('blog-posts')`. Authenticate webhooks with a secret header.

Use React's `cache()` function to deduplicate Supabase queries between `generateMetadata()` and the page component—both call `getPost(slug)` but the actual database query executes only once per request. Use `supabase-js` (REST API via PostgREST) rather than direct Postgres connections from Vercel—this eliminates connection pooling complexity entirely. Fetch data in parallel with `Promise.all()` to avoid waterfall requests.

### Dynamic sitemap and RSS from Supabase

Generate sitemaps via `app/sitemap.ts` querying all published, non-noindex posts from Supabase. Generate RSS feeds via `app/feed.xml/route.ts`—Google accepts RSS feeds as sitemaps, DEV.to and Hashnode can auto-import from RSS, and LLM training pipelines commonly consume RSS feeds, increasing AI discoverability. Add RSS auto-discovery to root layout metadata with `alternates.types['application/rss+xml']`.

---

## E-E-A-T as the universal filter for both Google and AI

E-E-A-T has evolved from a quality guideline into a **citation filter**—**96% of Google AI Overview citations** go to sources with strong E-E-A-T signals. Google's March 2026 core update amplified the "Experience" signal above all others. For a construction company, this means:

**Experience**: Include real project photos, before/after metrics, proprietary cost benchmarks, measurable outcomes ("Completed in 14 weeks, R$200K under budget"), and screenshots of actual work processes. Generic content without first-hand evidence sees citation rates fall sharply.

**Expertise**: Every blog post needs Article JSON-LD with a full author entity. Author pages should list CREA registration, certifications, years of experience, and link to LinkedIn via `sameAs`. Include the author's `jobTitle` ("Engenheiro Civil" / "Arquiteto") in schema.

**Authoritativeness**: Earn mentions in industry publications, local business journals (Folha de S.Paulo, Estadão), and "Top Construtoras em São Paulo" lists. **85% of AI brand mentions originate from third-party sources.** Brand search volume is the strongest predictor of LLM citations, with a 0.334 correlation—outweighing backlinks.

**Trustworthiness**: Display CREA/CONFEA registration numbers, insurance information, LGPD compliance notices, and Código de Defesa do Consumidor adherence. Cite credible sources within your content—paradoxically, citing others makes you more likely to be cited. Include "Last Updated" dates on every page.

---

## Conclusion

The 2026 SEO landscape has bifurcated into two parallel discovery systems that share the same fundamental requirements. Google's traditional search and AI-powered answer engines both reward server-rendered HTML, structured data, authoritative content, and fast performance—but AI systems add a critical new dimension: passage-level extractability. The architecture decision is clear: **Next.js on Vercel with SSG/ISR, Supabase as the content backend, and on-demand revalidation via webhooks**. Every page needs JSON-LD structured data in a connected `@graph`. Content must lead with answers in the first 150 words, structure every section as a standalone 50–150 word extractable passage, and include original data, expert quotes, and comparison tables. For a São Paulo construction company specifically, cost guides with real numbers, material comparisons in structured tables, and project case studies with measurable outcomes are the highest-value content types. The three-tier AI crawler framework demands granular robots.txt configuration: allow search bots for citations, block training bots for content protection. And local SEO fundamentals—Google Business Profile, consistent NAP across Brazilian directories, geo-tagged project photos, and Portuguese-language review generation—remain the foundation on which all other optimization builds.