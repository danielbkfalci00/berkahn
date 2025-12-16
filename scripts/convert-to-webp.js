const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 85; // 85% de qualidade (ideal para web)

const images = [
  // Pré Obra
  'public/images/Services/Execução-de-obras/Pre-obra/pre-obra-1.jpg',
  'public/images/Services/Execução-de-obras/Pre-obra/pre-obra-2.jpg',

  // Terraplanagem
  'public/images/Services/Execução-de-obras/Terraplanagem/terraplanagem_1.JPG',
  'public/images/Services/Execução-de-obras/Terraplanagem/terraplanagem_2.png',

  // Estrutura
  'public/images/Services/Execução-de-obras/Estrutura/estrutura-1.jpg',
  'public/images/Services/Execução-de-obras/Estrutura/estrutura-2.webp',

  // Acabamentos
  'public/images/Services/Execução-de-obras/Acabamentos/acabamentos_1.jpg',
  'public/images/Services/Execução-de-obras/Acabamentos/acabamentos_2.jpg',

  // Steel Frame
  'public/images/Services/comercial.jpeg',
  'public/images/Services/industrial.jpg'
];

async function convertToWebP(imagePath) {
  const parsedPath = path.parse(imagePath);
  const outputPath = path.join(parsedPath.dir, parsedPath.name + '.webp');

  try {
    await sharp(imagePath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const originalSize = fs.statSync(imagePath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`✓ ${parsedPath.base} → ${parsedPath.name}.webp (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Erro em ${imagePath}:`, error.message);
  }
}

(async () => {
  console.log('🔄 Convertendo imagens para WebP...\n');

  for (const image of images) {
    await convertToWebP(image);
  }

  console.log('\n✅ Conversão concluída!');
})();
