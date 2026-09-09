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
 * Uso:  node scripts/ui/tiras.mjs <pasta-de-saida> [url]
 * Requer o Chromium do Playwright disponível (npx playwright install chromium).
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const URL = process.argv[3] ?? "http://localhost:3113/sustentabilidade";

fs.mkdirSync(OUT, { recursive: true });

const perfis = [
  { nome: "desktop", width: 1440, height: 900, passo: 780, max: 22 },
  { nome: "mobile", width: 390, height: 844, passo: 720, max: 22 },
];

const browser = await chromium.launch();

for (const perfil of perfis) {
  const ctx = await browser.newContext({
    viewport: { width: perfil.width, height: perfil.height },
    deviceScaleFactor: 1,
    locale: "pt-BR",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });

  // Banner de cookies fora do caminho, na opção que preserva privacidade.
  const botao = page.getByRole("button", { name: "Apenas necessários" });
  if (await botao.count()) {
    await botao.first().click();
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(2500);

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

await browser.close();
console.log("pronto:", OUT);
