# Engineering Procurement UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Yukun website frontend UI so the homepage and navigation read as a professional engineering procurement entry for application-first compact motion component matching.

**Architecture:** Keep the existing Astro static site and content collections. Add focused procurement UI components under `src/components/procurement/`, update the homepage to compose those components, and update release-safety tests so copy, navigation, and public output stay aligned with the approved positioning.

**Tech Stack:** Astro 7 static site, Tailwind utility classes, React only where already used by `ContactForm.tsx`, Node built-in test runner, existing `npm.cmd run verify:release` release gate.

## Global Constraints

- The site should feel like an engineering procurement desk, not a commodity catalog.
- Use a light technical UI as the default reading surface, with dark navy used selectively for navigation, hero emphasis, and conversion sections.
- Do not add public pricing.
- Do not add a supplier marketplace, login, buyer dashboard, or multi-supplier comparison platform.
- Do not add claims about certification, inventory, fixed lead time, fixed response time, factory ownership, or guaranteed availability.
- Do not push, deploy, change DNS, or alter analytics configuration.
- Do not rewrite all product and solution content in this iteration.
- Keep top-level navigation to Products, Applications, Resources, About, Contact.
- Do not add `Motor Manufacturers` as a top-level header nav item.
- Use approved copy: `Discuss Your Application`, `Email Requirements`, `Review Parameters`, `Confirmed per inquiry`, `Application-first component matching`.
- Avoid public CTA copy: `Request Quote`, `Submit RFQ`, `Request Samples`.
- Preserve public email: `chinajpq@outlook.com`.
- Preserve inquiry-safety disclaimer: `Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.`

---

## File Structure

- Modify `tests/release-safety.test.mjs`
  - Owns public UI contract and safety assertions.
  - Add homepage procurement positioning assertions.
  - Update header label expectation from `Insights` to `Resources`.
  - Add homepage source/output mojibake guard.

- Modify `src/components/Header.astro`
  - Owns global navigation.
  - Keep the same structural pattern, but align label `Resources` with the design spec.
  - Keep `Discuss Your Application` as the persistent CTA.

- Create `src/components/procurement/ApplicationReviewPanel.astro`
  - Owns the right-side hero panel.
  - Displays review parameters and safe inquiry note.

- Create `src/components/procurement/ApplicationRouteCard.astro`
  - Owns one application route card.
  - Consumes title, mechanism, reviewFocus, href, and label.

- Create `src/components/procurement/ComponentFamilyCard.astro`
  - Owns one component family card.
  - Consumes family, applications, parameters, href, and note.

- Create `src/components/procurement/ManagedRfqSteps.astro`
  - Owns the four-step RFQ process.
  - Uses exact public-safe process copy.

- Create `src/components/procurement/EngineeringTrustGrid.astro`
  - Owns trust capability blocks without unsupported proof claims.

- Modify `src/pages/index.astro`
  - Owns homepage composition.
  - Replace dark template-heavy homepage sections with a light engineering procurement layout.
  - Remove broken symbols and noisy emoji from public homepage source.

- Modify `src/styles/global.css`
  - Only if needed for reusable utility classes.
  - Preserve the six Engineering Trust tokens and legacy aliases already covered by tests.

---

### Task 1: Add Release-Safety Contract for Engineering Procurement UI

**Files:**
- Modify: `tests/release-safety.test.mjs`

**Interfaces:**
- Consumes: existing `read(path)`, `walk(dir)`, `scanClaims(files)`, and `publicEmail`.
- Produces: updated safety contract that later tasks must satisfy.

- [ ] **Step 1: Write the failing homepage UI contract test**

Add this test after `motor-manufacturer landing path and inquiry attribution are present`:

```js
test('homepage presents the engineering procurement UI contract', () => {
  const home = read('src/pages/index.astro');

  assert.match(home, /Application-first component matching/i);
  assert.match(home, /Application Review/i);
  assert.match(home, /Managed RFQ/i);
  assert.match(home, /Review Parameters/i);
  assert.match(home, /Confirmed per inquiry/i);
  assert.match(home, /Email Requirements/i);
  assert.match(home, /Medical and lab equipment/i);
  assert.match(home, /Smart lock and access control/i);
  assert.match(home, /Micro DC gear motors/i);
  assert.match(home, /Motor manufacturer components/i);
});
```

