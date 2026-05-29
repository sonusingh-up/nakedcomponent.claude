const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk(path.join(__dirname, '../project'));

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace nc-site.js references
  // Matches: src="...nc-site.js" or src="...nc-site.js?v=..."
  const jsRegex = /(src=")([^"]*nc-site\.js)(\?[^"]*)?(")/g;
  const newJsContent = content.replace(jsRegex, '$1$2?v=999$4');
  if (newJsContent !== content) {
    content = newJsContent;
    changed = true;
  }

  // Replace style.css references
  // Matches: href="...style.css" or href="...style.css?v=..."
  const cssRegex = /(href=")([^"]*style\.css)(\?[^"]*)?(")/g;
  const newCssContent = content.replace(cssRegex, '$1$2?v=999$4');
  if (newCssContent !== content) {
    content = newCssContent;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated cache buster in: ${file}`);
  }
});
