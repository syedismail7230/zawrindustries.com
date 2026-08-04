const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/assets/robotic+arm+3d+model.glb');
const buf = fs.readFileSync(filePath);
const str = buf.toString('utf8');

const matches = str.match(/"name":"([^"]+)"/g);
if (matches) {
  const names = [...new Set(matches.map(m => m.replace(/"name":"|"/g, '')))];
  console.log('Nodes & Bones count:', names.length);
  console.log('Nodes list:', names);
} else {
  console.log('No node names found in GLB JSON header');
}
