const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GALLERY_DIR = path.join(__dirname, '../public/images/galeria');
const QUALITY = 82; // Qualidade WebP (0-100)

async function convertToWebP() {
  console.log('🖼️  Iniciando conversão de imagens para WebP...\n');

  const files = fs.readdirSync(GALLERY_DIR).filter(f => f.endsWith('.jpg'));

  if (files.length === 0) {
    console.log('❌ Nenhum arquivo .jpg encontrado na pasta galeria');
    return;
  }

  console.log(`📁 Encontradas ${files.length} imagens para converter\n`);

  let totalOriginal = 0;
  let totalWebP = 0;

  for (const file of files) {
    const inputPath = path.join(GALLERY_DIR, file);
    const outputPath = path.join(GALLERY_DIR, file.replace('.jpg', '.webp'));

    try {
      const originalSize = fs.statSync(inputPath).size;

      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const webpSize = fs.statSync(outputPath).size;
      const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);

      totalOriginal += originalSize;
      totalWebP += webpSize;

      console.log(`✅ ${file} → ${file.replace('.jpg', '.webp')} (-${reduction}%)`);
    } catch (err) {
      console.error(`❌ Erro ao converter ${file}:`, err.message);
    }
  }

  const totalReduction = ((1 - totalWebP / totalOriginal) * 100).toFixed(1);
  const originalMB = (totalOriginal / 1024 / 1024).toFixed(2);
  const webpMB = (totalWebP / 1024 / 1024).toFixed(2);

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumo da conversão:`);
  console.log(`   Original: ${originalMB} MB`);
  console.log(`   WebP:     ${webpMB} MB`);
  console.log(`   Redução:  ${totalReduction}%`);
  console.log('='.repeat(50));
  console.log('\n✨ Conversão concluída!');
}

convertToWebP().catch(console.error);
