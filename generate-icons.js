const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, 'icons');
const nestedIconsDir = path.join(iconsDir, 'icons');

[iconsDir, nestedIconsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const sourceIcon = path.join(__dirname, 'icon.png');

if (!fs.existsSync(sourceIcon)) {
  console.error('Source icon.png not found at:', sourceIcon);
  process.exit(1);
}

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512, 1024];

async function generateAllIcons() {
  console.log('Generating PWA icons from uploaded icon.png...');

  for (const s of sizes) {
    const filename = `icon-${s}x${s}.png`;
    const targetPath1 = path.join(iconsDir, filename);
    const targetPath2 = path.join(nestedIconsDir, filename);

    await sharp(sourceIcon)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(targetPath1);

    await sharp(sourceIcon)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(targetPath2);

    console.log(`Generated ${filename}`);
  }

  // Favicons
  await sharp(sourceIcon).resize(16, 16).toFile(path.join(__dirname, 'favicon-16.png'));
  await sharp(sourceIcon).resize(32, 32).toFile(path.join(__dirname, 'favicon-32.png'));
  await sharp(sourceIcon).resize(32, 32).toFile(path.join(iconsDir, 'favicon-32.png'));
  await sharp(sourceIcon).resize(16, 16).toFile(path.join(iconsDir, 'favicon-16.png'));
  await sharp(sourceIcon).resize(32, 32).toFile(path.join(nestedIconsDir, 'favicon-32.png'));
  await sharp(sourceIcon).resize(16, 16).toFile(path.join(nestedIconsDir, 'favicon-16.png'));

  // Apple Touch Icon
  await sharp(sourceIcon).resize(180, 180).toFile(path.join(__dirname, 'apple-touch-icon.png'));
  await sharp(sourceIcon).resize(180, 180).toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  await sharp(sourceIcon).resize(180, 180).toFile(path.join(nestedIconsDir, 'apple-touch-icon.png'));

  // Maskable Icons (padded with brand background #0B0D14)
  for (const s of [192, 512]) {
    const maskableFilename = `icon-maskable-${s}x${s}.png`;
    const padding = Math.round(s * 0.1); // 10% padding for safe zone
    const innerSize = s - (padding * 2);

    const resizedImage = await sharp(sourceIcon)
      .resize(innerSize, innerSize, { fit: 'contain' })
      .toBuffer();

    await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: { r: 11, g: 13, b: 20, alpha: 1 }
      }
    })
    .composite([{ input: resizedImage, top: padding, left: padding }])
    .png()
    .toFile(path.join(iconsDir, maskableFilename));

    await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: { r: 11, g: 13, b: 20, alpha: 1 }
      }
    })
    .composite([{ input: resizedImage, top: padding, left: padding }])
    .png()
    .toFile(path.join(nestedIconsDir, maskableFilename));

    console.log(`Generated ${maskableFilename}`);
  }

  // Create SVG wrapper for icon.svg referencing embedded or vector fallback
  const base64Data = fs.readFileSync(sourceIcon).toString('base64');
  const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64Data}" width="512" height="512"/>
</svg>`;
  fs.writeFileSync(path.join(__dirname, 'icon.svg'), svgContent, 'utf8');

  console.log('All icons generated successfully!');
}

generateAllIcons().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
