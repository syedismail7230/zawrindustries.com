// Deep GLB node inspector - prints full hierarchy with bounding box Y positions
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/assets/robotic+arm+3d+model.glb');
const buf = fs.readFileSync(filePath);

// Parse GLB header
const magic = buf.readUInt32LE(0);
const version = buf.readUInt32LE(4);
const length = buf.readUInt32LE(8);

// Read JSON chunk
const jsonChunkLength = buf.readUInt32LE(12);
const jsonChunkType = buf.readUInt32LE(16);
const jsonStr = buf.slice(20, 20 + jsonChunkLength).toString('utf8');
const gltf = JSON.parse(jsonStr);

console.log('=== GLTF NODES ===');
const nodes = gltf.nodes || [];
nodes.forEach((node, i) => {
  const name = node.name || `(unnamed_${i})`;
  const children = node.children ? node.children.join(',') : 'none';
  const mesh = node.mesh !== undefined ? `mesh:${node.mesh}` : '';
  const trans = node.translation ? `T:[${node.translation.map(v => v.toFixed(2)).join(',')}]` : '';
  const rot = node.rotation ? `R:[${node.rotation.map(v => v.toFixed(2)).join(',')}]` : '';
  console.log(`[${i}] "${name}" children:[${children}] ${mesh} ${trans} ${rot}`);
});

console.log('\n=== SCENE ROOT ===');
const scenes = gltf.scenes || [];
scenes.forEach((scene, i) => {
  console.log(`Scene ${i} "${scene.name}": root nodes = [${scene.nodes}]`);
});
