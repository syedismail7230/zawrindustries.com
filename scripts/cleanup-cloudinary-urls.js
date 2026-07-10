const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

const ALLOWED_EXTS = ['.tsx', '.ts', '.jsx', '.js', '.json', '.css', '.module.css', '.mjs', '.html'];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'scripts'];

// Regex to capture the duplicated Cloudinary prefix
const DUPLICATE_REGEX = /https:\/\/res\.cloudinary\.com\/murfclni\/image\/upload\/v\d+\/zawr\/https:\/\/(res\.cloudinary\.com\/murfclni\/image\/upload\/v\d+\/zawr\/)/g;

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
        cleanupInFile(filePath);
      }
    }
  }
}

function cleanupInFile(filePath) {
  let originalContent;
  try {
    originalContent = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return;
  }

  let content = originalContent;

  if (DUPLICATE_REGEX.test(content)) {
    // Reset regex index before replacing
    DUPLICATE_REGEX.lastIndex = 0;
    content = content.replace(DUPLICATE_REGEX, 'https://$1');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    totalUpdated++;
    console.log(`CLEANED UP: ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
}

function run() {
  console.log('Scanning files to clean up duplicated Cloudinary prefixes...');
  processDirectory(SRC_DIR);
  processDirectory(DATA_DIR);
  console.log(`\nCleanup complete! Fixed ${totalUpdated} files.`);
}

run();
