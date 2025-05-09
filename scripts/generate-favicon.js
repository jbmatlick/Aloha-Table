const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));
    
    // Generate PNG versions
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat('png')
      .toFile(path.join(__dirname, '../public/favicon-32x32.png'));

    await sharp(svgBuffer)
      .resize(16, 16)
      .toFormat('png')
      .toFile(path.join(__dirname, '../public/favicon-16x16.png'));

    // Copy the 32x32 version as favicon.png
    fs.copyFileSync(
      path.join(__dirname, '../public/favicon-32x32.png'),
      path.join(__dirname, '../public/favicon.png')
    );
    
    // Generate apple-touch-icon.png (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .toFormat('png')
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
    
    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateFavicon(); 