import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
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

const sitemapAlias = join(root, 'sitemap.xml');
if (!existsSync(sitemapAlias)) {
  throw new Error('Missing sitemap.xml alias for Search Console compatibility');
}

const sitemapXml = readFileSync(sitemapAlias, 'utf8');
if (!/^<\?xml\s/i.test(sitemapXml.trim()) || !/<sitemapindex\b/i.test(sitemapXml)) {
  throw new Error('sitemap.xml must be a valid XML sitemap index');
}

const checks = [
  ['title', /<title[^>]*>\s*[^<\s][\s\S]*?<\/title>/i],
  ['meta description', /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+[^"']*["'][^>]*>/i],
  ['canonical URL', /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*>/i],
];
const draftMarkers = /\bdraft:\s*true\b|pending review|unpublished engineering draft/i;
const internalHrefPattern = /href=["']\/(?!\/|cdn-cgi\/)([^"'#]*)["']/g;
const failures = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const label = relative(root, file);
  const isNoindexRedirectFallback =
    /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*\bnoindex\b[^"']*["'][^>]*>/i.test(html) &&
    /<meta\b[^>]*\bhttp-equiv=["']refresh["'][^>]*>/i.test(html);

  for (const [name, pattern] of checks) {
    if (isNoindexRedirectFallback && name === 'meta description') continue;
    if (!pattern.test(html)) failures.push(`${label}: missing ${name}`);
  }

  if (draftMarkers.test(html)) failures.push(`${label}: draft content is publicly rendered`);

  for (const match of html.matchAll(internalHrefPattern)) {
    const rawPath = `/${match[1]}`;
    const [pathname] = rawPath.split('?');

    if (pathname === '/') continue;
    if (/\.[a-z0-9]+$/i.test(pathname)) continue;
    if (!pathname.endsWith('/')) {
      failures.push(`${label}: internal link is not canonical trailing-slash URL: ${rawPath}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`SEO audit failed:\n${failures.join('\n')}`);
}

console.log(`SEO audit passed: ${htmlFiles.length} HTML files checked.`);
