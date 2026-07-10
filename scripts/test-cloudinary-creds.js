const cloudinary = require('cloudinary').v2;

const pos2_choices = ['l', 'I', '1'];
const pos9_choices = ['k', 'K'];
const pos14_choices = ['l', 'I', 'i', '1'];

async function test(secret) {
  cloudinary.config({
    cloud_name: 'murfclni',
    api_key: '837899661636975',
    api_secret: secret,
    secure: true
  });
  try {
    const res = await cloudinary.uploader.upload('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', {
      public_id: 'zawr/test-ping'
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('Generating and testing all 24 OCR credential combinations...');
  let found = false;

  for (const pos2 of pos2_choices) {
    for (const pos9 of pos9_choices) {
      for (const pos14 of pos14_choices) {
        const secret = `x${pos2}h5wXEc${pos9}XFDV${pos14}MVy3tz-o5wjEY`;
        process.stdout.write(`Testing: ${secret} ... `);
        const success = await test(secret);
        if (success) {
          console.log('SUCCESS!');
          console.log(`\n========================================`);
          console.log(`CORRECT SECRET FOUND: ${secret}`);
          console.log(`========================================`);
          found = true;
          break;
        } else {
          console.log('failed');
        }
      }
      if (found) break;
    }
    if (found) break;
  }

  if (!found) {
    console.log('\nCould not find a valid combination. Let\'s check if there are other characters.');
  }
}
run();
