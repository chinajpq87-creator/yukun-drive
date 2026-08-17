# Industrial Editorial Homepage Test Design

## Goal

Test a credible, image-light desktop and mobile homepage direction for Yukun's GMIP positioning before any production release.

## Scope

- Replace the current homepage's AI-generated hero and validation images with an HTML/CSS engineering-brief composition.
- Keep the existing global navigation, contact routes, GA4 code, and claim guardrails unchanged.
- Show four input categories and a three-step review sequence using only descriptive labels.
- Test locally at desktop and mobile widths. Do not publish, push, merge, or change Cloudflare Pages.

## Design Direction

The page uses a warm white reading surface, a single deep-navy navigation band, graphite rules, restrained cyan technical accents, and one rust-orange action. The hero is split between clear GMIP copy and a flat engineering brief made from component-outline SVG, neutral material swatches, and review labels. It must look like an industrial consultancy brief, not a product advertisement or software dashboard.

## Content Rules

- Do not use generated product, factory, person, animal, country, or customer imagery.
- Do not show numerical performance values, protection ratings, compliance statements, delivery promises, or supplier claims.
- Label all inputs as items to be confirmed during project review.
- The animated element, if retained, may only communicate review progress and must respect reduced-motion preferences.

## Acceptance Checks

1. The homepage contains no reference to `gmip-smart-feeder-cutaway.png` or `gmip-motion-validation-concept.png`.
2. The hero contains the GMIP eyebrow, a product-definition headline, an engineering brief panel, and a project-review CTA.
3. The engineering brief contains only neutral labels: component overview, material/surface, review inputs, and define/review/execute.
4. Desktop (1440px) and mobile (390px) screenshots show no clipped navigation, overlapping text, or invisible CTA labels.
5. `npm.cmd run test:release-safety` and an Astro production build succeed.

## Explicit Non-Goals

- No India-market page or localization.
- No product performance claims or technical datasheet.
- No production deployment.
