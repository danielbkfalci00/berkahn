/**
 * Tiras de tela de uma página inteira, rolando de verdade.
 *
 * Por que existe: o painel de navegador embutido não compõe quadro enquanto o
 * Lenis está animando, então screenshot de página com scroll suave sai branco.
 * Este script roda o Chromium de fora, usa a RODA DO MOUSE (scrollTo é revertido
 * pelo Lenis) e espera o lerp assentar entre um quadro e outro.
 *
 * Foi com ele que a auditoria de 2026-09-07 achou o corte de parede pintando por
 * cima do texto e o circuito do aço fechando fora da tela. Nenhum dos dois
 * aparecia na leitura do código.
 *
 * Uso:  node scripts/ui/tiras.mjs <pasta-de-saida> [url] [perfil]
 * Requer o Chromium do Playwright disponível (npx playwright install chromium).
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const URL = process.argv[3] ?? "http://localhost:3113/sustentabilidade";
const PROFILE_FILTER = process.argv[4];

fs.mkdirSync(OUT, { recursive: true });

const todosOsPerfis = [
  { nome: "desktop-1440", width: 1440, height: 900, passo: 780, max: 22 },
  { nome: "desktop-1366", width: 1366, height: 700, passo: 590, max: 28 },
  { nome: "desktop-1024", width: 1024, height: 640, passo: 530, max: 32 },
  { nome: "mobile", width: 390, height: 844, passo: 720, max: 22 },
];
const perfis = PROFILE_FILTER === "states"
  ? []
  : PROFILE_FILTER
    ? todosOsPerfis.filter((perfil) => perfil.nome === PROFILE_FILTER)
    : todosOsPerfis;

if (PROFILE_FILTER && PROFILE_FILTER !== "states" && perfis.length === 0) {
  throw new Error(`perfil desconhecido: ${PROFILE_FILTER}`);
}

const browser = await chromium.launch();

for (const perfil of perfis) {
  const ctx = await browser.newContext({
    viewport: { width: perfil.width, height: perfil.height },
    deviceScaleFactor: 1,
    locale: "pt-BR",
  });
  // Define o consentimento antes da hidratação. Esperar o botão aparecer torna
  // a captura dependente do timer de 1,5 s do provider e deixa o banner gravado
  // nos primeiros quadros em máquinas mais lentas.
  await ctx.addInitScript(() => {
    localStorage.setItem(
      "berkahn-cookie-consent",
      JSON.stringify({ level: "necessary", version: "1.0", timestamp: Date.now() })
    );
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  if (await page.getByRole("button", { name: "Apenas necessários" }).count()) {
    throw new Error(`${perfil.nome}: banner de cookies ainda visível`);
  }

  const alturaTotal = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${perfil.nome}: ${alturaTotal}px de altura`);

  for (let i = 0; i < perfil.max; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    const arquivo = path.join(OUT, `${perfil.nome}-${String(i).padStart(2, "0")}-y${y}.png`);
    await page.screenshot({ path: arquivo });
    if (y + perfil.height >= alturaTotal - 8) break;
    // Roda do mouse, não scrollTo: o Lenis reverte scroll programático.
    await page.mouse.wheel(0, perfil.passo);
    // lerp 0.12 precisa de tempo para assentar antes do próximo quadro.
    await page.waitForTimeout(1100);
  }

  await ctx.close();
}

// O estado sem motion e o HTML sem hidratação precisam mostrar as transições
// no estado final: pedreira exposta e parede aberta e colorida. Capturas focadas
// deixam essa regressão visível no mesmo comando usado pela auditoria principal.
for (const estado of PROFILE_FILTER && PROFILE_FILTER !== "states" ? [] : [
  { nome: "reduced-motion", context: { reducedMotion: "reduce" } },
  { nome: "sem-javascript", context: { javaScriptEnabled: false } },
]) {
  const ctx = await browser.newContext({
    viewport: { width: 1024, height: 640 },
    deviceScaleFactor: 1,
    locale: "pt-BR",
    ...estado.context,
  });
  if (estado.nome !== "sem-javascript") {
    await ctx.addInitScript(() => {
      localStorage.setItem(
        "berkahn-cookie-consent",
        JSON.stringify({ level: "necessary", version: "1.0", timestamp: Date.now() })
      );
    });
  }
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
  await page.locator("#extracao").scrollIntoViewIfNeeded();
  await page.waitForTimeout(estado.nome === "sem-javascript" ? 800 : 1800);
  await page.screenshot({ path: path.join(OUT, `${estado.nome}-extracao-1024x640.png`) });
  await page.locator("#parede").scrollIntoViewIfNeeded();
  await page.waitForTimeout(estado.nome === "sem-javascript" ? 800 : 1800);
  await page.screenshot({ path: path.join(OUT, `${estado.nome}-parede-1024x640.png`) });
  await ctx.close();
}

await browser.close();
console.log("pronto:", OUT);
