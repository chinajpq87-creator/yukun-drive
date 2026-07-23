# P0.5 Release Safety Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current Astro site into a safe capability-display and lead-generation site that hides explicit drafts, avoids standing commercial/compliance claims, and directs inquiries to `chinajpq@outlook.com`.

**Architecture:** Add a boolean `draft` field while preserving legacy `status` values, filter draft entries at every public collection query, and enforce the policy with Node's built-in test runner plus a built-output scan. Keep direct email as the primary conversion path; Web3Forms remains optional and records GA4 `generate_lead` only after a confirmed submission.

**Tech Stack:** Astro 7, TypeScript, React 19, Node.js 22 built-in test runner, existing SEO audit.

## Global Constraints

- Do not commit, push, deploy, send email, or change online accounts.
- Do not add dependencies.
- Do not delete PawVibe; mark it as an explicit local draft.
- Do not publish supplier names, employer identity, unsupported certifications, fixed prices, MOQ, capacity, lifetime, response time, sample time, or delivery promises.
- Use `chinajpq@outlook.com` for public contact.
- Use: `Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.`
- Preserve unrelated user changes in the dirty worktree.

---

### Task 1: Add a failing release-safety regression suite

**Files:**
- Create: `tests/release-safety.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository files under `src/` and built files under `dist/`.
- Produces: `npm run test:release-safety` and `npm run verify:release`.

- [ ] **Step 1: Add the Node test script to `package.json`**

```json
"test:release-safety": "node --test tests/release-safety.test.mjs",
"verify:release": "npm run test:release-safety && npm run seo:check"
```

- [ ] **Step 2: Write tests that describe the missing behavior**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test('content schema and public queries support explicit draft exclusion', () => {
  assert.match(read('src/content.config.ts'), /draft:\s*z\.boolean\(\)\.default\(false\)/);
  for (const file of [
    'src/pages/index.astro',
    'src/pages/products/index.astro',
    'src/pages/products/[slug].astro',
    'src/pages/solutions/index.astro',
    'src/pages/solutions/[slug].astro',
    'src/pages/blog/[slug].astro',
  ]) assert.match(read(file), /!.*data\.draft/);
  assert.match(read('src/content/products/pawvibe-pet-interactive-ball.md'), /^draft:\s*true$/m);
});

test('contact flow is email-first and does not embed a Web3Forms key', () => {
  const form = read('src/components/ContactForm.tsx');
  assert.doesNotMatch(form, /YOUR_WEB3FORMS_ACCESS_KEY/);
  assert.match(form, /PUBLIC_WEB3FORMS_ACCESS_KEY/);
  assert.match(form, /chinajpq@outlook\.com/);
  assert.match(form, /generate_lead/);
});

test('public source avoids standing commercial and compliance claims', () => {
  const files = walk(join(root, 'src')).filter((file) => /\.(astro|tsx|md|ts)$/.test(file));
  const prohibited = /\bFOB\b|\bCIF\b|\bDDP\b|\bMOQ\b|within 24 hours|1-week samples?|ships? in 1 week|ISO 9001|vertically integrated|our own (?:factory|manufacturing facility)/i;
  const failures = files.flatMap((file) => {
    const matches = readFileSync(file, 'utf8').split(/\r?\n/)
      .map((line, index) => ({ line, index: index + 1 }))
      .filter(({ line }) => prohibited.test(line));
    return matches.map(({ line, index }) => `${file}:${index}: ${line.trim()}`);
  });
  assert.deepEqual(failures, []);
});

test('built output excludes PawVibe when dist exists', () => {
  const page = join(root, 'dist', 'products', 'pawvibe-pet-interactive-ball', 'index.html');
  if (existsSync(join(root, 'dist'))) assert.equal(existsSync(page), false);
});
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm run test:release-safety`

Expected: FAIL for missing `draft` schema/filtering, placeholder Web3Forms key, and prohibited claims.

- [ ] **Step 4: Preserve the failing output as the baseline and continue without committing**

Run: `git diff --check`

Expected: no whitespace errors in the newly added test and package script.

---

### Task 2: Add explicit draft isolation

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/products/index.astro`
- Modify: `src/pages/products/[slug].astro`
- Modify: `src/pages/solutions/index.astro`
- Modify: `src/pages/solutions/[slug].astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/content/products/pawvibe-pet-interactive-ball.md`
- Modify: `src/content/blog/fan-teardown-ai-script.md`

**Interfaces:**
- Consumes: `draft?: boolean` from content frontmatter.
- Produces: public collection queries containing only entries for which `data.draft !== true`.

- [ ] **Step 1: Add `draft` to product, solution, blog, resource, and page schemas**

```ts
draft: z.boolean().default(false),
```

- [ ] **Step 2: Mark internal content explicitly**

```yaml
draft: true
```

Add this to PawVibe and the internal fan teardown script without deleting their existing `status` values.

- [ ] **Step 3: Filter every public collection query**

```ts
const products = await getCollection('products', ({ data }) => !data.draft);
const solutions = await getCollection('solutions', ({ data }) => !data.draft);
const posts = await getCollection('blog', ({ data }) => !data.draft);
```

Apply the relevant expression consistently in indexes, dynamic `getStaticPaths`, secondary related-content queries, and homepage collections.

- [ ] **Step 4: Run the focused draft test**

Run: `node --test --test-name-pattern="draft exclusion" tests/release-safety.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run `git diff --check`**

