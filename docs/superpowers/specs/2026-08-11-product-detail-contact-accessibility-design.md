# Product Detail and Contact Accessibility Repair

## Objective

Remove the misleading product-image placeholder from public product detail pages and make the Contact page's dark information cards readable without changing the inquiry workflow or creating test leads.

## Scope

### Product detail media fallback

- Continue to render a product image when a product entry supplies a verified `image` value.
- When no image is supplied, render a neutral, text-only application briefing panel instead of an icon and the phrase `Product image coming soon`.
- The fallback will identify the category and product code, then state that configuration is reviewed per inquiry. It will not make claims about specifications, inventory, delivery, certification, or availability.
- No generated, stock, or unverified hardware image will be added.

### Contact-card contrast

- Make the two dark right-column cards explicitly use the existing light-on-navy token family: `--color-navy-ink` for headings and primary details, `--color-navy-ink-muted` for supporting copy, and `--color-technical-light` for the email link and step numbers.
- Do not change the global legacy text-token values, because they are used by the form controls and other public pages.
- Retain layout, copy, form fields, and analytics behavior.

### Non-submitting form acceptance

- The browser check will verify that the form fields render, required constraints are present, and the browser blocks an empty form.
- It will not fill valid data or submit the form, so Web3Forms, analytics, and any lead-notification path are not contacted.

## Tests and verification

1. Add source-contract tests that fail while the detail page emits `Product image coming soon` and while the Contact cards omit their explicit navy contrast classes.
2. Implement the smallest Astro-template changes needed for those tests.
3. Run the targeted Node test suite, then `npm.cmd run verify:release`.
4. Run a local browser check of the product and Contact pages. Confirm the fallback has no false imagery, the card text is legible, and empty-form validation stops submission.

## Non-goals

- Adding a product asset pipeline, product photography, or AI-generated hardware visuals.
- Altering form endpoint configuration, analytics, database, email routing, or production deployment.
- Rewriting product copy or changing the contact form's conversion flow.
