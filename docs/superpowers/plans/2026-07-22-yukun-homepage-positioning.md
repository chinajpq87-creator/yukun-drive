# Yukun Homepage Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the homepage with Yukun’s approved role as an engineering and supply service provider.

**Architecture:** Keep the existing six-section homepage and its content-collection queries. Replace only public copy that implies factory ownership or fixed operational commitments with partner-network and per-inquiry coordination language.

**Tech Stack:** Astro 7, Tailwind CSS 4, Astro content collections.

## Global Constraints

- Do not name Yibao or any manufacturing partner on the public website.
- Do not imply that Yukun owns a factory or disclose partner identity, capacity, location, contact details, or certifications.
- Do not promise fixed sample timing, response timing, production timing, Incoterms, availability, or commercial terms.
- State that product details, availability, lead time, and commercial terms are confirmed for each inquiry.
- Do not commit, push, deploy, or publish. Show the final Git diff and build result for user review.

---

### Task 1: Align homepage copy with the approved service-provider positioning

**Files:**
- Modify: `src/pages/index.astro:111, 284-323, 402-411`
- Test: `npm.cmd run build`

**Consumes:** The approved positioning specification at `docs/superpowers/specs/2026-07-22-yukun-homepage-positioning-design.md`.

**Produces:** A public homepage that presents Yukun as an engineering and supply service provider without factory or fixed-commitment claims.

- [ ] **Step 1: Replace the hero credential strip**

Replace:

```astro
FOB Shenzhen · 1-Week Samples · ISO 9001
```

With:

```astro
Engineering-Led Selection · Supply Coordination · Global Customer Support
```

- [ ] **Step 2: Replace the six “Why Yukun” cards**

Use these headings and descriptions:

```text
Manufacturing Partner Network — Access established manufacturing partners for micro-motion components without managing multiple sourcing relationships.
Application-Focused Selection — Share your requirements and receive component options aligned with torque, speed, size, noise, and integration constraints.
Custom Requirement Coordination — Coordinate shaft, connector, encoder, mounting, and packaging requirements with the appropriate manufacturing partner.
Quality Document Coordination — Coordinate available drawings, specifications, and quality documents required for your evaluation process.
Logistics & Order Follow-Up — Coordinate shipping options, export documentation, and order progress after quotation details are confirmed.
Engineer-Led Communication — Discuss application requirements in practical engineering terms before product, availability, lead time, and commercial terms are confirmed for your inquiry.
```

- [ ] **Step 3: Replace the consultation CTA promise and workflow labels**

Replace the fixed 24-hour and one-week wording with:

```text
Tell us your application requirements. We coordinate product options, availability, lead time, and commercial details with the appropriate manufacturing partner for each inquiry.

01 Share Your Application
02 Review Product Options
03 Confirm Availability & Lead Time
04 Coordinate Your Order
```

- [ ] **Step 4: Run the production build**

Run:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'; npm.cmd run build
```

Expected: Astro exits with status 0 and generates the static routes.

- [ ] **Step 5: Present verification, without publishing**

Run:

```powershell
git diff --check
git diff -- src/pages/index.astro
git status --short
```

Expected: no whitespace errors; the only source modification is `src/pages/index.astro`; no `git add`, `git commit`, or `git push` command is run.