- [ ] **Step 2: Update the navigation assertion to match the approved header design**

In `navigation and footer guard rails`, replace the current `Insights` assertion with:

```js
  assert.match(header, /label:\s*'Resources'/);
  assert.match(header, /href:\s*'\/resources'/);
```

- [ ] **Step 3: Add a homepage mojibake source guard**

Add this block inside `homepage presents the engineering procurement UI contract`:

```js
  assert.doesNotMatch(home, /(?:鈺|鈹|馃|锔|儯|闆|婊|涓|||晲)/);
```

- [ ] **Step 4: Extend built output guard for public homepage mojibake**

Inside `built output excludes drafts and standing claims when dist exists`, after reading each `html`, add:

```js
    if (file.endsWith(join('dist', 'index.html'))) {
      assert.doesNotMatch(html, /(?:鈺|鈹|馃|锔|儯|闆|婊|涓|||晲)/);
      assert.match(html, /Application-first component matching/i);
      assert.match(html, /Application Review/i);
      assert.match(html, /Managed RFQ/i);
    }
```

- [ ] **Step 5: Run the test and verify it fails for the expected reason**

Run:

```powershell
node --test tests/release-safety.test.mjs
```

Expected result:

- FAIL.
- Failure mentions missing `Application-first component matching` or the existing header still using `Insights`.
- If it fails only because an old `dist/index.html` exists, run `npm.cmd run build` once, then rerun the test and confirm the source-level assertion still fails before implementation.

- [ ] **Step 6: Commit the failing contract test**

Commit only the test change:

```powershell
git add tests/release-safety.test.mjs
git commit -m "test: define engineering procurement UI contract"
```

---

### Task 2: Align Header Navigation With Procurement Positioning

**Files:**
- Modify: `src/components/Header.astro`

**Interfaces:**
- Consumes: existing `navItems` array structure.
- Produces: top-level nav labels `Products`, `Applications`, `Resources`, `About`, `Contact`; persistent CTA `Discuss Your Application`.

- [ ] **Step 1: Verify the Task 1 navigation test is red before editing header**

Run:

```powershell
node --test tests/release-safety.test.mjs
```

Expected result:

- FAIL because header source still has `label: 'Insights'` instead of `label: 'Resources'`.

- [ ] **Step 2: Update the header top-level label**

In `src/components/Header.astro`, change:

```js
  {
    label: 'Insights',
    href: '/resources',
```

to:

```js
  {
    label: 'Resources',
    href: '/resources',
```

Keep the existing children:

```js
children: [
  { label: 'Selection Guides', href: '/resources/selection-guides' },
  { label: 'Datasheets', href: '/resources/datasheets' },
  { label: 'CAD Models', href: '/resources/cad-models' },
  { label: 'FAQ', href: '/resources/faq' },
],
```

- [ ] **Step 3: Confirm no top-level Motor Manufacturers nav was introduced**

Run:

```powershell
Select-String -LiteralPath 'src\components\Header.astro' -Pattern 'Motor Manufacturers'
```

Expected result:

- No output.

- [ ] **Step 4: Run safety tests**

Run:

```powershell
node --test tests/release-safety.test.mjs
```

Expected result:

- The navigation portion passes.
- The homepage procurement contract remains red until Task 3 finishes.

- [ ] **Step 5: Commit header change**

Commit only the header change:

```powershell
git add src/components/Header.astro
git commit -m "feat: align header with procurement navigation"
```

---

### Task 3: Add Procurement UI Components

**Files:**
- Create: `src/components/procurement/ApplicationReviewPanel.astro`
- Create: `src/components/procurement/ApplicationRouteCard.astro`
- Create: `src/components/procurement/ComponentFamilyCard.astro`
- Create: `src/components/procurement/ManagedRfqSteps.astro`
- Create: `src/components/procurement/EngineeringTrustGrid.astro`

**Interfaces:**
- Produces: reusable Astro components imported by `src/pages/index.astro`.
- Component prop contracts:
  - `ApplicationRouteCard`: `{ label: string; title: string; mechanism: string; reviewFocus: string; href: string }`
  - `ComponentFamilyCard`: `{ family: string; applications: string; parameters: string[]; href: string; note?: string }`
  - `ApplicationReviewPanel`: no required props.
  - `ManagedRfqSteps`: no required props.
  - `EngineeringTrustGrid`: no required props.