Expected: exit code 0.

---

### Task 3: Make email the primary inquiry path and keep forms optional

**Files:**
- Modify: `src/components/ContactForm.tsx`
- Modify: `src/components/CTA.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/products/[slug].astro`
- Modify: `src/pages/resources/index.astro`
- Modify: `src/env.d.ts` if public environment typing is absent.

**Interfaces:**
- Consumes: `import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY?: string`.
- Produces: email-first CTAs and GA4 `generate_lead` after confirmed form success.

- [ ] **Step 1: Declare browser analytics and public environment types**

```ts
interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  gtag?: (...args: unknown[]) => void;
}
```

- [ ] **Step 2: Replace the hard-coded key with the public configuration**

```ts
const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
if (!accessKey) {
  setError('Online submission is not configured. Please email chinajpq@outlook.com.');
  setLoading(false);
  return;
}
formData.append('access_key', accessKey);
```

- [ ] **Step 3: Record a successful lead and use approved confirmation copy**

```ts
window.gtag?.('event', 'generate_lead', { form_type: formType });
```

Confirmation text:

```text
Your inquiry has been received. Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.
```

- [ ] **Step 4: Change the primary public contact buttons to email**

```html
<a href="mailto:chinajpq@outlook.com">Email Your Requirements →</a>
```

Keep `/contact` as a secondary path where useful.

- [ ] **Step 5: Replace all fixed response/sample timing copy in shared templates and resource cards**

Use:

```text
Contact chinajpq@outlook.com to confirm documentation, availability, lead time, and commercial terms for your inquiry.
```

- [ ] **Step 6: Run the focused contact test**

Run: `node --test --test-name-pattern="email-first" tests/release-safety.test.mjs`

Expected: PASS.

---

### Task 4: Rewrite current public copy as display-only content

**Files:**
- Modify: `src/components/Footer.astro`
- Modify: `src/components/ProductCard.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/terms.astro`
- Modify: `src/pages/resources/index.astro`
- Modify: `src/utils/seo.ts`
- Modify: `src/content/blog/handheld-fan-teardown-n20-motor.md`
- Modify: all six existing `src/content/products/*.md` files except the isolated PawVibe draft
- Modify: all six existing `src/content/solutions/*.md` files
- Modify: `src/content/resources/selection-guide-micro-gear-motors.md`
- Modify: `src/content/pages/home.md`

**Interfaces:**
- Consumes: the public-content rules in `PROJECT_MEMORY.md`.
- Produces: neutral display copy with inquiry-based confirmation and direct email contact.

- [ ] **Step 1: Remove standing commercial terms**

Delete price tables, currency amounts, MOQ, sample fee, fixed response time, fixed sample time, and fixed production lead time. Replace the removed commercial block once per page with:

```markdown
## Inquiry and Availability

Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.

Contact [chinajpq@outlook.com](mailto:chinajpq@outlook.com) with your application, target quantity, and technical requirements.
```

- [ ] **Step 2: Remove unsupported compliance and organizational claims**

Delete certification lists, factory ownership, vertically integrated manufacturing, employer identity, exclusive-partner language, fixed capacity, fixed lifetime, and unverified years-of-manufacturing claims. Use conditional wording only when technically necessary:

```text
Applicable documentation and compliance requirements are reviewed for each specific model and inquiry.
```

- [ ] **Step 3: Preserve useful display content**

Keep application explanations, selection logic, dimensional concepts, customization categories, teardown observations, and engineering questions when they do not assert unverified facts about a specific supplied model.

- [ ] **Step 4: Add the approved disclaimer to every product and solution page**

```markdown
> Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.
```

- [ ] **Step 5: Run the prohibited-claims test and iterate until GREEN**

Run: `node --test --test-name-pattern="commercial and compliance claims" tests/release-safety.test.mjs`

Expected: PASS with an empty violation list.

---

### Task 5: Full verification and project handoff

**Files:**
- Modify: `D:/工作项目/煜坤工作台/PROJECT_MEMORY.md`
- Modify: `D:/工作项目/煜坤工作台/codex-project-brief.md`

**Interfaces:**
- Consumes: verified source and build results.
- Produces: accurate project status without secrets or access keys.

- [ ] **Step 1: Run the complete safety suite**

Run: `npm run test:release-safety`

Expected: all tests pass, 0 failures.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit code 0 and no generated `dist/products/pawvibe-pet-interactive-ball/index.html`.

- [ ] **Step 3: Run the existing SEO audit**

Run: `npm run seo:audit`

Expected: exit code 0. If pre-existing SEO failures remain, record them accurately and do not claim the audit passed.

- [ ] **Step 4: Run final source checks**

Run: `git diff --check`

Expected: exit code 0.

Run: `git status --short`

Expected: only intended local modifications plus preserved pre-existing user changes; no staging, commit, or push.

- [ ] **Step 5: Update project memory and brief**

Record the new draft isolation rule, display-only commercial policy, email-first conversion path, verification results, and remaining human steps. Do not write the real Web3Forms key or other secrets.

- [ ] **Step 6: Present the local diff and human release checklist**

The checklist must require: content review, Web3Forms key configuration if the form is desired, one real test submission, selective staging, commit, push, and deployment verification.
