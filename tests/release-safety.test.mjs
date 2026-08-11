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
  ['fixed sample time', /\b(?:samples?|sample request).{0,40}\b\d+\s*[-\u2013]?\s*(?:days?|weeks?)\b/i],
  ['fixed delivery time', /\b(?:ships?|shipping|production|delivery).{0,40}\b\d+\s*[-\u2013]?\s*(?:days?|weeks?)\b/i],
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
  assert.match(form, /entry_content/);
  assert.match(form, /utm_source/);
  assert.match(form, /utm_medium/);
  assert.match(form, /utm_campaign/);
});

test('public calls to action use discussion language rather than quote or sample promises', () => {
  const ctaFiles = [
    'src/components/Header.astro',
    'src/components/ContactForm.tsx',
    'src/pages/contact.astro',
    'src/pages/index.astro',
    'src/pages/products/[slug].astro',
    'src/pages/motor-manufacturers.astro',
  ];

  for (const file of ctaFiles) {
    const source = read(file);
    assert.doesNotMatch(source, /Request Quote|Request Samples?|Submit RFQ/i);
  }
});

test('motor-manufacturer landing path and inquiry attribution are present', () => {
  const landing = read('src/pages/motor-manufacturers.astro');
  const form = read('src/components/ContactForm.tsx');

  assert.match(landing, /Brushed DC Motor Component Matching/i);
  assert.match(landing, /chinajpq@outlook\.com/);
  assert.match(landing, /entryContent="motor-manufacturers"/);

  for (const field of ['entry_content', 'utm_source', 'utm_medium', 'utm_campaign']) {
    assert.match(form, new RegExp(field));
  }
});

test('homepage exposes the Pet Tech NPI entry while engineering pages retain their lab structure', () => {
  const home = read('src/pages/index.astro');
  const products = read('src/pages/products/index.astro');
  const motorManufacturers = read('src/pages/motor-manufacturers.astro');

  assert.match(home, /Global Manufacturing Integration Partner \(GMIP\)/);
  assert.match(home, /Bring Your Hardware Product From Prototype to Mass Production in China/);
  assert.match(home, /Pet Tech Brands/);
  assert.match(home, /Project Evidence Review/);
  assert.match(home, /LabComponentMap/);
  assert.match(home, /Build in China/);
  assert.match(home, /Source in China/);
  assert.match(home, /Scale in China/);
  assert.match(home, /Start a Project Fit Check/);
  assert.match(home, /Email Your Requirements/);

  assert.match(products, /Component Map/);
  assert.match(products, /Core Components/);
  assert.match(products, /Motion Platforms/);
  assert.match(products, /Waterproof Micro Switches/);
  assert.match(products, /Commutators/);
  assert.match(products, /Carbon Brush Assemblies/);
  assert.match(products, /Terminal \/ Contact Components/);

  assert.match(motorManufacturers, /Motor Component Review Desk/);
  assert.match(motorManufacturers, /Component review scope/);
  assert.match(motorManufacturers, /Common engineering signals/);
  assert.match(motorManufacturers, /What to share before inquiry/);
  assert.match(motorManufacturers, /Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry\./);
});

test('navigation and footer guard rails', () => {
  const header = read('src/components/Header.astro');
  const footer = read('src/components/Footer.astro');

  // Header main nav: strict set of approved labels and paths
  assert.match(header, /label:\s*'Products'/);
  assert.match(header, /href:\s*'\/products\/'/);
  assert.match(header, /label:\s*'Applications'/);
  assert.match(header, /href:\s*'\/solutions\/'/);
  assert.match(header, /label:\s*'Insights'/);
  assert.match(header, /href:\s*'\/resources\/'/);
  assert.match(header, /label:\s*'About'/);
  assert.match(header, /href:\s*'\/about\/'/);
  assert.match(header, /label:\s*'Contact'/);
  assert.match(header, /href:\s*'\/contact\/'/);

  // Header: no Motor Manufacturers as a top-level nav item
  assert.doesNotMatch(header, /Motor Manufacturers/);

  // Header: no banned internal product sub-routes
  assert.doesNotMatch(header, /\/products\/gear-motors/);
  assert.doesNotMatch(header, /\/products\/dc-motors/);
  assert.doesNotMatch(header, /\/products\/pumps/);
  assert.doesNotMatch(header, /\/products\/switches/);

  // Header: global CTA preserved
  assert.match(header, /Discuss Your Application/);

  // Footer: no banned internal product sub-routes
  assert.doesNotMatch(footer, /\/products\/gear-motors/);
  assert.doesNotMatch(footer, /\/products\/dc-motors/);
  assert.doesNotMatch(footer, /\/products\/pumps/);
  assert.doesNotMatch(footer, /\/products\/switches/);

  // Footer: no unverified social media outbound links
  assert.doesNotMatch(footer, /linkedin\.com\/company\/yukun-drive/);
  assert.doesNotMatch(footer, /youtube\.com\/@YukunDrive/);
  assert.doesNotMatch(footer, /x\.com\/YukunDrive/);
  assert.doesNotMatch(footer, /tiktok\.com\/@yukundrive/);

  // Footer: sole public email preserved
  assert.match(footer, /chinajpq@outlook\.com/);

  // A brokered text proposal must preserve valid public UTF-8 symbols and closing tags.
  assert.doesNotMatch(header + footer, /(?:\u922B|\u732C|\u9983|\u923B)/);
  assert.match(footer, /All Solutions &rarr;<\/a>/);
  assert.match(footer, /All Products &rarr;<\/a>/);
});

