/**
 * Mede altura e espaço morto de cada seção de uma página.
 *
 * Devolve, por seção, a altura total e quanto sobra em cima e embaixo do
 * conteúdo real. Marca com "<<< folga" a seção onde o vazio passa de 55% da
 * altura da janela. Foi assim que a auditoria de 2026-09-07 mostrou que
 * `py-2xl md:py-3xl` aplicado em seis seções custava ~2.700px de nada.
 *
 * Uso:  node scripts/ui/medir-secoes.mjs [url]
 * Requer o Chromium do Playwright disponível (npx playwright install chromium).
 */

import { chromium } from "playwright";

const URL = process.argv[3] ?? process.argv[2] ?? "http://localhost:3113/sustentabilidade";
const browser = await chromium.launch();

for (const perfil of [
  { nome: "desktop", width: 1440, height: 900 },
  { nome: "mobile", width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: perfil.width, height: perfil.height } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
  const b = page.getByRole("button", { name: "Apenas necessários" });
  if (await b.count()) { await b.first().click(); await page.waitForTimeout(500); }
  await page.waitForTimeout(2000);

  const dados = await page.evaluate(() => {
    const alvo = document.querySelectorAll("main > section, main > div > section, section");
    const vistos = new Set();
    const linhas = [];
    for (const sec of alvo) {
      if (vistos.has(sec)) continue;
      vistos.add(sec);
      const r = sec.getBoundingClientRect();
      const topo = r.top + window.scrollY;
      // Caixa que envolve todo o texto e imagem visíveis da seção.
      let min = Infinity, max = -Infinity;
      sec.querySelectorAll("h1,h2,h3,p,li,img,svg,figure").forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.height === 0 || b.width === 0) return;
        min = Math.min(min, b.top + window.scrollY);
        max = Math.max(max, b.bottom + window.scrollY);
      });
      if (min === Infinity) continue;
      linhas.push({
        id: sec.id || sec.className.split(" ").slice(0, 2).join("."),
        altura: Math.round(r.height),
        vazioTopo: Math.round(min - topo),
        vazioBase: Math.round(topo + r.height - max),
      });
    }
    return { total: Math.round(document.documentElement.scrollHeight), linhas };
  });

  console.log(`\n=== ${perfil.nome} (${perfil.width}px) · página ${dados.total}px ===`);
  console.log("seção".padEnd(26), "altura".padStart(8), "vazio topo".padStart(12), "vazio base".padStart(12));
  for (const l of dados.linhas) {
    const marca = l.vazioTopo + l.vazioBase > perfil.height * 0.55 ? "  <<< folga" : "";
    console.log(
      String(l.id).slice(0, 26).padEnd(26),
      String(l.altura).padStart(8),
      String(l.vazioTopo).padStart(12),
      String(l.vazioBase).padStart(12),
      marca
    );
  }
  await ctx.close();
}

await browser.close();
