# Product Detail and Contact Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unverified product-image placeholder with a truthful fallback and restore legible contact-card text without changing lead delivery.

**Architecture:** The Astro product route owns the `data.image` decision; product content already exposes it as optional. Contact-card foreground colors are made explicit only on the two dark cards so legacy form tokens remain untouched. Existing Node source-contract tests enforce the public contract; a local browser check validates native invalid-form behavior without sending a lead.

**Tech Stack:** Astro 7, Tailwind CSS 4, React 19 form island, Node test runner, Playwright CLI.

## Global Constraints

- Do not add generated, stock, or unverified hardware imagery.
- Render a supplied `data.image`; otherwise show text-only application briefing content.
- Do not modify Web3Forms, analytics, field names, email routing, or submission logic.
- Do not submit valid form data during browser acceptance.
- Preserve inquiry-safety copy; do not add commercial, delivery, inventory, or certification claims.
- Do not push, deploy, or change DNS.

---

### Task 1: Define public fallback and contrast contracts

**Files:**

- Modify: `tests/release-safety.test.mjs`

**Interfaces:**

- Consumes: the existing `read(path)` helper and Node strict assertions.
- Produces: a regression contract for conditional product media and card-local foreground tokens.

- [ ] **Step 1: Write the failing test**

Append this test after `contact flow is email-first and does not embed a Web3Forms key`:

```js
test('product media fallback avoids unverified placeholder imagery and contact cards use navy contrast tokens', () => {
  const productPage = read('src/pages/products/[slug].astro');
  const contactPage = read('src/pages/contact.astro');

  assert.match(productPage, /data\.image\s*\?/);
  assert.match(productPage, /Configuration reviewed per inquiry/);
  assert.doesNotMatch(productPage, /Product image coming soon/);
  assert.match(contactPage, /text-\[var\(--color-navy-ink\)\]/);
  assert.match(contactPage, /text-\[var\(--color-navy-ink-muted\)\]/);
  assert.match(contactPage, /text-\[var\(--color-technical-light\)\]/);
});
```

- [ ] **Step 2: Verify RED**

```powershell
node --test --test-name-pattern="product media fallback" tests/release-safety.test.mjs
```

Expected: FAIL because the product page retains the placeholder and contact cards lack the required classes.

- [ ] **Step 3: Commit the failing test**

```powershell
git add tests/release-safety.test.mjs
git commit -m "test: cover product fallback and contact contrast"
```

### Task 2: Implement the truthful product-detail fallback

**Files:**

- Modify: `src/pages/products/[slug].astro`

**Interfaces:**

- Consumes: `data.image`, `data.category`, `data.product_code`, and `productName` already available in page frontmatter.
- Produces: an actual image for entries with `data.image`, or an `Application brief` panel for entries without it.

- [ ] **Step 1: Confirm product assertions remain RED**

```powershell
node --test --test-name-pattern="product media fallback" tests/release-safety.test.mjs
```

Expected: FAIL on the `data.image` and placeholder-copy assertions.

- [ ] **Step 2: Replace the current hero placeholder with this conditional block**

```astro
{data.image ? (
  <img src={data.image} alt={productName} class="aspect-square w-full rounded-xl border border-[var(--color-border-default)] object-cover" loading="eager" />
) : (
  <aside class="aspect-square rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-8 text-[var(--color-navy-ink)]">
    <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical-light)]">Application brief</p>
    <p class="mt-8 text-sm text-[var(--color-navy-ink-muted)]">{data.category}</p>
    <h2 class="mt-2 text-2xl font-semibold">{productName}</h2>
    <p class="mt-3 text-sm text-[var(--color-navy-ink-muted)]">{data.product_code}</p>
    <div class="mt-8 border-t border-[var(--color-navy-border)] pt-5">
      <p class="text-sm font-semibold">Configuration reviewed per inquiry</p>
      <p class="mt-2 text-sm leading-relaxed text-[var(--color-navy-ink-muted)]">Share the application, operating conditions, and integration constraints before selecting a configuration.</p>
    </div>
  </aside>
)}
```