- [ ] **Step 1: Verify Task 1 homepage contract is red before adding components**

Run:

```powershell
node --test tests/release-safety.test.mjs
```

Expected result:

- FAIL because `src/pages/index.astro` does not yet contain the approved procurement UI phrases and still contains broken symbols.

- [ ] **Step 2: Create `ApplicationReviewPanel.astro`**

Create `src/components/procurement/ApplicationReviewPanel.astro`:

```astro
---
const parameters = [
  'Voltage',
  'Torque / Load',
  'Envelope',
  'Speed',
  'Noise',
  'Duty Cycle',
  'Mounting',
  'Connector',
  'Feedback',
  'Documents',
  'Sample Stage',
  'Production Stage',
];
---

<aside class="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-xl shadow-slate-900/10">
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical)]">Application Review</p>
      <h2 class="mt-3 text-2xl font-semibold text-[var(--color-ink)]">Review Parameters</h2>
    </div>
    <span class="tech-mono rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-[11px] text-[var(--color-ink-muted)]">
      Inquiry-led
    </span>
  </div>

  <p class="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
    Share the working conditions and constraints behind the part number. Yukun reviews component families against the application before commercial terms are confirmed.
  </p>

  <div class="mt-6 flex flex-wrap gap-2">
    {parameters.map((parameter) => (
      <span class="tech-mono rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-[11px] text-cyan-800">
        {parameter}
      </span>
    ))}
  </div>

  <div class="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
    <p class="text-sm font-semibold text-amber-900">Confirmed per inquiry</p>
    <p class="mt-1 text-xs leading-relaxed text-amber-800">
      Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.
    </p>
  </div>
</aside>
```

- [ ] **Step 3: Create `ApplicationRouteCard.astro`**

Create `src/components/procurement/ApplicationRouteCard.astro`:

```astro
---
interface Props {
  label: string;
  title: string;
  mechanism: string;
  reviewFocus: string;
  href: string;
}

const { label, title, mechanism, reviewFocus, href } = Astro.props;
---

<a href={href} class="group block rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-technical)] hover:shadow-lg hover:shadow-slate-900/5">
  <p class="tech-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-technical)]">{label}</p>
  <h3 class="mt-3 text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
  <p class="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">{mechanism}</p>
  <div class="mt-4 rounded-xl bg-[var(--color-surface-muted)] p-3">
    <p class="tech-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Review focus</p>
    <p class="mt-1 text-sm text-[var(--color-ink)]">{reviewFocus}</p>
  </div>
  <span class="mt-4 inline-flex text-sm font-semibold text-[var(--color-action)] group-hover:text-[var(--color-action-hover)]">
    Review application →
  </span>
</a>
```

- [ ] **Step 4: Create `ComponentFamilyCard.astro`**

Create `src/components/procurement/ComponentFamilyCard.astro`:

```astro
---
interface Props {
  family: string;
  applications: string;
  parameters: string[];
  href: string;
  note?: string;
}

const { family, applications, parameters, href, note = 'Specifications and commercial terms confirmed per inquiry.' } = Astro.props;
---

<a href={href} class="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[var(--color-action)] hover:shadow-lg hover:shadow-slate-900/5">
  <div class="flex items-start justify-between gap-4">
    <h3 class="text-lg font-semibold text-[var(--color-ink)]">{family}</h3>
    <span class="tech-mono rounded-full bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">Family</span>
  </div>
  <p class="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">{applications}</p>
  <div class="mt-4 flex flex-wrap gap-2">
    {parameters.map((parameter) => (
      <span class="tech-mono rounded-full border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600">{parameter}</span>
    ))}
  </div>
  <p class="mt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">{note}</p>
  <span class="mt-4 inline-flex text-sm font-semibold text-[var(--color-action)] group-hover:text-[var(--color-action-hover)]">
    View component route →
  </span>
</a>
```

- [ ] **Step 5: Create `ManagedRfqSteps.astro`**

Create `src/components/procurement/ManagedRfqSteps.astro`:

```astro
---
const steps = [
  {
    number: '01',
    title: 'Share application context',
    text: 'Send the mechanism, working voltage, space limits, target function, and current reference part if available.',
  },
  {
    number: '02',
    title: 'Clarify technical parameters',
    text: 'Review load, speed, noise, lifetime, sealing, connector, mounting, feedback, and documentation requirements.',
  },
  {
    number: '03',
    title: 'Review matching component options',
    text: 'Compare suitable motor, gear motor, pump, switch, terminal, or contact-component routes for the application.',
  },
  {
    number: '04',
    title: 'Coordinate documents and order follow-up',
    text: 'Coordinate drawings, specifications, sample discussion, and order follow-up after the inquiry scope is confirmed.',
  },
];
---

<section class="rounded-3xl bg-[var(--color-navy)] px-6 py-10 text-white md:px-10">
  <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical-light)]">Managed RFQ</p>
  <div class="mt-3 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
    <h2 class="text-3xl font-semibold">A practical review flow before sourcing decisions</h2>
    <p class="text-sm leading-relaxed text-[var(--color-navy-ink-muted)]">
      The process keeps engineering and purchasing aligned without making standing promises about price, availability, or lead time.
    </p>
  </div>
  <div class="mt-8 grid gap-4 md:grid-cols-4">
    {steps.map((step) => (
      <article class="rounded-2xl border border-[var(--color-navy-border)] bg-white/5 p-5">
        <p class="tech-mono text-xs text-[var(--color-technical-light)]">{step.number}</p>
        <h3 class="mt-3 text-base font-semibold text-white">{step.title}</h3>
        <p class="mt-3 text-sm leading-relaxed text-[var(--color-navy-ink-muted)]">{step.text}</p>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 6: Create `EngineeringTrustGrid.astro`**

Create `src/components/procurement/EngineeringTrustGrid.astro`:

```astro
---
const trustItems = [
  {
    title: 'Application-first review',
    text: 'Start from the mechanism, constraints, and evaluation stage before narrowing component routes.',
  },
  {
    title: 'Component family comparison',
    text: 'Compare motors, gearboxes, pumps, switches, and contact components by function and integration risk.',
  },
  {
    title: 'Drawing and document coordination',
    text: 'Coordinate available drawings, specifications, and quality documents required for evaluation.',
  },
  {
    title: 'Supplier communication follow-up',
    text: 'Keep technical clarification and order follow-up connected after the inquiry scope is confirmed.',
  },
];
---

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {trustItems.map((item) => (
    <article class="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-[var(--color-technical)]">✓</div>
      <h3 class="mt-4 text-base font-semibold text-[var(--color-ink)]">{item.title}</h3>
      <p class="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">{item.text}</p>
    </article>
  ))}
