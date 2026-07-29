# Cloudflare Pages Safe Migration Design

**Date:** 2026-07-29  
**Status:** approved for preparation; production DNS cutover requires interactive account access and a final go/no-go check.

## Goal

Move the static Astro site from GitHub Pages to Cloudflare Pages so visitors use HTTPS on `yukun-drive.com`, while preserving a tested rollback path and avoiding disruption to domain administration.

## Verified starting state

- Production site currently deploys from GitHub Actions on the `master` branch.
- The Astro project builds with Node 22 using `npm run build`; output is `dist`.
- `public/CNAME` currently binds GitHub Pages to `yukun-drive.com`.
- Public authoritative nameservers are `dns17.hichina.com` and `dns18.hichina.com`, not Cloudflare.
- The public apex uses the four GitHub Pages IP addresses; `www` CNAMEs to `chinajpq87-creator.github.io`.
- No public MX or TXT record was returned during the preflight lookup. This is not proof that email is unused; the registrar DNS export remains the cutover source of truth.

## Chosen approach

Use a staged Cloudflare Pages migration.

1. Secure the Cloudflare, GitHub and registrar accounts with MFA.
2. Add the domain as a full Cloudflare zone and copy every existing DNS record from the registrar before changing nameservers.
3. Connect the GitHub repository to one Cloudflare Pages project with `master` as the production branch and validate its `pages.dev` deployment.
4. Add `yukun-drive.com` and `www.yukun-drive.com` through the Pages custom-domain flow. Do not create a manual Pages CNAME beforehand.
5. Change registrar nameservers only after the Pages deployment, domain validation, and issued edge certificate are confirmed.
6. Enable HTTPS enforcement and canonical redirects only after the certificate is active.
7. Keep GitHub Pages deployment and the recorded old DNS targets for seven days as rollback.

## Cloudflare Pages configuration

| Setting | Value |
| --- | --- |
| Repository | `chinajpq87-creator/yukun-drive` |
| Production branch | `master` |
| Framework preset | Astro, or None if the preset is not offered |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` |
| Secrets | None for this static site |

Preview deployments must not receive production-only secrets. The current contact pattern is email-first, so no form key is needed.

## DNS and certificate cutover

Before changing nameservers, export the complete registrar DNS zone and verify the list with the owner. Preserve every non-web record exactly, particularly MX, SPF, DKIM, DMARC, verification and domain-control records. Never proxy mail records.

After Cloudflare becomes authoritative, add the custom domains from Pages. Cloudflare Pages will create the appropriate DNS records in-zone. The root domain relies on Cloudflare CNAME flattening; `www` is added as a separate custom domain. Use a Cloudflare redirect rule so `www.yukun-drive.com/*` performs a 301 redirect to `https://yukun-drive.com/$1` with path and query string preserved.

Only after both custom domains report an active edge certificate:

- enable Universal SSL;
- enable Always Use HTTPS;
- keep TLS 1.3 enabled and require at least TLS 1.2;
- audit the site for mixed content;
- redirect the production `pages.dev` address to the canonical domain after validation.

`Full (strict)` is intentionally not a cutover requirement: Pages does not use this project's former GitHub Pages origin. It must not be changed blindly if unrelated proxied origins share the zone.

## Repository security changes

Add a Cloudflare Pages `_headers` file to `public/`, after checking that the rules do not interfere with Astro assets:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: SAMEORIGIN`

Do not introduce a restrictive Content Security Policy until an asset and inline-script audit is complete. A premature CSP can break Astro-generated scripts or future analytics.

Remove `public/CNAME` only in the Cloudflare migration commit, after the Pages preview has passed. That prevents GitHub Pages from continuing to advertise the production custom domain during the overlap.

## Validation gates

### Pre-cutover

- `npm run verify:release` passes.
- Cloudflare Pages preview returns 200 for `/`, `/id`, product pages and contact page.
- No preview page contains secrets or a broken contact link.
- Registrar DNS export is saved and reviewed.
- Cloudflare Pages shows both custom-domain certificates as active.

### Post-cutover

- `http://yukun-drive.com` redirects to `https://yukun-drive.com`.
- `https://www.yukun-drive.com/path?x=1` returns a 301 to the canonical host while preserving `/path?x=1`.
- The canonical domain presents a valid certificate with no browser mixed-content warning.
- `/id`, representative product pages and contact navigation work on desktop and mobile.
- DNS records and owner mailbox behavior remain normal.

## Rollback

For seven days, retain the GitHub Pages workflow and the complete pre-cutover DNS export. If the Pages project, certificate, or route validation fails, restore the recorded GitHub Pages apex A records and `www` CNAME at the authoritative DNS provider. Re-test HTTPS and canonical routing before declaring rollback complete.

## Scope limits

This migration does not add backend forms, databases, analytics, Workers, price/lead-time/certification claims, or changes to public contact information.
