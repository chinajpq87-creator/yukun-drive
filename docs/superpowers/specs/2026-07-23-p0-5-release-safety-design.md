# P0.5 Release Safety Design

## Goal

Make the local site safe to review as a capability-display and lead-generation site by preventing draft content from becoming public, removing commercial and compliance claims that require case-by-case verification, and directing prospects to `chinajpq@outlook.com`.

## Scope

- Add an explicit `draft` flag to content collections and exclude entries with `draft: true` from public routes, indexes, and homepage lists without changing the current visibility of legacy content.
- Keep pending-review content in the repository but exclude it from generated public URLs.
- Remove or replace prices, MOQ, fixed lead times, fixed response times, certifications, capacity, factory ownership, exclusivity, and similar commercial or compliance claims across current public pages.
- Use the approved wording: `Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.`
- Make `chinajpq@outlook.com` the primary contact path for quote, sample, availability, certification, and commercial questions.
- Read the Web3Forms access key from the public deployment configuration; preserve the direct-email fallback when no key is configured or a submission fails.
- Emit a GA4 `generate_lead` event only after Web3Forms confirms success.
- Add a small Node-based regression check suite because the project has no existing test runner.

## Non-goals

- Do not add a real access key, submit a form, edit online accounts, commit, push, or publish.
- Do not invent replacement prices, certifications, performance evidence, delivery dates, factory credentials, or supplier identities.
- Do not delete the PawVibe draft.

## Design

Content entries use an explicit boolean `draft` flag. Legacy `status` values remain descriptive only because existing live product and solution pages use historical pending-review labels. Entries with `draft: true` remain available locally but are excluded from public collection queries and static route generation. Public list pages, dynamic routes, and the homepage use the same `!data.draft` filter.

Commercial and compliance details are not displayed as standing offers. Pages use neutral product and application descriptions, the approved inquiry-confirmation disclaimer, and a direct email link to `chinajpq@outlook.com`.

The contact form uses `PUBLIC_WEB3FORMS_ACCESS_KEY`. If it is absent, the form does not make a network request and presents `chinajpq@outlook.com` as the primary action. On a verified successful response it sends `window.gtag('event', 'generate_lead', { form_type })` when GA4 is present, then displays the approved inquiry-confirmation wording.

Regression checks inspect the content configuration, public route filters, and prohibited fixed-promise strings. The production build and SEO check remain the final integration validation.

## Acceptance Criteria

1. A product marked `draft: true` does not appear in product indexes, homepage product lists, or generated product paths.
2. Existing legacy content remains visible unless it is explicitly marked `draft: true`.
3. The contact form contains no embedded Web3Forms key and does not claim a fixed response or shipping time.
4. A confirmed form submission records `generate_lead` when GA4 is available.
5. Public output contains no standing price, MOQ, fixed lead-time, fixed response-time, certification, capacity, or factory-ownership claims.
6. Relevant pages direct commercial and compliance questions to `chinajpq@outlook.com` and show the approved inquiry-confirmation disclaimer.
7. The site build and static SEO audit pass without introducing a public PawVibe page.
