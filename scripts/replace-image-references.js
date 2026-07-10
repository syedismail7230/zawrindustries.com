const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, '..', 'cloudinary-mapping.json');
if (!fs.existsSync(mappingPath)) {
  console.error(`ERROR: mapping file not found at ${mappingPath}`);
  console.error('Please run scripts/upload-existing-assets.js first!');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

// Sort keys by length descending to prevent partial replacement bugs
// (e.g. replacing "/assets/careers-1.png" before "/assets/careers-10.png")
const sortedKeys = Object.keys(mapping).sort((a, b) => b.length - a.length);

const SRC_DIR = path.join(__dirname, '..', 'src');
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

const ALLOWED_EXTS = ['.tsx', '.ts', '.jsx', '.js', '.json', '.css', '.module.css', '.mjs', '.html'];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'scripts'];

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
        replaceInFile(filePath);
      }
    }
  }
}

function replaceInFile(filePath) {
  // Read file as text
  let originalContent;
  try {
    originalContent = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`Skipping unreadable file: ${filePath}`);
    return;
  }

  let content = originalContent;
  let count = 0;

  for (const key of sortedKeys) {
    const cloudinaryUrl = mapping[key];
    
    // Replace with leading slash
    if (content.includes(key)) {
      content = content.split(key).join(cloudinaryUrl);
      count++;
    }
    
    // Replace without leading slash (e.g. "assets/..." instead of "/assets/...")
    const keyNoSlash = key.startsWith('/') ? key.substring(1) : key;
    if (content.includes(keyNoSlash)) {
      // Avoid replacing occurrences that already have a slash (like "https://...assets/..." or "/assets/...")
      // We can split by keyNoSlash but only replace if it's not preceded by a slash.
      // A simple split/join on keyNoSlash is safe as long as keyNoSlash is unique enough and has the asset/images directory structure.
      content = content.split(keyNoSlash).join(cloudinaryUrl);
      count++;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`UPDATED: ${path.relative(path.join(__dirname, '..'), filePath)} (${count} replacements)`);
  }
}

function run() {
  console.log('Replacing local image references with Cloudinary URLs...');
  console.log('Processing src directory...');
  processDirectory(SRC_DIR);
  console.log('Processing public/data directory...');
  processDirectory(DATA_DIR);
  console.log('\nReplacement complete!');
}

run();