</div>
```

- [ ] **Step 7: Run focused syntax check through Astro build**

Run:

```powershell
npm.cmd run build
```

Expected result:

- PASS.
- If Astro reports an invalid prop or class syntax, fix the component named in the error and rerun this command.

- [ ] **Step 8: Commit procurement components**

Commit only new component files:

```powershell
git add src/components/procurement/ApplicationReviewPanel.astro src/components/procurement/ApplicationRouteCard.astro src/components/procurement/ComponentFamilyCard.astro src/components/procurement/ManagedRfqSteps.astro src/components/procurement/EngineeringTrustGrid.astro
git commit -m "feat: add engineering procurement UI components"
```

---

### Task 4: Rebuild Homepage Around Engineering Procurement Flow

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes:
  - `ApplicationReviewPanel` from `../components/procurement/ApplicationReviewPanel.astro`
  - `ApplicationRouteCard` from `../components/procurement/ApplicationRouteCard.astro`
  - `ComponentFamilyCard` from `../components/procurement/ComponentFamilyCard.astro`
  - `ManagedRfqSteps` from `../components/procurement/ManagedRfqSteps.astro`
  - `EngineeringTrustGrid` from `../components/procurement/EngineeringTrustGrid.astro`
- Produces:
  - Homepage with approved contract phrases.
  - No broken emoji or mojibake in homepage source.

- [ ] **Step 1: Confirm homepage contract is still red before editing homepage**

Run:

```powershell
node --test tests/release-safety.test.mjs
```

Expected result:

- FAIL for homepage procurement contract or homepage mojibake guard.

- [ ] **Step 2: Replace imports**

At the top of `src/pages/index.astro`, keep:

```astro
import BaseLayout from '../layouts/BaseLayout.astro';
import OrganizationSchema from '../components/seo/OrganizationSchema.astro';
import { getCollection } from 'astro:content';
```

Add:

```astro
import ApplicationReviewPanel from '../components/procurement/ApplicationReviewPanel.astro';
import ApplicationRouteCard from '../components/procurement/ApplicationRouteCard.astro';
import ComponentFamilyCard from '../components/procurement/ComponentFamilyCard.astro';
import ManagedRfqSteps from '../components/procurement/ManagedRfqSteps.astro';
import EngineeringTrustGrid from '../components/procurement/EngineeringTrustGrid.astro';
```

Remove unused homepage imports:

```astro
import LabComponentMap from '../components/lab/LabComponentMap.astro';
import LabSectionHeader from '../components/lab/LabSectionHeader.astro';
```

- [ ] **Step 3: Replace homepage data arrays**

Use these arrays in the frontmatter:

```astro
const applicationRoutes = [
  {
    label: 'Medical',
    title: 'Medical and lab equipment',
    mechanism: 'Compact dosing, air movement, sample handling, and small actuation mechanisms.',
    reviewFocus: 'Noise, lifetime, duty cycle, documentation, and integration constraints.',
    href: '/solutions/medical-device-micro-drive-solution',
  },
  {
    label: 'Security',
    title: 'Smart lock and access control',
    mechanism: 'Lock cylinders, latch drives, privacy bolts, and position feedback mechanisms.',
    reviewFocus: 'Torque margin, stall behavior, self-locking, feedback, size, and noise.',
    href: '/solutions/smart-lock-micro-motor-solution',
  },
  {
    label: 'EV',
    title: 'EV charging and automotive actuators',
    mechanism: 'Connector lock actuators, compact locking drives, and position signal assemblies.',
    reviewFocus: 'Self-locking, operating voltage, environmental exposure, switch signal, and connector fit.',
    href: '/solutions/ev-charging-gun-actuator-solution',
  },
  {
    label: 'Robotics',
    title: 'Robotics and grippers',
    mechanism: 'Small joints, grippers, feedback-equipped drives, and compact motion modules.',
    reviewFocus: 'Ratio, backlash, torque density, control feedback, and envelope limits.',
    href: '/solutions/robotics-joint-actuator',
  },
  {
    label: 'Industrial',
    title: 'Industrial automation',
    mechanism: 'Valve controls, dispensers, positioning equipment, and compact drive assemblies.',
    reviewFocus: 'Load profile, duty cycle, mounting, connector, service environment, and repeatability.',
    href: '/solutions/industrial-automation-drive',
  },
  {
    label: 'IoT',
    title: 'Smart home and IoT',
    mechanism: 'Motorized curtains, smart valves, adjustable products, and connected mechanisms.',
    reviewFocus: 'Low noise, compact envelope, operating voltage, lifetime, and assembly fit.',
    href: '/solutions/smart-home-automation',
  },
];

const componentFamilies = [
  {
    family: 'Micro DC gear motors',
    applications: 'Spur, planetary, and worm-drive routes for locks, valves, toys, instruments, and small actuators.',
    parameters: ['Voltage', 'Ratio', 'Torque', 'Speed', 'Noise', 'Shaft'],
    href: '/products',
  },
  {
    family: 'Brushless DC motors',
    applications: 'Compact BLDC routes for higher-speed, smoother-running, or longer-life motion requirements.',
    parameters: ['Voltage', 'KV / Speed', 'Envelope', 'Driver', 'Noise', 'Duty'],
    href: '/products',
  },
  {
    family: 'Micro pumps',
    applications: 'Diaphragm and peristaltic pump routes for dosing, sampling, air, liquid, and instrument functions.',
    parameters: ['Flow', 'Pressure', 'Media', 'Noise', 'Tube', 'Duty'],
    href: '/solutions/medical-device-micro-drive-solution',
  },
  {
    family: 'Micro switches',
    applications: 'Waterproof and subminiature switch routes for position feedback, limit detection, and safety signals.',
    parameters: ['Rating', 'IP Need', 'Actuator', 'Travel', 'Mounting', 'Signal'],
    href: '/products',
  },
  {
    family: 'Motor manufacturer components',
    applications: 'Commutators, carbon brush assemblies, terminals, and contact components for brushed DC motor makers.',
    parameters: ['Material', 'Dimensions', 'Contact', 'Fit', 'Drawing', 'Process'],
    href: '/motor-manufacturers',
  },
];
```

Keep:

```astro
const blogPosts = await getCollection('blog', ({ data }) => !data.draft);
const latestPosts = blogPosts
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
  .slice(0, 3);
