const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Standard conversions (same location)
const standardConversions = [
  // 'public/images/Services/Projetos prontos/casa_campo/casa-campo-moderna.png', // File not found
  // 'public/images/Services/Projetos prontos/casa_campo/casa-campo-moderna-2.png', // File not found
  // 'public/images/Services/Projetos prontos/loft/loft-urbano.png', // Removed - replaced with Vila Serrana
];

// Custom name mappings (source -> destination)
const customConversions = {
  'public/images/Apresentação/Refugio/Design sem nome (30).png':
    'public/images/Services/Projetos prontos/vila-serrana/vila-serrana-construcao.webp',
  'public/images/Apresentação/Refugio/Design sem nome (31).png':
    'public/images/Services/Projetos prontos/vila-serrana/vila-serrana-interior-suite.webp',
  'public/images/Apresentação/Refugio/Design sem nome (32).png':
    'public/images/Services/Projetos prontos/vila-serrana/vila-serrana-fachada-detalhe.webp',
  'public/images/Apresentação/Refugio/Design sem nome (354.png':
    'public/images/Services/Projetos prontos/vila-serrana/vila-serrana-exterior-completo.webp',
  // Casa Laranjeiras - Presentation Images
  'public/images/Apresentação/Casa Laranjeiras/27.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-entrada-principal.webp',
  'public/images/Apresentação/Casa Laranjeiras/20.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-pergola.webp',
  'public/images/Apresentação/Casa Laranjeiras/21.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-piscina.webp',
  'public/images/Apresentação/Casa Laranjeiras/22.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-living.webp',
  'public/images/Apresentação/Casa Laranjeiras/23.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-jantar.webp',
  'public/images/Apresentação/Casa Laranjeiras/24.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-lateral-piscina.webp',
  'public/images/Apresentação/Casa Laranjeiras/25.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-fachada-lateral.webp',
  'public/images/Apresentação/Casa Laranjeiras/26.png':
    'public/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-fachada-frontal.webp',
};

async function convertToWebP() {
  // Process standard conversions
  for (const imgPath of standardConversions) {
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

  // Process custom conversions
  for (const [srcPath, destPath] of Object.entries(customConversions)) {
    console.log(`Converting: ${srcPath} → ${destPath}`);

    await sharp(srcPath)
      .webp({ quality: 85 })
      .toFile(destPath);

    const originalSize = fs.statSync(srcPath).size;
    const newSize = fs.statSync(destPath).size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  WebP: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Reduction: ${reduction}%\n`);
  }
}

convertToWebP()
  .then(() => console.log('✅ Conversion complete!'))
  .catch(err => console.error('❌ Error:', err));
