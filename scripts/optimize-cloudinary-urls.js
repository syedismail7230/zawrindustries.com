const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

const ALLOWED_EXTS = ['.tsx', '.ts', '.jsx', '.js', '.json', '.css', '.module.css', '.mjs', '.html'];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'scripts'];

// Regex to match "image/upload/v[digits]" and replace with "image/upload/f_auto,q_auto/v[digits]"
// It uses a negative lookahead to prevent duplicating transformations if run multiple times.
const OPTIMIZE_REGEX = /image\/upload\/(?!f_auto,q_auto\/)v(\d+)/g;

let totalUpdated = 0;

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (EXCLUDE_DIRS.includes(file)) continue;
      processDirectory(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ALLOWED_EXTS.includes(ext)) {
        optimizeInFile(filePath);
      }
    }
  }
}

function optimizeInFile(filePath) {
  let originalContent;
  try {
    originalContent = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return;
  }

  let content = originalContent;

  if (OPTIMIZE_REGEX.test(content)) {
    OPTIMIZE_REGEX.lastIndex = 0;
    content = content.replace(OPTIMIZE_REGEX, 'image/upload/f_auto,q_auto/v$1');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    totalUpdated++;
    console.log(`OPTIMIZED IMAGES: ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
}

function run() {
  console.log('Scanning files to inject Cloudinary optimization parameters (f_auto,q_auto)...');
  processDirectory(SRC_DIR);
  processDirectory(DATA_DIR);
  console.log(`\nOptimization injection complete! Updated ${totalUpdated} files.`);
}

run();
