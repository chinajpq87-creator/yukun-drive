# Engineering Procurement UI Design

- Date: 2026-07-30
- Project: Yukun website frontend UI optimization
- Status: Design approved for written specification; implementation not started

## Problem Definition

Yukun should not look like a broad traffic marketplace at this stage. The website needs to make European, North American, and domestic engineering buyers feel that Yukun is professional, restrained, credible, and strong at application-based component selection.

This UI iteration focuses on improving the public-facing frontend experience by borrowing the strongest patterns from comparable sites:

- maxon, Portescap, FAULHABER: application-first positioning, technical solution navigation, disciplined engineering tone.
- TOPSFLO, HOTEC MOTOR: focused component pages, practical selection language, buyer education.
- GlobalSpec, Thomasnet: procurement-intent routing, parameter-driven discovery, RFQ-oriented buyer flow.

## In Scope

- Homepage visual hierarchy and section structure.
- Header clarity and procurement-oriented entry points.
- Card system for applications, component families, and engineering trust.
- CTA language and layout for application review and inquiry.
- Removal of template-like visual artifacts, including broken symbols and noisy emoji where they reduce engineering trust.
- Tests that protect the public UI contract and safety language.

## Out of Scope

- Public pricing.
- Supplier marketplace, login, buyer dashboard, or multi-supplier comparison platform.
- Claims about certification, inventory, fixed lead time, fixed response time, factory ownership, or guaranteed availability.
- Push, deployment, DNS, analytics configuration, or production release.
- Rewriting all product and solution content in this iteration.

## Design Principle

The site should feel like an engineering procurement desk, not a commodity catalog.

The user should immediately understand:

1. Yukun helps clarify application requirements.
2. Yukun matches compact motion components against those requirements.
3. Commercial details are confirmed per inquiry.
4. The best next action is to discuss the application or email requirements.

## Recommended UI Direction

Use a light technical UI as the default reading surface, with dark navy used selectively for navigation, hero emphasis, and conversion sections.

The visual tone should be:

- Professional, not flashy.
- Technical, not academic.
- Procurement-aware, not sales-heavy.
- Calm and credible, not marketplace-noisy.

## Homepage Structure

### 1. Hero: Engineering Procurement Entry

Purpose: establish positioning within the first screen.

Recommended layout:

- Left side:
  - Eyebrow: `Compact Motion Component Matching`
  - Headline: `Application-first component matching for compact motion systems`
  - Supporting copy: explain motors, gear motors, pumps, switches, terminals/contact components, and requirement clarification.
  - Primary CTA: `Discuss Your Application`
  - Secondary CTA: `Email Requirements`
- Right side:
  - `Application Review Panel`
  - Parameter chips such as voltage, torque/load, envelope, speed, noise, duty cycle, mounting, connector, feedback, compliance documents, sample/production stage.

Why: this borrows the solution confidence of maxon and Portescap while making the RFQ path explicit like GlobalSpec and Thomasnet.

### 2. Application Routes

Purpose: help buyers self-identify by use case before they think in part numbers.

Recommended cards:

- Medical and lab equipment
- Smart lock and access control
- EV charging and automotive actuators
- Robotics and grippers
- Industrial automation
- Smart home and IoT

Each card should show:

- Application name
- Typical mechanism
- Review focus, such as noise, torque, space, feedback, lifetime, or sealing
- Link to relevant solution page

Why: this keeps Yukun solution-led, where HOTEC is more product-led.

### 3. Component Families

Purpose: support product discovery without turning the homepage into a catalog wall.

Recommended families:

- Micro DC gear motors
- Brushless DC motors
- Micro pumps
- Micro switches
- Motor manufacturer components: commutators, carbon brush assemblies, terminals/contact components

Each card should show:

- Component family
- Typical applications
- Parameters reviewed
- Public-safe note: `Specifications and commercial terms confirmed per inquiry.`

Why: this shows breadth while avoiding unverified inventory, pricing, or guaranteed availability claims.