- [ ] **Step 3: Verify the product part is GREEN**

```powershell
node --test --test-name-pattern="product media fallback" tests/release-safety.test.mjs
```

Expected: the product assertions pass; contact assertions remain red.

- [ ] **Step 4: Commit**

```powershell
git add src/pages/products/[slug].astro
git commit -m "fix: replace product image placeholder"
```

### Task 3: Restore contact-card contrast locally

**Files:**

- Modify: `src/pages/contact.astro`

**Interfaces:**

- Consumes: existing `--color-navy-ink`, `--color-navy-ink-muted`, and `--color-technical-light` tokens in `src/styles/global.css`.
- Produces: explicit light foreground styles for the two dark right-column cards only.

- [ ] **Step 1: Confirm the contact part is RED**

```powershell
node --test --test-name-pattern="product media fallback" tests/release-safety.test.mjs
```

Expected: FAIL only because the Contact page lacks navy contrast classes.

- [ ] **Step 2: Apply these exact class substitutions in both cards**

```astro
<div class="... text-[var(--color-navy-ink)]">
<h3 class="text-lg font-semibold mb-4 text-[var(--color-navy-ink)]">
<p class="text-[var(--color-navy-ink-muted)]">Email</p>
<a href="mailto:chinajpq@outlook.com" class="text-[var(--color-technical-light)] hover:text-white">
<p class="text-[var(--color-navy-ink)]">Shenzhen, Guangdong, China</p>
<span class="... text-[var(--color-technical-light)] ...">1</span>
<p class="text-[var(--color-navy-ink-muted)]">...</p>
```

Apply the final two lines to every numbered item. Do not edit `ContactForm.tsx` or `global.css`.

- [ ] **Step 3: Verify GREEN**

```powershell
node --test --test-name-pattern="product media fallback" tests/release-safety.test.mjs
```

Expected: PASS with no failures.

- [ ] **Step 4: Commit**

```powershell
git add src/pages/contact.astro
git commit -m "fix: improve contact card contrast"
```

### Task 4: Verify release output and browser behavior

**Files:**

- No source changes expected.

**Interfaces:**

- Consumes: Tasks 1-3 and scripts defined in `package.json`.
- Produces: fresh test/build/SEO/browser evidence without external submission.

- [ ] **Step 1: Run the full release gate**

```powershell
npm.cmd run verify:release
```

Expected: exit 0; release-safety tests, Astro build, and SEO audit succeed.

- [ ] **Step 2: Start the local server in repository-approved background mode**

```powershell
npm.cmd run dev -- --background
```

Expected: local URL reported by Astro.

- [ ] **Step 3: Verify product fallback in a real browser**

```powershell
npx --yes --package @playwright/cli playwright-cli open http://localhost:4321/products/370-worm-self-locking-gear-motor/
npx --yes --package @playwright/cli playwright-cli snapshot
```

Expected: `Application brief` and `Configuration reviewed per inquiry` are present; `Product image coming soon` is absent.

- [ ] **Step 4: Verify native empty-form blocking with no submission**

```powershell
npx --yes --package @playwright/cli playwright-cli open http://localhost:4321/contact/
npx --yes --package @playwright/cli playwright-cli snapshot
npx --yes --package @playwright/cli playwright-cli click eX
npx --yes --package @playwright/cli playwright-cli snapshot
```

Replace `eX` with the submit-button reference from the immediate snapshot; do not fill a field. Expected: the URL remains `/contact/`, native required-field validation blocks the action, and no Web3Forms request is made.

- [ ] **Step 5: Stop the server and confirm clean state**

```powershell
npm.cmd run dev -- --stop
git status --short
git log --oneline -4
```

Expected: server stopped, status clean, and history includes the design and three task commits.

