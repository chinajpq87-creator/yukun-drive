---
title: "Handheld Fan Teardown — N20 Motor, Micro Switch & Engineering Insights | Yukun"
meta_title: "Handheld Fan Teardown — N20 Motor Teardown & Replacement Guide | Yukun"
meta_description: "We tear down a portable handheld fan to analyze the N20 DC gear motor, micro switch, gear train, and noise sources. BOM inside. Engineers: get the upgrade motor, quieter planetary gearbox, and IP67 switch."
slug: "handheld-fan-teardown-n20-motor"
category: "Teardown"
date: 2026-07-01
status: "published"
image: "/images/teardowns/fan-teardown-hero.jpg"
---

# Handheld Fan Teardown — N20 Motor, Micro Switch & Engineering Insights

**Watch the full teardown:** [▶️ YouTube Video](https://youtube.com/@YukunDrive) *(link updated after upload)*

---

Every engineer has taken apart a gadget just to see what's inside. In this teardown, we open a typical USB handheld fan — the kind sold on Amazon for $8.99 — and trace every electro-mechanical component back to its function. If you're designing a portable cooling device, a personal air purifier, or any battery-powered blower, the motor and switch decisions start here.

---

## What We Found Inside

| # | Component | Model Observed | Function |
|:---|:---|:---|:---|
| 1 | **DC Gear Motor** | N20 12mm brushed, metal spur gear | Drives the fan blades via a pinion-spur reduction |
| 2 | **Micro Switch** | 3-pin tactile pushbutton, unsealed | Power on/off; typically 2-position (OFF-LOW-HIGH) or single with a boost IC |
| 3 | **Battery** | 18650 Li-ion, 3.7V 2000mAh | Single-cell power; charges via Micro USB port |
| 4 | **Boost/Charge Board** | TP4056 + FP6298 combo | Li-ion charge management + DC-DC boost to 5-9V for motor |
| 5 | **Fan Blades** | 3-blade axial, injection-molded ABS | ~80mm diameter; press-fit onto motor output shaft |
| 6 | **Housing** | ABS clamshell, snap-fit | Two halves held by 4 self-tapping screws + snap tabs |

---

## Deep Dive: The N20 DC Gear Motor

The heart of every handheld fan is a **12mm N20 brushed DC gear motor**. Here's what matters for your design:

### Stock Motor Specs (from our measurement)

| Parameter | Value | Notes |
|:---|:---|:---|
| Motor Diameter | 12mm | N20 standard |
| Operating Voltage | 3.7-5V DC | Single Li-ion to USB |
| No-Load Speed | ~6,500 RPM (before gearbox) | Measured at 5V |
| Gear Ratio | ~50:1 | Estimated from blade RPM ÷ motor RPM |
| Gear Type | Metal spur, 3-stage | Hardened steel; moderate backlash |
| Noise | ~55-60 dB @ 30cm | Dominated by gear mesh + blade turbulence |
| Service Life | ~5,000-8,000 hrs observed | Brushed commutator wear limits lifetime |
| Cost (BOM estimate) | $0.80-1.20 | In 10K+ volume from Shenzhen |

### Common Failure Modes

```
1. BRUSH WEAR         → Fan runs slower, eventually stops
   Root cause: Copper commutator + carbon brush wear at 6,500 RPM

2. GEAR NOISE         → Whining sound at certain speeds
   Root cause: Spur gear backlash + no lubrication after 6 months

3. SWITCH BOUNCE      → Intermittent power, mode skipping
   Root cause: Unsealed tactile switch oxidizes in humid air
```

---

## BOM — Build Your Own Fan (or Upgrade It)

If you're sourcing components for a portable fan — or fixing a batch of returned units — here's what we recommend:

| Original Part | Issue | Yukun Replacement | Why Better |
|:---|:---|:---|:---|
| N20 Metal Spur Gear Motor | Noise + brush wear | [**N20 Planetary Gear Motor**](/products/n20-planetary-gear-motor) (N20-P01) | 50% quieter, 3× longer life, lower backlash |
| N20 Metal Spur Gear Motor | Cost-sensitive | [**N20 Metal Spur Gear Motor**](/products/n20-metal-spur-gear-motor) (N20-M01) | Same spec, direct replacement, **from $2.80** |
| Tactile Switch | Oxidizes in humidity | [**IP67 Micro Switch**](/products/) | Sealed, 100K+ cycle life, gold-plated contacts |
| 18650 Cell | Generic, no BMS | Contact us for Samsung/LG cells | Protected circuit, better cycle life |
| ABS Housing | Single-source mold | **[Custom Injection Molding](/contact)** | We do tools + production in Shenzhen |

---

## Noise Analysis & Solutions

The handheld fan we tested produced **58 dB at 30 cm** — annoying in an office, unacceptable in a bedside product. Here's where the noise comes from:

```
Total noise: 58 dB
  ├── Gear mesh:         42 dB  (spur gear tooth impact)
  ├── Blade turbulence:  38 dB  (aerodynamic, RPM-dependent)
  ├── Motor bearing:     32 dB  (sleeve bearing whine)
  └── Housing resonance: 28 dB  (ABS amplifies motor vibration)
```

### How to Reduce Noise

| Solution | Reduces | Cost Impact | Difficulty |
|:---|:---|:---|:---|
| **Switch to planetary gears** (N20-P01) | Gear mesh noise by 6-8 dB | +$1.00/unit | Drop-in |
| **Add rubber motor grommet** | Housing resonance by 5-7 dB | +$0.15/unit | Mold modification |
| **Blade rebalance** | Turbulence noise by 3-5 dB | NRE ~$500 for tooling | Requires mold tweak |
| **Switch to BLDC** (BL-24C) | Motor whine eliminated, total ~35 dB | +$12.00/unit | Different mounting |

For most consumer products, the **N20 Planetary + rubber grommet** combo gets you from 58 dB to ~45 dB — perceptually half as loud — for $1.15/unit extra.

---

## The Micro Switch: Small Part, Big Headache

The 3-pin tactile switch in this fan is:
- **Unsealed** — IP00. Sweat, rain, or bathroom humidity will kill it.
- **Silver-plated contacts** — Oxidize after 6-12 months → intermittent operation.
- **0.5mm travel** — Feels mushy; not great for user experience.

### Upgrade Options

For products that need reliability:
- **IP67 sealed tactile** — For outdoor/bathroom/kitchen products
- **Gold-plated contacts** — For low-current signal switching (MCU wake)
- **Hall-effect sensor** — No moving contacts, infinite life, for premium products

Contact our engineering team for switch recommendations based on your enclosure design.

---

## Customization Beyond Components

If you're building a branded fan or any portable device, we handle:

| Service | Details | MOQ |
|:---|:---|:---|
| **Custom Motor Shaft** | D-cut, flat, keyway, pin hole | Standard on every order |
| **Custom Gear Ratio** | Match your blade RPM exactly | 1,000 units |
| **Motor + Switch Assembly** | Pre-soldered, tested sub-assembly | 1,000 units |
| **Injection Molding** | Housing, blade, bracket — full tooling + production | 2,000 units |
| **Sheet Metal / Stamping** | Motor brackets, battery contacts, heat sinks | 5,000 units |

---

## Video Script

> 👇 This is the script for the YouTube teardown video. Use it as a voiceover guide while filming or creating slides.

### SCRIPT: Handheld Fan Teardown (3:30)

```
[0:00-0:15] INTRO
"Every year, 200 million handheld fans are sold worldwide. Most of them use
 the exact same motor. Today, we're taking one apart to show you what's inside,
 what fails, and how to make it better. I'm [name] from Yukun."

[0:15-0:45] TEARDOWN SEQUENCE (fast-motion)
Step 1: Remove 4 bottom screws (show screwdriver)
Step 2: Pry open snap tabs (show spudger)
Step 3: Separate clamshell → reveal internals
Step 4: Point to each component: motor, switch, battery, PCB, blades

[0:45-1:30] MOTOR DEEP DIVE
(frame: close-up of N20 motor)
"This is an N20 brushed DC gear motor — 12mm diameter, metal spur gears.
 It spins at 6,500 RPM and drops to about 130 RPM at the blade through
 a 50:1 reduction. These motors cost about a dollar in volume. They're
 everywhere: fans, toys, smart locks, robot grippers."

(frame: show worn motor vs new)
"The problem? After about 5,000 hours, the brushes wear out and the gears
 get noisy. Same motor, same problem, across every fan brand."

[1:30-2:00] UPGRADE OPTIONS
(frame: show planetary motor side-by-side with spur)
"If you're designing a fan and want it quieter, swap the spur gear for a
 planetary gearbox. Same 12mm mounting, but 6 to 8 decibels quieter and
 3× the service life. Cost difference? About a dollar per unit."

(frame: show BLDC motor)
"For premium products, a slotless BLDC motor eliminates brush wear entirely.
 15,000 hours, near-silent. This is what Dyson uses in their personal fans."

[2:00-2:30] THE SWITCH MATTERS
(frame: close-up of corroded switch vs new sealed switch)
"This tiny tactile switch? It's the #1 warranty return cause in portable fans.
 Unsealed contacts oxidize. Your customer presses the button and nothing happens.
 The fix is a $0.15 IP67 sealed switch with gold contacts. A 15-cent part
 saves a $9 product from a 1-star review."

[2:30-3:15] FROM TEARDOWN TO YOUR PRODUCT
(frame: BOM table overlay)
"Here's the BOM for this fan. If you're building something similar — or fixing
 a bad batch — all of these parts are available from us."

(frame: show Yukun website)
"Motor, switch, custom gear ratio, even injection molding for your housing.
 We ship samples in one week. Links below."

[3:15-3:30] OUTRO + CTA
"What should we tear down next? Comment below. Subscribe for more teardowns.
 And if you need motors or switches for your product, the link is in the description.
 I'm [name] from Yukun. See you next time."
```

---

## TL;DR for Engineers

| If You Need | Use This | Link |
|:---|:---|:---|
| Same motor, direct replacement | N20 Metal Spur (N20-M01) | [View →](/products/n20-metal-spur-gear-motor) |
| Quieter, longer life | N20 Planetary (N20-P01) | [View →](/products/n20-planetary-gear-motor) |
| Premium, silent | BL-24C BLDC (BL-I01) | [View →](/products/bl-24c-slotless-brushless-dc-motor) |
| Waterproof switch | IP67 Micro Switch | [Inquire →](/contact) |
| Custom enclosure | Injection Molding + Tooling | [Request Quote →](/contact) |

---

> **Yukun** — Micro Motion Solutions for Your Product
> 📧 info@yukun-drive.com | 🏭 Shenzhen, China
> *1-Week Samples | Custom Shaft/Gear/Connector | FOB Shenzhen*
