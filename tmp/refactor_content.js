const fs = require('fs');

function refactorFile(filePath) {
    console.log(`Processing ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern: { en: '...', bn: '...' } or { bn: '...', en: '...' }
    // We use a non-greedy match for the content to avoid over-matching
    
    // Handle { en: ..., bn: ... }
    content = content.replace(/\{\s*en:\s*((['"`])[\s\S]*?\2)\s*,\s*bn:\s*((['"`])[\s\S]*?\4)\s*\}/g, '$3');
    
    // Handle { bn: ..., en: ... }
    content = content.replace(/\{\s*bn:\s*((['"`])[\s\S]*?\2)\s*,\s*en:\s*((['"`])[\s\S]*?\4)\s*\}/g, '$1');
    
    fs.writeFileSync(filePath, content);
    console.log(`Finished ${filePath}`);
}

process.argv.slice(2).forEach(refactorFile);
