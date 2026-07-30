/**
 * add-lazy-loading.js
 * 
 * A reliable approach: For each file, we parse img tags by finding <img
 * then scanning forward character-by-character to find the true /> or >
 * only when the JSX tag is balanced (no open { } pairs).
 *
 * Run: node scripts/add-lazy-loading.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const HERO_PATTERNS = ['it-services-hero', 'zawr-industries', 'investors-hero-bg', 'hero-bg'];
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

let totalFiles = 0, totalUpdated = 0, totalTagsFixed = 0;

/**
 * Extracts all <img ...> / <img ... /> tags from a string.
 * Returns array of { start, end, fullTag } positions.
 * Handles JSX expressions like style={{ ... }} by balancing curly braces.
 */
function findImgTags(content) {
  const results = [];
  let i = 0;
  
  while (i < content.length) {
    // Find next <img followed by whitespace or />
    const imgStart = content.indexOf('<img', i);
    if (imgStart === -1) break;
    
    // Make sure it's actually an img tag (next char is space, tab, newline or /)
    const afterImg = content[imgStart + 4];
    if (!afterImg || (!/[\s\n\r\t\/]/.test(afterImg))) {
      i = imgStart + 5;
      continue;
    }
    
    // Scan forward to find the end of the tag, balancing { }
    let pos = imgStart + 4;
    let depth = 0;
    let tagEnd = -1;
    
    while (pos < content.length) {
      const ch = content[pos];
      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
      } else if (depth === 0) {
        if (ch === '/' && content[pos + 1] === '>') {
          tagEnd = pos + 2;
          break;
        } else if (ch === '>' && content[pos - 1] !== '=') {
          tagEnd = pos + 1;
          break;
        }
      }
      pos++;
    }
    
    if (tagEnd === -1) {
      i = imgStart + 5;
      continue;
    }
    
    const fullTag = content.slice(imgStart, tagEnd);
    results.push({ start: imgStart, end: tagEnd, fullTag });
    i = tagEnd;
  }
  
  return results;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const tags = findImgTags(original);
  
  if (tags.length === 0) {
    totalFiles++;
    return;
  }
  
  let content = original;
  let offset = 0;
  let count = 0;
  
  for (const tag of tags) {
    const { start, end, fullTag } = tag;
    
    // Skip if already has loading attribute
    if (/\bloading\s*=/.test(fullTag)) continue;
    
    const isHero = HERO_PATTERNS.some(p => fullTag.includes(p));
    const extra = isHero
      ? ' loading="eager" fetchPriority="high"'
      : ' loading="lazy" decoding="async"';
    
    // Insert the attributes before the closing /> or >
    let newTag;
    if (fullTag.endsWith('/>')) {
      newTag = fullTag.slice(0, -2) + extra + ' />';
    } else {
      newTag = fullTag.slice(0, -1) + extra + '>';
    }
    
    const adjustedStart = start + offset;
    const adjustedEnd = end + offset;
    content = content.slice(0, adjustedStart) + newTag + content.slice(adjustedEnd);
    offset += newTag.length - fullTag.length;
    count++;
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const rel = path.relative(path.join(__dirname, '..'), filePath);
    console.log(`✅ UPDATED (${count} tags): ${rel}`);
    totalUpdated++;
    totalTagsFixed += count;
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

console.log('🚀 Adding lazy loading to all <img> tags (safe balanced-brace parser)...\n');
walkDir(SRC_DIR);
console.log(`\n✨ Done! Scanned: ${totalFiles}, Updated: ${totalUpdated}, Tags fixed: ${totalTagsFixed}`);
