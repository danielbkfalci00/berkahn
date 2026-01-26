const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'Docs', 'Identidade Visual', 'preo_liso_png.png');
const DEST_DIR = path.join(__dirname, '..', 'public', 'images', 'logo');
const DEST = path.join(DEST_DIR, 'berkahn-logo.webp');

async function convertLogo() {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
    console.log(`Created directory: ${DEST_DIR}\n`);
  }

  console.log('Converting logo to WebP...\n');

  try {
    await sharp(SOURCE)
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(DEST);

    const sourceSize = fs.statSync(SOURCE).size / 1024;
    const destSize = fs.statSync(DEST).size / 1024;
    const reduction = ((1 - destSize / sourceSize) * 100).toFixed(1);

    console.log(`✓ Logo convertida com sucesso!`);
    console.log(`  Origem: ${sourceSize.toFixed(0)}KB`);
    console.log(`  Destino: ${destSize.toFixed(0)}KB`);
    console.log(`  Redução: ${reduction}%`);
    console.log(`\n✓ Salva em: ${DEST}`);
  } catch (error) {
    console.error('✗ Erro ao converter logo:', error.message);
    process.exit(1);
  }
}

convertLogo();
