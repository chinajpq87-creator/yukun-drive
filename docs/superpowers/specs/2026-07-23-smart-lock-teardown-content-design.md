# P0-4 Smart Lock Teardown Content Design

**Status:** Approved under the owner's full-project delegation on 2026-07-23  
**Publishing state:** Review-only; no website, YouTube, or social publication

## Objective

Create the second teardown content package for Yukun Drive:

1. an English video script suitable for a roughly four-minute engineering video;
2. an English long-form blog draft;
3. a verification layer that prevents unobserved details from being presented as teardown facts.

## Topic decision

**Selected topic:** Smart Door Lock Teardown — Worm Gear Motor, Position Feedback, and Actuator BOM

This topic was selected because it connects three existing content and service assets:

- the N20 worm self-locking gear motor product category;
- micro switches and position-feedback components;
- the smart-lock motion-solution page.

It therefore strengthens an existing topic cluster instead of opening an unrelated product category.

## Editorial position

The content is an engineering teardown framework, not a report about a named commercial lock. The final recording must use the actual sample on camera and verify every sample-specific statement.

The draft may explain common electromechanical architectures supported by primary technical references. It must not claim that a particular sample contains a component until the component is visible or measured.

## Evidence rules

- Use “may,” “often,” or “in this architecture” for design patterns that vary by product.
- Do not invent a brand, model, screw count, motor voltage, gear ratio, current, torque, cycle life, noise level, material, certification, price, or production capacity.
- Put all sample-dependent details in a field-verification checklist.
- Treat patents and technical manuals as architecture references, not proof of the sample's construction.
- Do not name Yibao, a supplier, or an employer.
- Do not promise availability, delivery time, response time, pricing, or trade terms.

## Video structure

The script uses eight production segments:

1. Hook and engineering question
2. Product boundary and safety note
3. Housing and subsystem map
4. Motor-to-deadbolt motion chain
5. Position feedback and control
6. Functional BOM
7. Selection and validation risks
8. Summary and inquiry CTA

Visual directions use `[SHOW:]` and narration remains independent of unverified sample details.

## Blog structure

- Draft disclosure
- System architecture
- Teardown sequence
- Functional BOM
- Motor and feedback selection logic
- Validation and failure-risk checklist
- Inquiry brief template
- Source notes
- Yukun Drive CTA

## Acceptance criteria

- English script contains eight segments and is suitable for about four minutes.
- Blog is substantive enough to become a standalone article after sample verification.
- Both artifacts contain a visible review-only warning.
- No supplier identity or fixed commercial promise appears.
- Technical claims are either conditional, observable, or supported by primary references.
- Files remain under `docs/` so Astro cannot publish them automatically.
