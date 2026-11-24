import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(tsx|ts)$/.test(e.name) && !/\.test\./.test(e.name) ? [p] : [];
  });
}

let total = 0;
for (const f of walk('src')) {
  const n = fs.readFileSync(f, 'utf8').split('\n').length;
  total += n;
  console.log(`${f}: ${n}`);
}
console.log(`TOTAL (non-test .ts/.tsx): ${total}`);