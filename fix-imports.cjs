const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace `import React from 'react'` or `import React, { ... } from 'react'`
    if (content.includes('import React')) {
        content = content.replace(/import React,?\s*/, 'import ');
        // if it resulted in `import from 'react';`, remove the whole line
        content = content.replace(/import\s+from\s+['"]react['"];?\n?/, '');
        fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
console.log('Fixed imports');
