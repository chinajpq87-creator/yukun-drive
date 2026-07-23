# LinkedIn Profile Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce review-ready English LinkedIn Headline and About copy for the approved dual professional identity.

**Architecture:** Create one standalone Markdown review artifact. It describes the current manufacturing-industry sales role generically and the independent Yukun Drive founder role explicitly, without connecting to LinkedIn or changing an external profile.

**Tech Stack:** Markdown, LinkedIn manual profile editing.

## Global Constraints

- Do not publish the Yibao company name.
- Do not imply that Yukun Drive is the employer’s official overseas channel.
- Do not present the profile owner as an engineer or claim that Yukun Drive owns manufacturing facilities.
- Do not disclose internal prices, customers, drawings, capacity, or other non-public employer information.
- Do not promise fixed response, sample, production, or delivery timing.
- Do not commit, push, edit LinkedIn, or publish.

---

### Task 1: Create review-ready LinkedIn Headline and About copy

**Files:**
- Create: `docs/linkedin-profile-copy-p0-3.md`
- Test: PowerShell prohibited-term scan

**Consumes:** `docs/superpowers/specs/2026-07-23-linkedin-profile-positioning-design.md`.

**Produces:** One approved-format Headline and one English About draft for manual LinkedIn use.

- [ ] **Step 1: Add the approved Headline**

Use exactly:

```text
Sales Manager at a Leading Chinese Micro-Motor Component Manufacturer | Founder of Yukun Drive | Product Matching & Supply Coordination
```

- [ ] **Step 2: Add the About copy**

Create five short paragraphs that:

1. Establish sales-management experience at a leading Chinese manufacturer of core micro-motor components.
2. Cover micro switches, commutators, carbon-brush assemblies, terminals, micro motors, and related motion components.
3. Describe Yukun Drive as an independently operated trade service for international product teams.
4. Describe product matching, quotation coordination, sample follow-up, documentation, and order coordination without fixed commitments.
5. Close with `https://yukun-drive.com`, `info@yukun-drive.com`, and confirmation that specifications, availability, lead time, and commercial terms are confirmed for each inquiry.

- [ ] **Step 3: Add profile-entry guidance**

State that the public Headline and About remain generic about the employer, and that LinkedIn Experience should only name the employer or describe an official relationship if the profile owner chooses to disclose it and is authorized to do so.

- [ ] **Step 4: Verify public-message boundaries**

Run:

```powershell
$matches = Select-String -Path 'docs\linkedin-profile-copy-p0-3.md' -Pattern 'Yibao|亿宝|official overseas|1 week|24 hours|FOB|ISO|IATF|guaranteed|our factory' -CaseSensitive:$false
"PROHIBITED_MATCHES=$($matches.Count)"
```

Expected: `PROHIBITED_MATCHES=0`.

- [ ] **Step 5: Present the review artifact without publishing**

Run:

```powershell
Get-Content -Raw 'docs\linkedin-profile-copy-p0-3.md'
git status --short
```

Expected: the document is present as an untracked review artifact; no Git staging, commit, push, LinkedIn edit, or publishing action is performed.