### 4. Managed RFQ Process

Purpose: make Yukun's service model tangible.

Recommended four-step flow:

1. Share application context
2. Clarify technical parameters
3. Review matching component options
4. Coordinate documents, samples, and order follow-up per inquiry

Why: this gives the site a clear operating model without claiming to be a marketplace.

### 5. Engineering Trust Layer

Purpose: make credibility visible without unsupported proof claims.

Recommended blocks:

- Application-first review
- Component family comparison
- Drawing/spec/document coordination
- Supplier communication and order follow-up
- Engineering resources and selection guides

Avoid:

- Unverified brand logos
- Certification claims unless documented
- Factory ownership claims
- Fixed response time or delivery promises

### 6. Final CTA

Purpose: close with a low-friction engineering inquiry.

Recommended layout:

- Short text: `Send your application, constraints, drawings, or target specifications.`
- CTA: `Discuss Your Application`
- Mailto CTA: `chinajpq@outlook.com`
- Short checklist of what to include.

## Header Design

Keep the header restrained and buyer-oriented.

Recommended top-level navigation:

- Products
- Applications
- Resources
- About
- Contact

Do not add `Motor Manufacturers` as a top-level nav item in this iteration. It remains a focused acquisition path reached from homepage cards and direct campaign links.

Improve the CTA from a generic button into a persistent engineering action:

- `Discuss Your Application`

## Visual System

### Color

- Primary surfaces: white and light gray for readability.
- Deep navy: navigation, hero accent, high-confidence sections.
- Amber/action: only for primary CTA and small emphasis.
- Cyan/technical: specs, parameter tags, focus states.

### Components

Use reusable patterns:

- `ProcurementHero`
- `ApplicationReviewPanel`
- `ApplicationRouteCard`
- `ComponentFamilyCard`
- `ManagedRfqSteps`
- `EngineeringTrustGrid`

These can be introduced incrementally. If implementation needs to move faster, inline homepage markup is acceptable for the first pass, but repeated card patterns should be extracted if they grow.

### Typography

- Use clear engineering copy.
- Keep headings concise.
- Use mono typography only for parameter tags, product codes, and spec-like content.

### Iconography

Avoid broken emoji and template-like decorative icons. Prefer:

- Numeric step labels
- Simple text chips
- Minimal SVG or CSS-based symbols only where useful

## Copy Rules

Use:

- `Discuss Your Application`
- `Email Requirements`
- `Review Parameters`
- `Confirmed per inquiry`
- `Application-first component matching`

Avoid:

- `Request Quote`
- `Submit RFQ`
- `Request Samples`
- Price, MOQ, FOB/CIF/DDP
- Fixed lead time, fixed response time, fixed sample time
- Unsupported certification, factory, inventory, or customer-logo claims

## Testing Requirements

Update or add release-safety tests to protect:

- No public price, MOQ, shipping terms, fixed delivery promises, or unsupported compliance claims.
- No top-level `Motor Manufacturers` header nav item.
- No old marketplace-style or quote-heavy CTA language.
- Homepage includes approved UI contract phrases:
  - `Application-first component matching`
  - `Application Review`
  - `Managed RFQ`
  - `Confirmed per inquiry`
- Public homepage output does not contain known mojibake/broken symbols.

Run before completion:

- `node --test tests/release-safety.test.mjs`
- `npm.cmd run verify:release`
- A targeted build output scan for prohibited phrases and broken symbols if the safety test does not already cover them.

## Acceptance Criteria

The implementation is acceptable when:

1. The homepage reads as an engineering procurement entry rather than a general manufacturer catalog.
2. Application and component routes are visible above or near the fold.
3. The buyer understands what information to submit for review.
4. The UI feels more restrained and credible than TOPSFLO/HOTEC while preserving their practical selection clarity.
5. No unsupported commercial, certification, social, or factory claims are introduced.
6. Release-safety and release verification pass.

