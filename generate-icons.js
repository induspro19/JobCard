const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Standard SVG Icon (Fire Extinguisher / Flame Badge)
const svgStandard = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B0D14"/>
      <stop offset="100%" stop-color="#161928"/>
    </linearGradient>
    <linearGradient id="fireGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF4500"/>
      <stop offset="50%" stop-color="#FF7043"/>
      <stop offset="100%" stop-color="#FF8C42"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F5A623"/>
      <stop offset="100%" stop-color="#FF8C42"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>

  <!-- Glowing Emblem Ring -->
  <rect x="76" y="76" width="360" height="360" rx="72" fill="url(#fireGrad)" filter="url(#glow)" opacity="0.95"/>
  <rect x="80" y="80" width="352" height="352" rx="68" fill="url(#fireGrad)"/>

  <!-- Inner Dark Core -->
  <rect x="96" y="96" width="320" height="320" rx="52" fill="#0B0D14" opacity="0.2"/>

  <!-- Fire Extinguisher Symbol -->
  <g transform="translate(136, 120) scale(1.0)">
    <!-- Tank Nozzle Handle -->
    <path d="M120 30 C120 20, 110 10, 95 10 L85 10 C70 10, 60 20, 60 30 L60 45 L120 45 Z" fill="#FFFFFF"/>
    <rect x="82" y="45" width="16" height="25" fill="#FFFFFF"/>
    
    <!-- Lever & Gauge -->
    <path d="M50 35 L95 20 L95 30 L60 40 Z" fill="#FFFFFF"/>
    <path d="M98 25 L145 15 L140 28 L98 32 Z" fill="#FFFFFF"/>
    <circle cx="120" cy="55" r="14" fill="#FFFFFF"/>
    <circle cx="120" cy="55" r="8" fill="#FF4500"/>

    <!-- Cylinder Body -->
    <rect x="65" y="70" width="110" height="175" rx="30" fill="#FFFFFF"/>
    
    <!-- Base -->
    <path d="M60 235 C60 255, 180 255, 180 235 L180 220 L60 220 Z" fill="#FFFFFF" opacity="0.9"/>
    
    <!-- Fire Flame Graphic inside Cylinder -->
    <path d="M120 100 C110 120, 90 135, 90 155 C90 172, 103 185, 120 185 C137 185, 150 172, 150 155 C150 135, 130 120, 120 100 Z" fill="url(#fireGrad)"/>
    <path d="M120 125 C115 137, 105 145, 105 157 C105 166, 112 173, 120 173 C128 173, 135 166, 135 157 C135 145, 125 137, 120 125 Z" fill="url(#goldGrad)"/>

    <!-- Hose Pipe -->
    <path d="M134 55 C170 55, 190 85, 190 125 L190 160 C190 170, 180 175, 175 165 C170 155, 175 130, 160 100 C150 80, 135 70, 134 70 Z" fill="#FFFFFF"/>
  </g>

  <!-- Text Badge -->
  <text x="256" y="445" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="800" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">INDUS FIRE</text>
</svg>
`;

// 2. Maskable SVG Icon (Safe zone compliant for Android & Adaptive Icons)
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mBgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF4500"/>
      <stop offset="50%" stop-color="#E03E00"/>
      <stop offset="100%" stop-color="#0B0D14"/>
    </linearGradient>
    <linearGradient id="mGoldGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F5A623"/>
      <stop offset="100%" stop-color="#FF7043"/>
    </linearGradient>
  </defs>

  <!-- Full Bleed Background for Maskable Icon -->
  <rect width="512" height="512" fill="url(#mBgGrad)"/>

  <!-- Centered Scaled Content within Safe Zone (80% / 410px circle) -->
  <g transform="translate(146, 120) scale(0.9)">
    <!-- Tank Nozzle Handle -->
    <path d="M120 30 C120 20, 110 10, 95 10 L85 10 C70 10, 60 20, 60 30 L60 45 L120 45 Z" fill="#FFFFFF"/>
    <rect x="82" y="45" width="16" height="25" fill="#FFFFFF"/>
    
    <!-- Lever & Gauge -->
    <path d="M50 35 L95 20 L95 30 L60 40 Z" fill="#FFFFFF"/>
    <path d="M98 25 L145 15 L140 28 L98 32 Z" fill="#FFFFFF"/>
    <circle cx="120" cy="55" r="14" fill="#FFFFFF"/>
    <circle cx="120" cy="55" r="8" fill="#FF4500"/>

    <!-- Cylinder Body -->
    <rect x="65" y="70" width="110" height="175" rx="30" fill="#FFFFFF"/>
    
    <!-- Base -->
    <path d="M60 235 C60 255, 180 255, 180 235 L180 220 L60 220 Z" fill="#FFFFFF" opacity="0.9"/>
    
    <!-- Fire Flame Graphic inside Cylinder -->
    <path d="M120 100 C110 120, 90 135, 90 155 C90 172, 103 185, 120 185 C137 185, 150 172, 150 155 C150 135, 130 120, 120 100 Z" fill="url(#mGoldGrad)"/>

    <!-- Hose Pipe -->
    <path d="M134 55 C170 55, 190 85, 190 125 L190 160 C190 170, 180 175, 175 165 C170 155, 175 130, 160 100 C150 80, 135 70, 134 70 Z" fill="#FFFFFF"/>
  </g>

  <!-- Text Badge -->
  <text x="256" y="420" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="800" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">INDUS FIRE</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, 'icon.svg'), svgStandard, 'utf8');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function buildAllIcons() {
  console.log('Generating PWA icons...');
  for (const s of sizes) {
    const filename = `icon-${s}x${s}.png`;
    await sharp(Buffer.from(svgStandard))
      .resize(s, s)
      .toFile(path.join(iconsDir, filename));
    console.log(`Generated ${filename}`);
  }

  // Generate Maskable Icons (192 and 512)
  await sharp(Buffer.from(svgMaskable))
    .resize(192, 192)
    .toFile(path.join(iconsDir, 'icon-maskable-192x192.png'));
  console.log('Generated icon-maskable-192x192.png');

  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
  console.log('Generated icon-maskable-512x512.png');

  console.log('All PWA icons generated successfully!');
}

buildAllIcons().catch(err => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
