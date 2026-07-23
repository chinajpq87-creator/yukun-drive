import test from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicEmail = 'chinajpq@outlook.com';
const approvedDisclaimer =
  'Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.';

const read = (path) => readFileSync(join(root, path), 'utf8');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function publicSourceFiles() {
  return walk(join(root, 'src')).filter((file) => {
    if (!/\.(astro|tsx|md)$/.test(file)) return false;
    if (!file.endsWith('.md')) return true;
    return !/^draft:\s*true\s*$/im.test(readFileSync(file, 'utf8'));
  });
}

const prohibitedClaims = [
  ['shipping term', /\b(?:FOB|CIF|DDP)\b/i],
  ['minimum order', /\bMOQ\b/i],
  ['displayed price', /(?:\$\s*\d|\bUSD\b|\bunit price\b|\bpricing\b|\bprice\s+(?:from|reference|range))/i],
  ['fixed response time', /\bwithin\s+\d+\s*(?:hours?|business days?)\b/i],
  ['fixed sample time', /\b(?:samples?|sample request).{0,40}\b\d+\s*[-–]?\s*(?:days?|weeks?)\b/i],
  ['fixed delivery time', /\b(?:ships?|shipping|production|delivery).{0,40}\b\d+\s*[-–]?\s*(?:days?|weeks?)\b/i],
  ['named certification', /\b(?:ISO\s*\d+|IATF\s*\d+|RoHS|REACH|FDA|CE\/UL)\b/i],
  ['certification assertion', /\bcertified\s+(?:factory|facility|production|lines?)\b/i],
  ['factory ownership', /\b(?:our own factory|our factory|our manufacturing facility|vertically integrated)\b/i],
  ['fixed capacity', /\b\d[\d,.-]*\s*(?:units?|pcs)\s*(?:\/|per)\s*(?:day|month)\b/i],
  ['manufacturing tenure', /\b\d+\+?\s*years?\s+(?:of\s+)?manufacturing\b/i],
];

function scanClaims(files) {
  return files.flatMap((file) => {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    return lines.flatMap((line, index) =>
      prohibitedClaims
        .filter(([, pattern]) => pattern.test(line))
        .map(([label]) => `${relative(root, file)}:${index + 1} [${label}] ${line.trim()}`)
    );
  });
}

test('content schema and public queries support explicit draft exclusion', () => {
  const schema = read('src/content.config.ts');
  assert.equal(
    (schema.match(/draft:\s*z\.boolean\(\)\.default\(false\)/g) ?? []).length,
    5
  );

  for (const file of [
    'src/pages/index.astro',
    'src/pages/products/index.astro',
    'src/pages/products/[slug].astro',
    'src/pages/solutions/index.astro',
    'src/pages/solutions/[slug].astro',
    'src/pages/blog/[slug].astro',
  ]) {
    assert.match(read(file), /getCollection\([^;\n]+!data\.draft/);
  }

  assert.match(
    read('src/content/products/pawvibe-pet-interactive-ball.md'),
    /^draft:\s*true\s*$/m
  );
  assert.match(
    read('src/content/blog/fan-teardown-ai-script.md'),
    /^draft:\s*true\s*$/m
  );
});

test('contact flow is email-first and does not embed a Web3Forms key', () => {
  const form = read('src/components/ContactForm.tsx');
  assert.doesNotMatch(form, /YOUR_WEB3FORMS_ACCESS_KEY/);
  assert.match(form, /PUBLIC_WEB3FORMS_ACCESS_KEY/);
  assert.match(form, new RegExp(publicEmail.replace('.', '\\.')));
  assert.match(form, /generate_lead/);
  assert.match(form, new RegExp(approvedDisclaimer.replaceAll('.', '\\.')));
});

test('public source avoids standing commercial and compliance claims', () => {
  assert.deepEqual(scanClaims(publicSourceFiles()), []);
});

test('built output excludes drafts and standing claims when dist exists', () => {
  const dist = join(root, 'dist');
  if (!existsSync(dist)) return;

  assert.equal(
    existsSync(join(dist, 'products', 'pawvibe-pet-interactive-ball', 'index.html')),
    false
  );
  assert.deepEqual(scanClaims(walk(dist).filter((file) => file.endsWith('.html'))), []);
});
