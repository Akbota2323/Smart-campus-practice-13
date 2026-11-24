import fs from 'node:fs';
import path from 'node:path';
const patterns = [
  'setDecision(null)',
  "'24:00'",
  'selectedRoom.blocked',
  'focus:border-sky-500 focus:ring-2',
];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'lib' ? [] : walk(p);
    return /\.(tsx|ts)$/.test(e.name) && !/\.test\./.test(e.name) ? [p] : [];
  });
}
const files = walk('src');
for (const pat of patterns) {
  let total = 0;
  const where = [];
  for (const f of files) {
    const n = fs.readFileSync(f, 'utf8').split(pat).length - 1;
    if (n > 0) { total += n; where.push(`${f}:${n}`); }
  }
  console.log(`${pat} -> ${total} (${where.join(', ') || 'none'})`);
}
