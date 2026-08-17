# GA4 Industrial Editorial Baseline

## Purpose

Compare qualified inquiry behavior before and after the industrial-editorial visual rollout. Do not judge the change by page views alone.

## Events to inspect

| Event | Meaning | Decision use |
| --- | --- | --- |
| `project_review_cta_click` | Homepage primary CTA click | Homepage message and CTA relevance |
| `product_review_cta_click` | Products-page CTA click | Product-selection intent |
| `application_review_cta_click` | Solutions-page CTA click | Application-led intent |
| `fit_check_start` | Visitor began the contact form | Form handoff quality |
| `fit_check_submit` | Web3Forms submission succeeded | Completed inquiry |
| `generate_lead` | GA4 key event | Core qualified-lead proxy |
| `email_requirement_click` | Visitor chose email fallback | Friction or preference signal |

Each CTA event includes `cta_location`, `cta_label`, and `entry_content` when available. Existing form events preserve `form_type`, UTM fields, and entry content.

## Observation schedule

1. Record a baseline for the prior 14 full days before production release.
2. After release, wait for 14 full days before comparing; exclude the release day from both periods.
3. Compare the same weekday mix, traffic source mix, and major campaign activity before interpreting a result.

## Minimum review table

| Metric | Baseline | Post-release | Interpretation |
| --- | ---: | ---: | --- |
| Users reaching `/` |  |  | Context only |
| Homepage CTA clicks / homepage users |  |  | Hero clarity and CTA relevance |
| Product CTA clicks / product-page users |  |  | Product-selection intent |
| Application CTA clicks / solutions-page users |  |  | Application-page relevance |
| Fit Check starts / CTA clicks |  |  | Handoff friction |
| Fit Check submissions / starts |  |  | Form completion quality |
| `generate_lead` / users |  |  | Primary outcome, directional only with low volume |
| Email clicks / CTA clicks |  |  | Need for non-form contact route |

## Decision rules

- If CTA clicks rise but form starts fall, simplify the page-to-form transition before changing the visual direction.
- If form starts rise but submissions fall, inspect required fields and mobile form behavior.
- If low traffic produces fewer than a meaningful number of completed inquiries, do not claim a conversion improvement; keep collecting evidence.
- If qualified conversations improve but event volume is flat, record the qualitative evidence separately; GA4 cannot assess lead quality by itself.

## Setup check in GA4

1. In Admin > Events, confirm the three CTA events appear after production traffic reaches each page.
2. Mark only `generate_lead` as the primary lead key event unless the commercial process changes.
3. Create one exploration with `event_name`, `cta_location`, `entry_content`, `session source / medium`, and landing page.
4. Do not mark CTA clicks as key events: they are intent signals, not completed inquiries.
