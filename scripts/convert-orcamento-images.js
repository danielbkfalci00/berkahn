const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'Docs', 'Orçamento', 'Imagens');
const DEST_DIR = path.join(__dirname, '..', 'public', 'images', 'orcamento');

// Create destination directory if it doesn't exist
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  console.log(`Created directory: ${DEST_DIR}\n`);
}

async function convertOrcamentoImages() {
  console.log('Iniciando conversão de imagens de orçamento...\n');

  // === ESTRUTURA LSF ===
  const estruturaLsfSource = path.join(SOURCE_DIR, 'estrutura-lsf.webp');
  const estruturaLsfDest = path.join(DEST_DIR, 'estrutura-lsf.webp');

  if (fs.existsSync(estruturaLsfSource)) {
    if (!fs.existsSync(estruturaLsfDest)) {
      fs.copyFileSync(estruturaLsfSource, estruturaLsfDest);
      console.log('✓ Estrutura LSF copiada (já está em WebP)');
    } else {
      console.log('✓ Estrutura LSF já existe no destino');
    }
  } else {
    console.log('✗ Estrutura LSF não encontrada em:', estruturaLsfSource);
  }

  // === CHALÉ PROTÓTIPOS (2 fotos) ===
  const chalePrototiposSource = path.join(SOURCE_DIR, 'Chalé-retangulo');

  const prototipImages = [
    { from: 'chale-prototipo-1.jpeg', to: 'chale-prototipo-1.webp', quality: 85 },
    { from: 'chale-prototipo-2.jpeg', to: 'chale-prototipo-2.webp', quality: 85 },
  ];

  for (const { from, to, quality } of prototipImages) {
    const sourcePath = path.join(chalePrototiposSource, from);
    const destPath = path.join(DEST_DIR, to);

    if (fs.existsSync(sourcePath)) {
      try {
        await sharp(sourcePath).webp({ quality }).toFile(destPath);
        const sourceSize = fs.statSync(sourcePath).size / 1024;
        const destSize = fs.statSync(destPath).size / 1024;
        const reduction = ((1 - destSize / sourceSize) * 100).toFixed(1);
        console.log(`✓ ${from} → ${to} (${reduction}% redução: ${sourceSize.toFixed(0)}KB → ${destSize.toFixed(0)}KB)`);
      } catch (err) {
        console.log(`✗ Erro ao converter ${from}:`, err.message);
      }
    } else {
      console.log(`✗ ${from} não encontrado em:`, chalePrototiposSource);
    }
  }

  // === PLANTAS BAIXAS (2 imagens) ===
  const plantasImages = [
    { from: 'planta baixa 1.png', to: 'chale-planta-01.webp', quality: 90 },
    { from: 'planta baixa 2.png', to: 'chale-planta-02.webp', quality: 90 },
  ];

  console.log('\n--- PLANTAS BAIXAS ---');
  for (const { from, to, quality } of plantasImages) {
    const sourcePath = path.join(chalePrototiposSource, from);
    const destPath = path.join(DEST_DIR, to);

    if (fs.existsSync(sourcePath)) {
      try {
        await sharp(sourcePath).webp({ quality }).toFile(destPath);
        const sourceSize = fs.statSync(sourcePath).size / 1024;
        const destSize = fs.statSync(destPath).size / 1024;
        const reduction = ((1 - destSize / sourceSize) * 100).toFixed(1);
        console.log(`✓ ${from} → ${to} (${reduction}% redução: ${sourceSize.toFixed(0)}KB → ${destSize.toFixed(0)}KB)`);
      } catch (err) {
        console.log(`✗ Erro ao converter ${from}:`, err.message);
      }
    } else {
      console.log(`✗ ${from} não encontrado em:`, chalePrototiposSource);
    }
  }

  // === ELEVAÇÕES (4 imagens) ===
  const elevacoesImages = [
    { from: 'elevacao-norte.png', to: 'chale-elevacao-norte.webp', quality: 90 },
    { from: 'elevacao-sul.png', to: 'chale-elevacao-sul.webp', quality: 90 },
    { from: 'elevacao-leste.png', to: 'chale-elevacao-leste.webp', quality: 90 },
    { from: 'elevacao oeste.png', to: 'chale-elevacao-oeste.webp', quality: 90 },
  ];

  console.log('\n--- ELEVAÇÕES ---');
  for (const { from, to, quality } of elevacoesImages) {
    const sourcePath = path.join(chalePrototiposSource, from);
    const destPath = path.join(DEST_DIR, to);

    if (fs.existsSync(sourcePath)) {
      try {
        await sharp(sourcePath).webp({ quality }).toFile(destPath);
        const sourceSize = fs.statSync(sourcePath).size / 1024;
        const destSize = fs.statSync(destPath).size / 1024;
        const reduction = ((1 - destSize / sourceSize) * 100).toFixed(1);
        console.log(`✓ ${from} → ${to} (${reduction}% redução: ${sourceSize.toFixed(0)}KB → ${destSize.toFixed(0)}KB)`);
      } catch (err) {
        console.log(`✗ Erro ao converter ${from}:`, err.message);
      }
    } else {
      console.log(`✗ ${from} não encontrado em:`, chalePrototiposSource);
    }
  }

  console.log('\n✓ Conversão de imagens de orçamento concluída!');
  console.log(`\nImagens salvas em: ${DEST_DIR}`);

  // List all files in destination
  const files = fs.readdirSync(DEST_DIR);
  console.log(`\nArquivos no destino (${files.length}):`, files.join(', '));
}

convertOrcamentoImages().catch(console.error);
