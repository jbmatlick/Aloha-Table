const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('pexels');

// Create images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Initialize Pexels client
const client = createClient(process.env.PEXELS_API_KEY || '563492ad6f91700001000001f8c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0');

// Download image from URL
async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  await fs.promises.writeFile(outputPath, buffer);
}

// Generate images for each chef
async function generateChefImages() {
  try {
    // Search for chef images
    const chefQuery = await client.photos.search({ query: 'chef cooking', per_page: 1 });
    const femaleChefQuery = await client.photos.search({ query: 'female chef', per_page: 2 });
    const beachKitchenQuery = await client.photos.search({ query: 'beach kitchen', per_page: 1 });

    // Download and process back-to-back image
    await downloadImage(
      chefQuery.photos[0].src.large2x,
      path.join(imagesDir, 'chefs-back-to-back.jpg')
    );

    // Download and process Angie's image
    await downloadImage(
      femaleChefQuery.photos[0].src.large2x,
      path.join(imagesDir, 'angie.jpg')
    );

    // Download and process Iris's image
    await downloadImage(
      femaleChefQuery.photos[1].src.large2x,
      path.join(imagesDir, 'iris.jpg')
    );

    // Download and process kitchen beach image
    await downloadImage(
      beachKitchenQuery.photos[0].src.large2x,
      path.join(imagesDir, 'kitchen-beach.jpg')
    );

    console.log('✅ Chef images downloaded successfully!');
  } catch (error) {
    console.error('Error generating chef images:', error);
    process.exit(1);
  }
}

generateChefImages(); 