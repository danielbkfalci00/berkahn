const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public', 'images', 'Services', 'projetos-prontos');

async function convertAndRename() {
  console.log('Iniciando conversao de imagens...\n');

  // === CASA DE CAMPO ===
  const casaDeCampoDir = path.join(BASE_DIR, 'Casa-de-campo');

  // Capa: Pagina inicial - parte 1 (27).png -> casa-de-campo-hero.webp
  const casaCapa = path.join(casaDeCampoDir, 'Pagina inicial - parte 1 (27).png');
  const casaCapaOut = path.join(casaDeCampoDir, 'casa-de-campo-hero.webp');
  if (fs.existsSync(casaCapa)) {
    await sharp(casaCapa).webp({ quality: 85 }).toFile(casaCapaOut);
    console.log('Casa de Campo - capa convertida');
  }

  // Segunda imagem: Pagina inicial - parte 1 (26).png -> casa-de-campo-02.webp
  const casa02 = path.join(casaDeCampoDir, 'Pagina inicial - parte 1 (26).png');
  const casa02Out = path.join(casaDeCampoDir, 'casa-de-campo-02.webp');
  if (fs.existsSync(casa02)) {
    await sharp(casa02).webp({ quality: 85 }).toFile(casa02Out);
    console.log('Casa de Campo - imagem 02 convertida');
  }

  // === CHALE ===
  const chaleDir = path.join(BASE_DIR, 'Chalé');

  // Renomear capa: NordicA-frame-01 (1).webp -> chale-hero.webp
  const chaleCapa = path.join(chaleDir, 'NordicA-frame-01 (1).webp');
  const chaleCapaOut = path.join(chaleDir, 'chale-hero.webp');
  if (fs.existsSync(chaleCapa) && !fs.existsSync(chaleCapaOut)) {
    fs.copyFileSync(chaleCapa, chaleCapaOut);
    console.log('Chale - capa copiada para nome semantico');
  }

  // === LOFT ===
  const loftDir = path.join(BASE_DIR, 'Loft');

  // Capa: Pagina inicial - parte 1 (12) (2).png -> loft-hero.webp
  const loftCapa = path.join(loftDir, 'Pagina inicial - parte 1 (12) (2).png');
  const loftCapaOut = path.join(loftDir, 'loft-hero.webp');
  if (fs.existsSync(loftCapa)) {
    await sharp(loftCapa).webp({ quality: 85 }).toFile(loftCapaOut);
    console.log('Loft - capa convertida');
  }

  // Renomear screenshots do Loft
  const loftScreenshots = [
    { from: 'Screenshot_2025-12-02_103333.webp', to: 'loft-01.webp' },
    { from: 'Screenshot_2025-12-02_103412.webp', to: 'loft-02.webp' },
    { from: 'Screenshot_2025-12-02_103422.webp', to: 'loft-03.webp' },
    { from: 'Screenshot_2025-12-02_103435.webp', to: 'loft-04.webp' },
    { from: 'Screenshot_2025-12-02_103447.webp', to: 'loft-05.webp' },
    { from: 'Screenshot_2025-12-02_103510.webp', to: 'loft-06.webp' },
  ];

  for (const { from, to } of loftScreenshots) {
    const fromPath = path.join(loftDir, from);
    const toPath = path.join(loftDir, to);
    if (fs.existsSync(fromPath) && !fs.existsSync(toPath)) {
      fs.copyFileSync(fromPath, toPath);
      console.log(`Loft - ${from} -> ${to}`);
    }
  }

  console.log('\nConversao concluida!');
}

convertAndRename().catch(console.error);
