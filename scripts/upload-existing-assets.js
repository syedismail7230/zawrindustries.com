const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load local environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.error('ERROR: .env.local file not found at', envPath);
  process.exit(1);
}

// Check Cloudinary Config
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('ERROR: Cloudinary environment variables are missing in .env.local!');
  console.error('Please configure: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Allowed image extensions
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];

function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

async function uploadFile(filePath) {
  // Get relative path from public folder (e.g. assets/industry/automotive-industry.png)
  const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const webPath = '/' + relPath;

  // Generate a clean public_id (e.g. zawr/assets/industry/automotive-industry)
  const ext = path.extname(filePath);
  const baseNameWithoutExt = path.basename(filePath, ext);
  const subFolder = path.dirname(path.relative(PUBLIC_DIR, filePath)).replace(/\\/g, '/');
  
  const publicId = `zawr/${subFolder}/${baseNameWithoutExt}`.replace(/\/+/g, '/');

  console.log(`Uploading: ${webPath} -> Cloudinary ID: ${publicId}`);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'auto'
    }, (error, result) => {
      if (error) {
        console.error(`FAILED: ${webPath}`, error.message);
        reject(error);
      } else {
        console.log(`SUCCESS: ${webPath} -> ${result.secure_url}`);
        resolve({ webPath, secureUrl: result.secure_url });
      }
    });
  });
}

async function run() {
  console.log('Scanning directories for images...');
  const assetFiles = getFilesRecursively(ASSETS_DIR);
  const imageFiles = getFilesRecursively(IMAGES_DIR);
  const allImages = [...assetFiles, ...imageFiles];

  console.log(`Found ${allImages.length} images to upload.`);

  const mapping = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allImages.length; i++) {
    const file = allImages[i];
    console.log(`[${i + 1}/${allImages.length}]`);
    try {
      const result = await uploadFile(file);
      mapping[result.webPath] = result.secureUrl;
      successCount++;
    } catch (e) {
      failCount++;
    }
  }

  // Write mapping JSON
  const mappingPath = path.join(__dirname, '..', 'cloudinary-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(`Total Found: ${allImages.length}`);
  console.log(`Successful Uploads: ${successCount}`);
  console.log(`Failed Uploads: ${failCount}`);
  console.log(`Mapping saved to: ${mappingPath}`);
}

run();
