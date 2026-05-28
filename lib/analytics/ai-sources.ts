import type { Ga4Source } from "@/types/analytics";

/**
 * Classificador de fontes de IA.
 * Identifica se uma fonte (formato "source / medium" do GA4) é uma IA conhecida
 * e retorna o nome amigável da IA.
 */
const AI_HOSTS: Record<string, string> = {
  // OpenAI
  "chatgpt.com": "ChatGPT",
  "chat.openai.com": "ChatGPT",
  "openai.com": "ChatGPT",

  // Anthropic
  "claude.ai": "Claude",
  "anthropic.com": "Claude",

  // Perplexity
  "perplexity.ai": "Perplexity",
  "www.perplexity.ai": "Perplexity",

  // Google
  "gemini.google.com": "Gemini",
  "bard.google.com": "Gemini",

  // Microsoft
  "copilot.microsoft.com": "Copilot",
  "copilot.com": "Copilot",
  "bing.com/chat": "Copilot",

  // Outras
  "you.com": "You.com",
  "phind.com": "Phind",
  "meta.ai": "Meta AI",
  "duckduckgo.com/chat": "DuckDuckGo AI",
  "kagi.com": "Kagi",
  "groq.com": "Groq",
  "x.com/i/grok": "Grok",
  "grok.com": "Grok",
};

export interface AiSourceClassification {
  isAi: boolean;
  aiName: string | null;
}

/**
 * Recebe a label do GA4 (formato "source / medium") e retorna se é IA.
 */
export function classifyAiSource(label: string): AiSourceClassification {
  if (!label) return { isAi: false, aiName: null };
  const lower = label.toLowerCase();
  for (const [host, name] of Object.entries(AI_HOSTS)) {
    if (lower.includes(host)) {
      return { isAi: true, aiName: name };
    }
  }
  return { isAi: false, aiName: null };
}

export interface AiSourceBreakdown {
  totalUsers: number;
  totalSessions: number;
  pctOfTotal: number;
  byAi: { name: string; users: number; sessions: number; pctOfTotal: number }[];
  rawSources: Ga4Source[];
}

/**
 * Agrega fontes de IA num breakdown único.
 */
export function buildAiBreakdown(
  topSources: Ga4Source[],
  allSourcesTotalUsers: number,
  allSourcesTotalSessions: number
): AiSourceBreakdown {
  const aiSources = topSources.filter((s) => classifyAiSource(s.label).isAi);

  const byAiMap = new Map<string, { users: number; sessions: number }>();
  for (const src of aiSources) {
    const { aiName } = classifyAiSource(src.label);
    if (!aiName) continue;
    const existing = byAiMap.get(aiName) ?? { users: 0, sessions: 0 };
    existing.users += src.users;
    existing.sessions += src.sessions;
    byAiMap.set(aiName, existing);
  }

  const totalUsers = aiSources.reduce((s, src) => s + src.users, 0);
  const totalSessions = aiSources.reduce((s, src) => s + src.sessions, 0);

  const byAi = Array.from(byAiMap.entries())
    .map(([name, { users, sessions }]) => ({
      name,
      users,
      sessions,
      pctOfTotal:
        allSourcesTotalSessions > 0
          ? parseFloat(((sessions / allSourcesTotalSessions) * 100).toFixed(1))
          : 0,
    }))
    .sort((a, b) => b.users - a.users);

  return {
    totalUsers,
    totalSessions,
    pctOfTotal:
      allSourcesTotalSessions > 0
        ? parseFloat(((totalSessions / allSourcesTotalSessions) * 100).toFixed(1))
        : 0,
    byAi,
    rawSources: aiSources,
  };
}
