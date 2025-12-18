const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '..', 'public', 'images', 'Apresentação', 'Marcas Parceiras');
const outputDir = inputDir;

const conversions = [
  {
    input: 'BUI250007_C04877_C02_LOGO_20251008144412.png',
    output: 'brand-01.webp'
  },
  {
    input: 'Logo Lumen (10).png',
    output: 'lumen.webp'
  },
  {
    input: 'knauf.jpg',
    output: 'knauf.webp'
  },
  {
    input: 'Ph-GY-Aquapanel-logo-Contentful-Card-Entry.jpg',
    output: 'aquapanel.webp'
  }
];

async function convertImages() {
  console.log('Converting partner brand logos to WebP format...\n');

  for (const conversion of conversions) {
    const inputPath = path.join(inputDir, conversion.input);
    const outputPath = path.join(outputDir, conversion.output);

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ File not found: ${conversion.input}`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize({ height: 500, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(outputPath);

      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const savedKB = ((inputStats.size - outputStats.size) / 1024).toFixed(2);

      console.log(`✅ ${conversion.input} → ${conversion.output}`);
      console.log(`   Original: ${(inputStats.size / 1024).toFixed(2)} KB | WebP: ${(outputStats.size / 1024).toFixed(2)} KB | Saved: ${savedKB} KB\n`);
    } catch (error) {
      console.error(`❌ Error converting ${conversion.input}:`, error.message);
    }
  }

  console.log('✨ Conversion complete!');
}

convertImages().catch(console.error);
