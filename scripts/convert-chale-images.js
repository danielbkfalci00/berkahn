const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const baseDir = process.cwd();
const sourceDir = path.join(baseDir, 'Docs', 'Orçamento', 'Imagens', 'Chalé-retangulo');
const outputDir = path.join(baseDir, 'public', 'images', 'orcamento');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const conversions = [
  // Protótipos (4 imagens)
  { input: 'chale-prototipo-1.jpeg', output: 'chale-prototipo-1.webp', quality: 85 },
  { input: 'chale-prototipo-2.jpeg', output: 'chale-prototipo-2.webp', quality: 85 },
  { input: 'chale-prototipo-3.jpeg', output: 'chale-prototipo-3.webp', quality: 85 },
  { input: 'chale-prototipo-4.jpeg', output: 'chale-prototipo-4.webp', quality: 85 },
  // Planta baixa (1 nova imagem)
  { input: 'planta baixa 1.png', output: 'chale-planta-01.webp', quality: 90 },
];

async function convert() {
  console.log('Starting image conversion...\n');

  for (const { input, output, quality } of conversions) {
    const inputPath = path.join(sourceDir, input);
    const outputPath = path.join(outputDir, output);

    try {
      // Check if source exists
      if (!fs.existsSync(inputPath)) {
        console.log(`❌ Source not found: ${input}`);
        continue;
      }

      await sharp(inputPath)
        .webp({ quality })
        .toFile(outputPath);

      // Get file sizes for comparison
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

      console.log(`✅ ${input} → ${output}`);
      console.log(`   Size: ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${reduction}% reduction)\n`);
    } catch (error) {
      console.log(`❌ Error converting ${input}: ${error.message}`);
    }
  }

  console.log('Conversion complete!');
}

convert();
