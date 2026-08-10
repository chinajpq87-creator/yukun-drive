import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const args = process.argv.slice(2);
const directoryIndex = args.indexOf('--dir');
const outputDirectory = directoryIndex === -1 ? 'dist' : args[directoryIndex + 1];

if (!outputDirectory) {
  throw new Error('Usage: node scripts/seo-audit.mjs --dir <directory>');
}

const root = resolve(process.cwd(), outputDirectory);

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
if (htmlFiles.length === 0) {
  throw new Error(`No HTML files found in ${root}`);
}

const checks = [
  ['title', /<title[^>]*>\s*[^<\s][\s\S]*?<\/title>/i],
  ['meta description', /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+[^"']*["'][^>]*>/i],
  ['canonical URL', /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*>/i],
];
const draftMarkers = /\bdraft:\s*true\b|pending review|unpublished engineering draft/i;
const failures = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const label = relative(root, file);

  for (const [name, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${label}: missing ${name}`);
  }

  if (draftMarkers.test(html)) failures.push(`${label}: draft content is publicly rendered`);
}

if (failures.length > 0) {
  throw new Error(`SEO audit failed:\n${failures.join('\n')}`);
}

console.log(`SEO audit passed: ${htmlFiles.length} HTML files checked.`);
