import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('homepage presents Yukun as the Pet Tech NPI and sourcing entry point', async () => {
  const homepage = await read('../src/pages/index.astro');

  assert.match(homepage, /Hardware NPI and Managed China Sourcing/);
  assert.match(homepage, /Turn Your Pet Tech Design Into a Manufacturable Product/);
  assert.match(homepage, /Build in China/);
  assert.match(homepage, /Source in China/);
  assert.match(homepage, /Scale in China/);
  assert.match(homepage, /Start a Project Fit Check/);
  assert.match(homepage, /\/contact\?entry=project-fit-check/);
});

test('contact path explains the free Fit Check boundary and collects routing evidence', async () => {
  const [contactPage, contactForm] = await Promise.all([
    read('../src/pages/contact.astro'),
    read('../src/components/ContactForm.tsx'),
  ]);
  const publicPath = `${contactPage}\n${contactForm}`;

  assert.match(publicPath, /free Project Fit Check/i);
  assert.match(publicPath, /fit, missing information, and the next practical step/i);

  for (const field of [
    'company',
    'country',
    'product_summary',
    'development_stage',
    'cad_available',
    'bom_available',
    'prototype_available',
    'target_quantity',
    'budget_range',
    'target_date',
    'target_market',
  ]) {
    assert.match(contactForm, new RegExp(`name=["']${field}["']`), `missing Fit Check field: ${field}`);
  }

  assert.match(contactForm, /entry_content/);
  assert.match(contactForm, /utm_source/);
  assert.match(contactForm, /utm_medium/);
  assert.match(contactForm, /utm_campaign/);
});

test('Fit Check analytics use non-PII lifecycle events', async () => {
  const contactForm = await read('../src/components/ContactForm.tsx');

  assert.match(contactForm, /fit_check_start/);
  assert.match(contactForm, /fit_check_submit/);
  assert.match(contactForm, /email_requirement_click/);

  for (const pii of ['email:', 'name:', 'company:', 'message:', 'product_summary:']) {
    assert.doesNotMatch(contactForm, new RegExp(`gtag\\([^)]{0,500}${pii}`, 's'));
  }
});

test('Fit Check conversion events reach the page data layer after a successful submission', async () => {
  const [contactForm, baseLayout] = await Promise.all([
    read('../src/components/ContactForm.tsx'),
    read('../src/layouts/BaseLayout.astro'),
  ]);

  assert.match(baseLayout, /window\.gtag\s*=\s*gtag/);
  assert.match(contactForm, /window\.gtag\?\.\('event', 'fit_check_submit'/);
  assert.match(contactForm, /window\.gtag\?\.\('event', 'generate_lead'/);
});

test('approved acquisition sources avoid unverified capability claims', async () => {
  const approvedSources = await Promise.all([
    read('../src/pages/index.astro'),
    read('../src/pages/contact.astro'),
    read('../src/components/ContactForm.tsx'),
  ]);
  const copy = approvedSources.join('\n').toLowerCase();

  for (const claim of [
    'our factory',
    'verified supplier network',
    'guaranteed result',
    'guaranteed delivery',
    'fixed moq',
    'fixed lead time',
  ]) {
    assert.doesNotMatch(copy, new RegExp(claim));
  }
});

test('cornerstone feeder guide is review-ready but excluded from publication', async () => {
  const article = await read('../src/content/blog/pet-tech-feeder-drive-system.md');

  assert.match(article, /^---[\s\S]*?draft:\s*true[\s\S]*?status:\s*["']?draft["']?[\s\S]*?---/);
  assert.match(article, /title:\s*["']Smart Pet Feeder Mechanical Drive System: Motor Selection, Gearbox Design and BOM Analysis["']/);
  assert.match(article, /⚠️ Pending Review/);
  assert.match(article, /## Direct answer/i);

  for (const section of ['Motor', 'Gearbox', 'Screw mechanism', 'Position detection', 'Housing', 'Control system']) {
    assert.match(article, new RegExp(`##[^\\n]*${section}`, 'i'), `missing article section: ${section}`);
  }

  assert.match(article, /## BOM decision table/i);
  assert.match(article, /## DFM questions/i);
  assert.match(article, /## Evidence sources/i);
  assert.match(article, /https:\/\//);
  assert.match(article, /\/products/);
  assert.match(article, /\/contact\?entry=pet-feeder-guide/);
  assert.match(article, /Start a Project Fit Check/);
});
