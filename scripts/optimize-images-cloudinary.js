/**
 * optimize-images-cloudinary.js
 * 
 * Upgrades all Cloudinary image URLs in the codebase to include:
 * - w_auto (responsive width — serves correct size per device)
 * - w_1200,c_limit (cap max width at 1200px for hero/bg images)
 * - q_auto:good (better quality preset)
 * - dpr_auto (auto device pixel ratio)
 * - f_auto (already present — keeps WebP/AVIF)
 * 
 * Run: node scripts/optimize-images-cloudinary.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Current pattern in URLs: f_auto,q_auto
// We want to upgrade to: f_auto,q_auto:good,w_1200,c_limit,dpr_auto
// For icon/logo images (small): f_auto,q_auto:good,w_400,c_limit
// For background/hero images: f_auto,q_auto:good,w_1600,c_limit,dpr_auto

const SMALL_ASSET_KEYWORDS = [
  'logo', 'icon', 'panda', 'portrait', 'firmai-logo', 'zawr-logo',
  'edu-icon', 'emp-icon', 'chart-icon', 'avatar'
];

const HERO_ASSET_KEYWORDS = [
  'hero', 'bg', 'banner', 'cover', 'reconstruction', 'zawr-industries',
  'investors-hero', 'pitch-deck', 'it-services-hero', 'dashboard'
];

let totalFiles = 0, totalUpdated = 0, totalUrlsFixed = 0;

function getOptimizedTransform(urlPath) {
  const filename = urlPath.split('/').pop() || '';
  
  if (SMALL_ASSET_KEYWORDS.some(k => filename.includes(k))) {
    return 'f_auto,q_auto:good,w_400,c_limit';
  }
  if (HERO_ASSET_KEYWORDS.some(k => filename.includes(k))) {
    return 'f_auto,q_auto:good,w_1600,c_limit,dpr_auto';
  }
  // Default: standard content image
  return 'f_auto,q_auto:good,w_1200,c_limit';
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  
  // Match Cloudinary upload URLs with f_auto,q_auto transformation
  let content = original.replace(
    /https:\/\/res\.cloudinary\.com\/murfclni\/image\/upload\/f_auto,q_auto\/(v\d+\/zawr\/[^\s"'`)\]]+)/g,
    (match, pathPart) => {
      const transform = getOptimizedTransform(pathPart);
      totalUrlsFixed++;
      return `https://res.cloudinary.com/murfclni/image/upload/${transform}/${pathPart}`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const rel = path.relative(path.join(__dirname, '..'), filePath);
    console.log(`✅ UPDATED: ${rel}`);
    totalUpdated++;
  }
  totalFiles++;
}

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.next', 'dist'].includes(entry.name)) {
      walkDir(full);
    } else if (entry.isFile() && EXTENSIONS.includes(path.extname(entry.name))) {
      processFile(full);
    }
  }
}

console.log('🚀 Upgrading Cloudinary URLs with responsive sizing...\n');
walkDir(SRC_DIR);
console.log(`\n✨ Done! Scanned: ${totalFiles}, Updated files: ${totalUpdated}, URLs upgraded: ${totalUrlsFixed}`);
