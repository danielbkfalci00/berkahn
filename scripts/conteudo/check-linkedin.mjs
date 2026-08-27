// Confere um texto de post do LinkedIn contra as regras do prompt calibrado
// Berkahn-Vault/30-prompts/linkedin-post.md (LOCKED) antes de gravar na pauta.
//
// Uso:
//   node scripts/conteudo/check-linkedin.mjs <arquivo.txt>
//
// O arquivo deve conter o post inteiro como vai para o LinkedIn: corpo, a URL
// numa linha própria e as hashtags na última linha. A contagem de palavras
// exclui URL e hashtags, como o prompt manda.
//
// Sai 0 quando tudo passa e 1 quando algo falha, então serve de gate.
//
// Por que existe: o prompt é longo e as regras se acumularam por calibragem.
// Conferir de cabeça falha, e falhou em produção mais de uma vez. Nenhum script
// do repositório cobria isso: `vault-validate.mjs` valida frontmatter de nota e
// `conteudo/pauta.mjs` só grava no quadro.

import fs from 'node:fs';

const arquivo = process.argv[2];
if (!arquivo) {
  console.error('uso: node scripts/conteudo/check-linkedin.mjs <arquivo.txt>');
  process.exit(2);
}

const raw = fs.readFileSync(arquivo, 'utf8');
const corpo = raw
  .replace(/^https?:\/\/\S+$/gm, '')
  .replace(/^#\S.*$/gm, '')
  .trim();

let falhas = 0;
const L = (passou, msg) => {
  if (!passou) falhas++;
  console.log(`${passou ? '✅' : '❌'} ${msg}`);
};

// --- extensão e forma ---------------------------------------------------
const palavras = corpo.split(/\s+/).filter(Boolean).length;
L(palavras >= 100 && palavras <= 180, `extensão: ${palavras} palavras (100 a 180, alvo 110 a 140)`);

const paragrafos = corpo.split(/\n\s*\n/).filter(Boolean);
L(paragrafos.length <= 6, `parágrafos: ${paragrafos.length} (máx 6)`);

// --- copy-sem-travessao e formatação ------------------------------------
L(!/[—–]/.test(corpo), 'sem travessão nem meia-risca');
L(!/ - /.test(corpo), 'sem hífen como separador');
L(!/^\s*[-*•]/m.test(corpo), 'sem bullets no corpo');
L(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(corpo), 'sem emoji');
L(!/:\s*$/m.test(corpo), 'sem dois pontos como recurso estilístico');

// --- terminologia LSF ----------------------------------------------------
L(corpo.includes('Light Steel Frame'), 'Light Steel Frame por extenso na primeira menção');
const soltos = [...corpo.matchAll(/Steel Frame/g)]
  .filter((m) => corpo.slice(Math.max(0, m.index - 6), m.index) !== 'Light ');
L(soltos.length === 0, `sem "Steel Frame" solto no corpo (${soltos.length})`);

// --- vícios de linguagem -------------------------------------------------
L(!/Na Berkahn, a gente/.test(corpo), 'sem a muleta "Na Berkahn, a gente"');
L(!/^\s*(E|Mas)\s/m.test(corpo), 'sem E ou Mas abrindo parágrafo');
L(!/[Nn]ão é .{1,45}[,.] é |deixa de ser .{1,45} e vira |mais do que .{1,30}, é /.test(corpo),
  'sem o padrão "não é X, é Y"');
L(!/Você sabia|Nos últimos anos|Vamos falar sobre|quase ninguém|genuinamente|honestamente/i.test(corpo),
  'sem clichê de IA');
L(!/E você[,?]/i.test(corpo), 'sem convite vazio de opinião');
L(!/incrível|revolucionári|game changer|divisor de águas/i.test(corpo), 'sem superlativo vazio');

// --- ritmo ---------------------------------------------------------------
// Duas curtas seguidas no mesmo parágrafo soam a manifesto.
const paragrafosSuspeitos = paragrafos.filter(
  (p) => p.split(/[.!?]/).filter((s) => s.trim() && s.trim().split(/\s+/).length <= 5).length >= 2
);
L(paragrafosSuspeitos.length === 0,
  `sem sequência de frases curtas dramáticas (${paragrafosSuspeitos.length} parágrafo(s))`);

// Uma frasezinha de impacto por parágrafo passava pela regra acima e quebrava o
// storytelling do mesmo jeito. Apontado pelo Bruno em 2026-08-25, depois de dois
// posts entregues com esse ritmo.
const frases = corpo.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const impacto = frases.filter((s) => s.split(/\s+/).filter(Boolean).length <= 6);
L(impacto.length === 0,
  impacto.length === 0
    ? 'sem frase de impacto solta (nenhuma com 6 palavras ou menos)'
    : `${impacto.length} frase(s) de impacto: ${impacto.map((s) => JSON.stringify(s)).join('  ')}`);

// --- hashtags e UTM ------------------------------------------------------
const tags = (raw.match(/^#\S.*$/m) || [''])[0].split(/\s+/).filter(Boolean);
L(tags.length >= 3 && tags.length <= 5 && tags.includes('#LightSteelFrame'),
  `hashtags (${tags.length}): ${tags.join(' ') || 'nenhuma'}`);

const url = (raw.match(/^https?:\/\/\S+$/m) || [''])[0];
L(Boolean(url), url ? 'URL do artigo em linha própria' : 'URL do artigo ausente');
L(url.includes('utm_source=linkedin') && url.includes('utm_medium=social')
  && url.includes('utm_campaign=post-organico'), 'UTM na convenção do vault');

// --- informativo, não bloqueia ------------------------------------------
const numeros = corpo.match(/R\$ [\d.]+|\d+(,\d+)?%|\d+ (m²|metros|mil)/g) || [];
console.log(`ℹ️  densidade numérica: ${numeros.length} em ${palavras} palavras${numeros.length ? ' — ' + numeros.join(', ') : ''}`);

console.log(falhas === 0 ? '\n✅ passou em tudo' : `\n❌ ${falhas} checagem(ns) falhou(ram)`);
process.exit(falhas === 0 ? 0 : 1);
