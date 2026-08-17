# Industrial Editorial Homepage Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally verify an image-light industrial-editorial homepage prototype without introducing unsupported claims.

**Architecture:** Replace homepage visual assets with a small Astro component that renders a semantic engineering brief in HTML and SVG. Keep global tokens in `global.css`; use release-safety assertions to prevent generated-image references and asserted performance values from returning.

**Tech Stack:** Astro, Tailwind utility classes, project CSS tokens, Node test runner, Playwright CLI.

## Global Constraints

- Do not deploy, push, merge, or modify Cloudflare Pages.
- Do not include product, factory, customer, country, person, animal, or generated imagery in the prototype.
- Do not show numerical technical values, certifications, availability, lead times, or commercial promises.
- Preserve existing contact and GA4 integrations.

---

### Task 1: Add a safety specification test

**Files:**
- Modify: `tests/release-safety.test.mjs`

**Interfaces:**
- Consumes: `src/pages/index.astro` source text.
- Produces: a regression assertion for the image-light editorial homepage.

- [ ] **Step 1: Write the failing test**

```js
assert.doesNotMatch(home, /gmip-smart-feeder-cutaway\.png|gmip-motion-validation-concept\.png/);
assert.match(home, /From product definition to controlled execution in China/);
assert.match(home, /Engineering Brief/);
assert.match(home, /Review inputs/);
assert.doesNotMatch(home, /\b(?:IP\d+|\d+\s*(?:N|mm|V|rpm|°C))\b/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd run test:release-safety`

Expected: FAIL because the homepage still references generated image assets.

- [ ] **Step 3: Keep the test as the visual safety contract**

Do not change existing claim guardrails or contact-flow checks.

- [ ] **Step 4: Run test after implementation**

Run: `npm.cmd run test:release-safety`

Expected: PASS.

### Task 2: Build an HTML engineering brief panel

**Files:**
- Create: `src/components/home/EngineeringBrief.astro`

**Interfaces:**
- Consumes: shared CSS custom properties in `src/styles/global.css`.
- Produces: `<EngineeringBrief />`, an image-free hero-side panel.

- [ ] **Step 1: Create the semantic panel**

Include the following text labels only: `Engineering Brief`, `Component overview`, `Material / surface`, `Review inputs`, `Define`, `Review`, and `Execute`.

- [ ] **Step 2: Draw a neutral component outline**

Use inline SVG paths and circles without dimensions, brands, or performance annotations.

- [ ] **Step 3: Add material swatches and process labels**

Use abstract graphite hatch fills and neutral material labels. Use no numeric values or compliance terms.

### Task 3: Replace the image-led homepage sections

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `<EngineeringBrief />` from Task 2.
- Produces: responsive editorial hero and input/timeline sections.

- [ ] **Step 1: Import and render the panel**

Replace generated `<img>` elements with `<EngineeringBrief />` in the hero.

- [ ] **Step 2: Rewrite the supporting section**

Use the headline `From product definition to controlled execution in China` and supporting labels `Motion and load`, `Product envelope`, `Control and sensing`, `Market use case`.

- [ ] **Step 3: Style for desktop and mobile**

Use CSS grid, deep navy only in the header/hero, warm white reading areas, thin graphite borders, and reduced-motion-safe progress treatment.

### Task 4: Validate visual behavior

**Files:**
- Test: local Astro build output

**Interfaces:**
- Consumes: production `dist/` folder.
- Produces: desktop and mobile browser evidence.

- [ ] **Step 1: Build**

Run: `$env:ASTRO_TELEMETRY_DISABLED='1'; .\node_modules\.bin\astro.cmd build`

Expected: Astro builds all static routes.

- [ ] **Step 2: Run release safety tests**

Run: `npm.cmd run test:release-safety`

Expected: all tests pass.

- [ ] **Step 3: Check desktop and mobile**

Use Playwright CLI at 1440px and 390px. Confirm visible CTA labels, no clipped content, and no browser console errors.