```

- [ ] **Step 4: Replace the page body with procurement flow sections**

Inside `<BaseLayout ogType="website">`, use this section order:

```astro
<section class="bg-[var(--color-surface)]">
  <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
    <div>
      <p class="tech-mono text-xs uppercase tracking-[0.2em] text-[var(--color-technical)]">Compact Motion Component Matching</p>
      <h1 class="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-[var(--color-ink)] md:text-6xl">
        Application-first component matching for compact motion systems
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
        Yukun helps engineering and sourcing teams clarify requirements for micro motors, gear motors, pumps, switches, terminals, and contact components before product and commercial details are confirmed per inquiry.
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href="/contact" class="inline-flex items-center justify-center rounded-lg bg-[var(--color-action)] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-amber-900/10 transition hover:bg-[var(--color-action-hover)]">
          Discuss Your Application
        </a>
        <a href="mailto:chinajpq@outlook.com" class="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] px-6 py-3 text-base font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-technical)] hover:text-[var(--color-technical)]">
          Email Requirements
        </a>
      </div>
      <div class="mt-8 grid gap-3 sm:grid-cols-3">
        {['Engineering teams', 'Sourcing teams', 'Motor manufacturers'].map((label) => (
          <div class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <p class="tech-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Built for</p>
            <p class="mt-1 text-sm font-semibold text-[var(--color-ink)]">{label}</p>
          </div>
        ))}
      </div>
    </div>
    <ApplicationReviewPanel />
  </div>
</section>
```

Then add:

```astro
<section class="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)]">
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical)]">Application Routes</p>
      <h2 class="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Start from the mechanism, then narrow the component route</h2>
      <p class="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
        The fastest path is not a part-number search. It is a structured review of the application, constraints, and evaluation stage.
      </p>
    </div>
    <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {applicationRoutes.map((route) => <ApplicationRouteCard {...route} />)}
    </div>
  </div>
</section>

<section class="bg-white">
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical)]">Component Families</p>
        <h2 class="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Component routes for compact motion decisions</h2>
        <p class="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
          Browse by family when the application direction is known, then confirm specifications and commercial terms for the inquiry.
        </p>
      </div>
      <div class="grid gap-5 md:grid-cols-2">
        {componentFamilies.map((family) => <ComponentFamilyCard {...family} />)}
      </div>
    </div>
  </div>
</section>

<section class="bg-[var(--color-surface-muted)]">
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <ManagedRfqSteps />
  </div>
</section>

<section class="bg-white">
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical)]">Engineering Trust</p>
      <h2 class="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Professional, restrained, and built for selection clarity</h2>
      <p class="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
        Yukun focuses on requirement clarification, component comparison, and inquiry coordination without unsupported standing claims.
      </p>
    </div>
    <div class="mt-10">
      <EngineeringTrustGrid />
    </div>
  </div>
</section>
```

For latest posts, keep a concise resources section:

```astro
<section class="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)]">
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical)]">Resources</p>
        <h2 class="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Engineering notes for selection and teardown thinking</h2>
      </div>
      <a href="/blog" class="text-sm font-semibold text-[var(--color-action)] hover:text-[var(--color-action-hover)]">View resources →</a>
    </div>
    <div class="mt-8 grid gap-5 md:grid-cols-3">
      {latestPosts.map((post) => (
        <a href={`/blog/${post.data.slug}`} class="block rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:border-[var(--color-technical)]">
          <p class="tech-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">{post.data.category}</p>
          <h3 class="mt-3 text-base font-semibold text-[var(--color-ink)]">{post.data.title?.split('|')[0]?.trim()}</h3>
          <p class="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">{post.data.meta_description}</p>
        </a>
      ))}
    </div>
  </div>
