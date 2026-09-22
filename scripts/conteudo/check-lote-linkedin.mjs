// Verificador de LOTE para posts do LinkedIn.
//
// Por que ele existe: o check-linkedin.mjs avalia um post por vez e, por
// construcao, nao consegue ver formula. Em 2026-09-05 dez posts escritos em
// paralelo passaram nos 21 criterios individuais com exit 0 e mesmo assim sete
// deles abriam o CTA com verbo em primeira pessoa do plural anunciando o
// artefato (Reescrevemos, Levantamos, Reunimos, Montamos, Abrimos, Montamos,
// Atualizamos). O prompt calibrado proibe exatamente isso: "uma pessoa lendo
// cinco posts seguidos da Berkahn nao pode identificar uma formula repetitiva".
// O gate individual saia 0 no texto com formula e no texto sem, entao o verde
// dele nunca foi evidencia sobre esse defeito.
//
// Uso:
//   node scripts/conteudo/check-lote-linkedin.mjs <arquivo.txt> [arquivo.txt ...]
//   node scripts/conteudo/check-lote-linkedin.mjs --dir=scripts/.cache --glob=li-
//
// Sai 0 se o conjunto passa, 1 se ha formula.

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let arquivos = args.filter((a) => !a.startsWith('--'));
const dirArg = args.find((a) => a.startsWith('--dir='));
const globArg = args.find((a) => a.startsWith('--glob='));
if (dirArg) {
  const dir = dirArg.slice(6);
  const prefixo = globArg ? globArg.slice(7) : '';
  arquivos = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.txt') && f.startsWith(prefixo))
    .map((f) => path.join(dir, f));
}
if (arquivos.length < 3) {
  console.error('este verificador precisa de pelo menos 3 posts; formula so existe no conjunto');
  process.exit(2);
}

const posts = arquivos.map((f) => {
  const bruto = fs.readFileSync(f, 'utf8');
  const corpo = bruto
    .replace(/^https?:\/\/\S+$/gm, '')
    .replace(/^#\S.*$/gm, '')
    .trim();
  const paras = corpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return {
    nome: path.basename(f),
    hook: paras[0] ?? '',
    cta: paras[paras.length - 1] ?? '',
  };
});

const n = posts.length;
let falhas = 0;
const L = (passou, msg) => {
  if (!passou) falhas++;
  console.log(`${passou ? '✅' : '❌'} ${msg}`);
};

console.log(`Verificando ${n} posts como conjunto.\n`);

// --- 1. abertura em pergunta -------------------------------------------
const perg = posts.map((p) => p.hook.includes('?'));
const qtdPerg = perg.filter(Boolean).length;
L(qtdPerg <= Math.ceil(n * 0.4), `aberturas em pergunta: ${qtdPerg}/${n} (maximo ${Math.ceil(n * 0.4)})`);
const seq = perg.map((x) => (x ? 'P' : '-')).join('');
L(!seq.includes('PPP'), `nunca tres perguntas seguidas (sequencia ${seq})`);

// --- 2. CTA anunciando artefato em primeira pessoa do plural ------------
// A forma proibida e "<verbo-nos> <o artefato>", que soa a comunicado interno
// quando repetida. Um ou outro no lote e variacao; metade e formula.
const VERBO_NOS = /^(Reescrevemos|Levantamos|Reunimos|Montamos|Abrimos|Atualizamos|Fizemos|Preparamos|Compilamos|Detalhamos|Organizamos|Separamos|Juntamos|Colocamos)\b/i;
const anunciam = posts.filter((p) => VERBO_NOS.test(p.cta));
L(anunciam.length <= Math.floor(n * 0.35),
  `CTAs abrindo com verbo em primeira pessoa do plural: ${anunciam.length}/${n} (maximo ${Math.floor(n * 0.35)})${anunciam.length ? ' -> ' + anunciam.map((p) => p.nome).join(', ') : ''}`);

// --- 3. primeira palavra do CTA repetida --------------------------------
const primeiras = posts.map((p) => (p.cta.split(/\s+/)[0] ?? '').replace(/[^\p{L}]/gu, '').toLowerCase());
const contPrim = {};
for (const w of primeiras) contPrim[w] = (contPrim[w] ?? 0) + 1;
const repetidas = Object.entries(contPrim).filter(([, c]) => c > Math.max(2, Math.ceil(n * 0.2)));
L(repetidas.length === 0,
  `primeira palavra do CTA sem repeticao excessiva (${Object.keys(contPrim).length} distintas em ${n})${repetidas.length ? ' -> ' + repetidas.map(([w, c]) => `"${w}" ${c}x`).join(', ') : ''}`);

// --- 4. primeira palavra do hook repetida -------------------------------
const primHook = posts.map((p) => (p.hook.split(/\s+/)[0] ?? '').replace(/[^\p{L}]/gu, '').toLowerCase());
const contHook = {};
for (const w of primHook) contHook[w] = (contHook[w] ?? 0) + 1;
const hookRep = Object.entries(contHook).filter(([, c]) => c > Math.max(2, Math.ceil(n * 0.2)));
L(hookRep.length === 0,
  `primeira palavra do hook sem repeticao excessiva (${Object.keys(contHook).length} distintas em ${n})${hookRep.length ? ' -> ' + hookRep.map(([w, c]) => `"${w}" ${c}x`).join(', ') : ''}`);

// --- 5. "no blog" como muleta -------------------------------------------
const noBlog = posts.filter((p) => /\bno blog\b/i.test(p.cta));
L(noBlog.length <= Math.ceil(n * 0.6), `"no blog" no CTA: ${noBlog.length}/${n} (e a formulacao natural, mas nao pode ser unanime)`);

// --- 6. folga de extensao ------------------------------------------------
// Post colado no teto de 180 nao aceita nenhuma edicao futura sem quebrar o
// gate individual. Isso e divida, nao defeito, entao so informa.
const palavras = arquivos.map((f, i) => {
  const corpo = fs.readFileSync(f, 'utf8').replace(/^https?:\/\/\S+$/gm, '').replace(/^#\S.*$/gm, '').trim();
  return { nome: posts[i].nome, w: corpo.split(/\s+/).filter(Boolean).length };
});
const apertados = palavras.filter((p) => p.w >= 176);
if (apertados.length) {
  console.log(`ℹ️  ${apertados.length} post(s) a 4 palavras ou menos do teto de 180: ${apertados.map((p) => `${p.nome} (${p.w})`).join(', ')}`);
  console.log('    qualquer edicao futura nesses precisa sair do proprio CTA.');
}

console.log(`\n${falhas ? `❌ ${falhas} defeito(s) de lote` : '✅ o conjunto passa'}`);
process.exit(falhas ? 1 : 0);
