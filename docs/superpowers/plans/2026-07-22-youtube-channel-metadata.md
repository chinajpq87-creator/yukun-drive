# Yukun Drive YouTube Channel Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce review-ready English YouTube channel metadata for Yukun Drive.

**Architecture:** Create one standalone Markdown document for manual use in YouTube Studio. It contains the approved content-authority positioning, search phrases, contact links, and a paste checklist; it does not connect to YouTube or change external account settings.

**Tech Stack:** Markdown, YouTube Studio manual configuration.

## Global Constraints

- Do not name Yibao or any manufacturing partner.
- Do not claim that Yukun is a manufacturer.
- Do not promise fixed sample timing, response time, lead time, Incoterms, availability, capacity, or certifications.
- State that product availability, lead time, and commercial terms are confirmed for each inquiry.
- Mark the document as review-only. Do not create, modify, or publish a YouTube channel, video, or account setting.
- Do not commit, push, deploy, or publish.

---

### Task 1: Create review-ready YouTube channel metadata

**Files:**
- Create: `docs/youtube-channel-metadata-p0-2.md`
- Test: PowerShell prohibited-term scan

**Consumes:** `docs/superpowers/specs/2026-07-22-youtube-channel-metadata-design.md`.

**Produces:** Banner copy, channel description, keyword list, links, and a manual YouTube Studio paste checklist.

- [ ] **Step 1: Create the review-only metadata document**

Create the document with the following required values:

```text
Channel name: Yukun Drive
Handle: @YukunDrive
Banner headline: Micro Motion Teardowns · BOMs · Engineering Insights
Banner subheadline: For Product Engineers & Sourcing Teams
Website: https://yukun-drive.com
Contact: info@yukun-drive.com
```

- [ ] **Step 2: Add the approved channel description**

Use a description that states the channel covers consumer-product teardowns, motors, switches, pumps, BOM analysis, and engineering insight. Include this service sentence verbatim:

```text
Yukun Drive provides engineering-led product selection and supply coordination. Product availability, lead time, and commercial terms are confirmed for each inquiry.
```

- [ ] **Step 3: Add channel keywords and the manual paste checklist**

Include keyword phrases for micro motor teardown, gear motor selection, BOM analysis, smart lock motor, robotics actuator, BLDC motor, micro pump, and product engineering. Add manual YouTube Studio steps that explicitly stop before clicking any publish, save, or external-account action.

- [ ] **Step 4: Verify public-message boundaries**

Run:

```powershell
Select-String -Path 'docs\youtube-channel-metadata-p0-2.md' -Pattern 'Yibao|亿宝|manufacturer|factory|FOB|1 week|24 hours|ISO|IATF|capacity|guaranteed' -CaseSensitive:$false
```

Expected: no matches.

- [ ] **Step 5: Present the review artifact without publishing**

Run:

```powershell
Get-Content -Raw 'docs\youtube-channel-metadata-p0-2.md'
git status --short
```

Expected: the metadata document is present as an untracked review artifact; no `git add`, `git commit`, `git push`, YouTube Studio, or publishing action is performed.