</section>
```

Add final CTA:

```astro
<section class="bg-white">
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-[var(--color-border)] bg-[var(--color-navy)] p-8 text-white md:p-12">
      <div class="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p class="tech-mono text-xs uppercase tracking-[0.18em] text-[var(--color-technical-light)]">Send Requirements</p>
          <h2 class="mt-3 text-3xl font-semibold">Send your application, constraints, drawings, or target specifications.</h2>
          <p class="mt-4 text-base leading-relaxed text-[var(--color-navy-ink-muted)]">
            Include voltage, load, space, speed, noise, duty cycle, connector, mounting, feedback, and current reference parts when available.
          </p>
        </div>
        <div class="space-y-3">
          <a href="/contact" class="flex w-full items-center justify-center rounded-lg bg-[var(--color-action)] px-6 py-3 text-base font-semibold text-white hover:bg-[var(--color-action-hover)]">
            Discuss Your Application
          </a>
          <a href="mailto:chinajpq@outlook.com" class="flex w-full items-center justify-center rounded-lg border border-[var(--color-navy-border)] px-6 py-3 text-base font-semibold text-white hover:border-[var(--color-technical-light)]">
            Email Requirements
          </a>
          <p class="text-center text-xs text-[var(--color-navy-ink-muted)]">chinajpq@outlook.com</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

Keep at the bottom:

```astro
<OrganizationSchema slot="structured-data" />
```

- [ ] **Step 5: Run safety tests**

Run:

```powershell
node --test tests/release-safety.test.mjs
```

Expected result:

- PASS.
- If built output assertions fail because `dist` is stale, run `npm.cmd run build`, then rerun the test.

- [ ] **Step 6: Commit homepage rebuild**

Commit homepage change:

```powershell
git add src/pages/index.astro
git commit -m "feat: rebuild homepage as engineering procurement entry"
```

---

### Task 5: Final Release Verification and Public Output Scan

**Files:**
- Modify: no source files expected.
- Generated: `dist/` may be refreshed by build and remains uncommitted unless the repository tracks it.

**Interfaces:**
- Consumes: all changes from Tasks 1-4.
- Produces: verified local branch ready for user review.

- [ ] **Step 1: Run full release verification**

Run:

```powershell
npm.cmd run verify:release
```

Expected result:

- Release-safety test output reports all tests pass.
- Astro build exits 0.
- SEO/GEO audit reports `Summary: 30/30 pages pass`.
- SEO/GEO audit reports `Issues: 0`.

- [ ] **Step 2: Scan final build output for prohibited commercial claims**

Run:

```powershell
Get-ChildItem -Recurse -File -Path 'dist' -Include '*.html','*.js' | Select-String -Pattern 'Request Quote|Request Samples?|Submit RFQ|FOB|CIF|DDP|MOQ|unit price|pricing|price from|within\s+\d+\s*(hours?|business days?)|certified factory|our factory|inventory|@YukunDrive|linkedin\.com/company/yukun-drive|youtube\.com/@YukunDrive|x\.com/YukunDrive|tiktok\.com/@yukundrive' -CaseSensitive:$false
```

Expected result:

- No output.

- [ ] **Step 3: Scan final homepage output for broken symbols**

Run:

```powershell
Select-String -LiteralPath 'dist\index.html' -Pattern '鈺|鈹|馃|锔|儯|闆|婊|涓|||晲'
```

Expected result:

- No output.

- [ ] **Step 4: Confirm changed files and branch status**

Run:

```powershell
git status --short --branch
git diff --stat
```

Expected result:

- No unexpected files.
- If all implementation commits were made, `git diff --stat` has no output.
- Branch is ahead of remote by the new local commits.

- [ ] **Step 5: Report to user**

Report:

- Commit hashes created during implementation.
- Verification commands and their pass/fail counts.
- Whether the branch was pushed or deployed.
- Any warnings that remain in SEO/GEO audit, including the existing sitemap warning if it still appears.

Do not push or deploy unless the user separately authorizes that action.

