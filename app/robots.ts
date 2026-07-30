import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/apresentacao-executiva/", "/etapas-da-obra/", "/institucional/"],
      },
      {
        // Crawlers de treino. Bloqueados por escolha editorial, não por
        // impacto em busca: nenhum deles decide citação.
        // Google-Extended NÃO entra aqui de propósito — ver grupo abaixo.
        userAgent: ["CCBot", "GPTBot", "ClaudeBot"],
        disallow: "/",
      },
      {
        // Bots que decidem se o site aparece em resposta de IA.
        // Google-Extended parecia ser "training-only" e estava bloqueado até
        // 2026-07-30. Não é: ele governa o grounding do app Gemini e do
        // Vertex AI, e bloqueá-lo não protege de AI Overviews (quem manda ali
        // é o Googlebot) nem afeta ranking. O bloqueio custava visibilidade
        // na plataforma que mais cresceu em 2026 sem nenhuma contrapartida.
        userAgent: [
          "OAI-SearchBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
      },
      {
        // Fetchers on-demand: buscam a página quando um usuário pergunta algo.
        // Já cairiam no curinga; explícitos para não dependerem dele.
        userAgent: ["ChatGPT-User", "Claude-User", "Perplexity-User"],
        allow: "/",
      },
    ],
    sitemap: "https://www.berkahn.com.br/sitemap.xml",
  };
}
