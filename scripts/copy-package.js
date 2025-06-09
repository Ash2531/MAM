const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '../src/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy package.json to assets
const sourceFile = path.join(__dirname, '../package.json');
const targetFile = path.join(assetsDir, 'package.json');

fs.copyFileSync(sourceFile, targetFile);
console.log('package.json copied to assets folder'); 