test('static internal page links use canonical trailing-slash URLs', () => {
  const files = publicSourceFiles();
  const routeLiteral = /(?:href:\s*|href=)(['"`])\/(?!\/|cdn-cgi\/)([^'"`#]*)\1/g;
  const failures = [];

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(routeLiteral)) {
      const rawPath = `/${match[2]}`;
      const [pathname] = rawPath.split('?');

      if (pathname === '/') continue;
      if (/\.[a-z0-9]+$/i.test(pathname)) continue;
      if (!pathname.endsWith('/')) {
        failures.push(`${relative(root, file)}: ${rawPath}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('public source avoids standing commercial and compliance claims', () => {
  const files = publicSourceFiles();
  assert.deepEqual(scanClaims(files), []);
  for (const file of files) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /info@yukun-drive\.com/i);
  }
});

test('public product and solution pages include inquiry safeguards', () => {
  const contentRoots = [
    join(root, 'src', 'content', 'products'),
    join(root, 'src', 'content', 'solutions'),
  ];
  const files = contentRoots
    .flatMap(walk)
    .filter((file) => file.endsWith('.md'))
    .filter((file) => !/^draft:\s*true\s*$/im.test(readFileSync(file, 'utf8')));

  assert.ok(files.length > 0);
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    assert.match(content, new RegExp(approvedDisclaimer.replaceAll('.', '\\.')));
    assert.match(content, new RegExp(publicEmail.replace('.', '\\.')));
  }
});

test('built output excludes drafts and standing claims when dist exists', () => {
  const dist = join(root, 'dist');
  if (!existsSync(dist)) return;
  const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));

  assert.equal(
    existsSync(join(dist, 'products', 'pawvibe-pet-interactive-ball', 'index.html')),
    false
  );
  assert.deepEqual(scanClaims(htmlFiles), []);
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /linkedin\.com\/company\/yukun-drive/i);
    assert.doesNotMatch(html, /youtube\.com\/@YukunDrive/i);
    assert.doesNotMatch(html, /x\.com\/YukunDrive/i);
    assert.doesNotMatch(html, /tiktok\.com\/@yukundrive/i);
    assert.doesNotMatch(html, /@YukunDrive/i);
  }
});

test('global.css defines the six shared Engineering Trust tokens', () => {
  const css = read('src/styles/global.css');
  assert.match(css, /--color-surface\s*:/);
  assert.match(css, /--color-surface-muted\s*:/);
  assert.match(css, /--color-ink\s*:/);
  assert.match(css, /--color-ink-muted\s*:/);
  assert.match(css, /--color-action\s*:/);
  assert.match(css, /--color-technical\s*:/);
});

test('global.css preserves legacy token aliases used by existing public pages', () => {
  const css = read('src/styles/global.css');
  for (const token of [
    '--color-brand', '--color-brand-light', '--color-bg-primary', '--color-bg-secondary',
    '--color-bg-card', '--color-bg-elevated', '--color-text-primary', '--color-text-secondary',
    '--color-text-muted', '--color-border-default', '--color-accent-green', '--color-accent-red',
  ]) {
    assert.match(css, new RegExp(`${token}\\s*:`));
  }
});

test('BaseLayout does not force class="dark" on html root', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  assert.doesNotMatch(layout, /<html[^>]*class="dark"/);
});
