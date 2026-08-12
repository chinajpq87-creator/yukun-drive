# GMIP Three-Track Execution Design

## Purpose

Run a controlled first acquisition experiment for Yukun's GMIP offer while improving first-contact conversion and preparing one evidence-bounded organic entry point.

## Scope and sequencing

The work is divided into three independently reviewable tracks. Each track has a separate success signal and must not be treated as proof of commercial demand by itself.

1. **Target-account research and outreach preparation**
   - Build a 20--30 company research sheet from public company information only.
   - Qualify companies only when the public evidence shows a Pet Tech hardware product, a plausible hardware/NPI need, and an official company-domain contact route.
   - Record evidence URL, observed signal, confidence, and missing information for every row.
   - Draft a personalized outreach message for qualified accounts.
   - Do not access personal contact data, use paid/credit-consuming enrichment, send outreach, create CRM records, quote price, claim certifications, or promise capacity, lead time, MOQ, or compliance.

2. **Two-step Project Fit Check**
   - Make the first screen require only full name, company, business email, and product summary.
   - Move country, development stage, target market, CAD, BOM, prototype, quantity, budget, target date, and constraints into an optional second step labelled as information that improves the review.
   - Preserve the existing Web3Forms endpoint, attribution fields, non-PII GA4 events, and successful-submission-only `generate_lead` behavior.
   - Add `fit_check_step_two_view` only when the prospect opens the optional step. Do not make it a key event.
   - Preserve the sample-request tab and its existing form behavior.

3. **Evidence-bounded content pilot**
   - Use the existing `pet-tech-feeder-drive-system.md` draft as the source.
   - Keep it in draft status until an explicit public-release review confirms every externally verifiable engineering statement has a source and every commercial or supplier claim stays conditional.
   - Create a review checklist that identifies statements requiring source verification, unsupported claims to remove, and the intended CTA path: `/contact/?entry=pet-feeder-guide`.
   - The article must not identify suppliers, claim factory ownership, promise product performance, state fixed pricing/MOQ/lead times, provide a compliance opinion, or represent an unverified specification as a Yukun offer.

## Architecture

The form remains a React component mounted from the Astro contact page. A `step` state controls visible fields while `FormData` retains all completed optional fields. Existing tags use the globally exposed GA4 dispatcher and only send non-PII event parameters.

Research and content-review assets are Markdown/CSV-compatible project documents, not a CRM and not an email-sending system. They make evidence and review decisions inspectable before any external outreach or public release.

## Data and measurement

| Measure | Definition | Decision use |
| --- | --- | --- |
| Form start | `fit_check_start` after first input focus | Indicates form engagement, not qualified demand. |
| Optional-step view | `fit_check_step_two_view` when step two opens | Measures second-step friction. |
| Lead | `generate_lead` after Web3Forms returns success | Primary online conversion. |
| Qualified account | Public evidence supports all three research gates | Eligible for a draft, not an automatically sent message. |
| Valid reply | A human response with a project, quantity, target price, timing, or technical requirement | Commercial validation. |

Internal QA entries must contain `INTERNAL QA` and be excluded manually from commercial review. GA4 report processing delay is not evidence that a real buyer converted.

## Test boundaries and stop conditions

- The initial outreach test limit is 20--30 researched accounts and no more than 10 individually approved messages per day if sending is later authorized.
- No inventory purchase, supplier prepayment, commercial quotation, claims of regulatory compliance, or contractual commitment is in scope.
- Continue the market test only after at least three valid replies and one buyer requirement containing product, quantity, target price, or timing detail. Otherwise pause and revise the ICP, message, or offer boundary.
- The form change is retained only if its effect on `generate_lead`, optional-field completion, and lead quality can be reviewed after sufficient real traffic. The required sample size is currently unknown and must not be invented.

## Acceptance criteria

1. The form can submit with only the four first-step fields and preserves optional completed values when step two is used.
2. The form sends no PII to GA4 and sends `generate_lead` only after a successful API response.
3. The account research asset contains visible qualification gates, sources, confidence, and exclusions; no personal data is collected.
4. The content review asset keeps the feeder article in draft and identifies a clear publication gate.
5. Targeted automated tests and the production build pass before a pull request is opened.
6. No outreach email or public article release occurs without a separate explicit approval.
