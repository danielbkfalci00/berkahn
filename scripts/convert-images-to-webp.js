const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToConvert = [
  'public/images/Services/Projetos prontos/casa_campo/casa-campo-moderna.png',
  'public/images/Services/Projetos prontos/casa_campo/casa-campo-moderna-2.png',
  'public/images/Services/Projetos prontos/loft/loft-urbano.png',
];

async function convertToWebP() {
  for (const imgPath of imagesToConvert) {
    const outputPath = imgPath.replace('.png', '.webp');

    console.log(`Converting: ${imgPath}`);

    await sharp(imgPath)
      .webp({ quality: 85 }) // 85% quality mantém visual excelente
      .toFile(outputPath);

    const originalSize = fs.statSync(imgPath).size;
    const newSize = fs.statSync(outputPath).size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  WebP: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Reduction: ${reduction}%\n`);
  }
}

convertToWebP()
  .then(() => console.log('✅ Conversion complete!'))
  .catch(err => console.error('❌ Error:', err));
