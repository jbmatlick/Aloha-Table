const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate a wave pattern SVG
function generateWaveSVG(width, height, color = '#10B981') {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F3F4F6"/>
      <path d="M0,${height * 0.6} Q${width * 0.25},${height * 0.4} ${width * 0.5},${height * 0.6} T${width},${height * 0.6} V${height} H0 Z" fill="${color}"/>
    </svg>
  `;
}

// Generate images for each chef
async function generateChefImages() {
  try {
    // Generate chefs together image
    const chefsTogetherSVG = generateWaveSVG(1200, 800);
    await sharp(Buffer.from(chefsTogetherSVG))
      .resize(1200, 800)
      .toFile(path.join(imagesDir, 'chefs-together.jpg'));

    // Generate Angie's image
    const angieSVG = generateWaveSVG(800, 1000);
    await sharp(Buffer.from(angieSVG))
      .resize(800, 1000)
      .toFile(path.join(imagesDir, 'angie.jpg'));

    // Generate Iris's image
    const irisSVG = generateWaveSVG(800, 1000);
    await sharp(Buffer.from(irisSVG))
      .resize(800, 1000)
      .toFile(path.join(imagesDir, 'iris.jpg'));

    // Generate kitchen beach image
    const kitchenBeachSVG = generateWaveSVG(1600, 900);
    await sharp(Buffer.from(kitchenBeachSVG))
      .resize(1600, 900)
      .toFile(path.join(imagesDir, 'kitchen-beach.jpg'));

    console.log('✅ Chef images generated successfully!');
  } catch (error) {
    console.error('Error generating chef images:', error);
    process.exit(1);
  }
}

generateChefImages(); 