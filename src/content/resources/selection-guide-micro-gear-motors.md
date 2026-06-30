---
# Page Meta
title: "How to Select Micro Gear Motors — Complete Selection Guide | Yukun"
meta_title: "Micro Gear Motor Selection Guide — How to Choose the Right Motor | Yukun"
meta_description: "Step-by-step guide to selecting micro DC gear motors. Covers torque calculation, gear types (spur/planetary/worm), voltage selection, and application matching. For engineers and procurement professionals."
slug: "how-to-select-micro-gear-motors"
resource_type: "Selection Guide"
related_products: ["n20-metal-spur-gear-motor", "n20-worm-self-locking-gear-motor", "370-worm-self-locking-gear-motor", "bl-24c-slotless-brushless-dc-motor"]
status: "⚠️待审核"
---

# How to Select Micro Gear Motors: The Engineer's Guide

**A practical, step-by-step framework for choosing the right micro DC gear motor for your product. Covers torque, speed, gear types, voltage, and application-specific trade-offs.**

---

## Step 1: Define Your Motion Requirements

Before browsing motors, answer these five questions:

### 1. What type of motion?

| Motion Type | Motor Configuration | Example |
|:---|:---|:---|
| **Rotary** | Standard output shaft | Smart lock bolt rotation, valve actuation |
| **Linear** | Rack & pinion, lead screw, or cam | Deadbolt throw, syringe pump push |
| **Oscillating** | Reversing motor + limit switches | Camera pan/tilt, auto-soap dispenser |

### 2. What torque do you need?

Torque is the most critical parameter. Under-spec it and your mechanism stalls. Over-spec it and you waste power, space, and money.

**Quick estimation formula:**

```
Required Torque (kg·cm) = Force (kg) × Lever Arm (cm) × Safety Factor (1.5–2.0)
```

| Application | Typical Required Torque | Recommended Motor |
|:---|:---|:---|
| Fingerprint lock bolt retraction | 0.5 – 1.0 kg·cm | N20 Metal Spur 100:1 |
| Motorized deadbolt throw | 1.0 – 2.0 kg·cm | N20 Worm Self-Lock 200:1 |
| EV charging gun lock (AC) | 0.5 – 1.5 kg·cm | N20 Worm Self-Lock 100:1 |
| EV charging gun lock (DC) | 5 – 15 kg·cm | 370 Worm Self-Lock 200:1 |
| Motorized curtain drive | 0.3 – 0.8 kg·cm | N20 Metal Spur 200:1 |
| Small robot joint | 1.0 – 3.0 kg·cm | N20 Planetary 64:1 |
| Valve actuator (small) | 2.0 – 5.0 kg·cm | 370 Worm Self-Lock 500:1 |
| Medical infusion pump | 0.2 – 0.5 kg·cm | N20 Planetary Stepper |

### 3. What speed?

Speed and torque trade off through the gear ratio:

```
Output Speed = Motor Speed ÷ Reduction Ratio
Output Torque = Motor Torque × Reduction Ratio × Gear Efficiency
```

| Speed Range | Typical Ratio | Application |
|:---|:---|:---|
| 500-800 RPM | 30:1 – 50:1 | High-speed actuation |
| 100-250 RPM | 100:1 – 200:1 | **Most common range** — smart locks, actuators |
| 20-100 RPM | 200:1 – 500:1 | High torque, moderate speed |
| <20 RPM | 500:1 – 1000:1 | Maximum torque, slow deliberate motion |

### 4. What voltage is available?

| System Voltage | Typical Application | Motor Options |
|:---|:---|:---|
| 3.0 – 3.7V | Single Li-ion cell, wearables | N20 3V winding |
| 5 – 6V | 4×AA batteries, USB-powered | **Most common** — N20 6V winding |
| 12V | Automotive, industrial, wired | N20 12V — highest performance |
| 24V | Commercial vehicles, industrial DC bus | 370/520 — high power |

### 5. What are your constraints?

- **Space:** Max diameter? Max length? Output shaft orientation (parallel or 90°)?
- **Noise:** <30dB (silent) / <50dB (quiet) / Not critical?
- **Life:** 10K cycles? 100K cycles? 200K+ cycles?
- **Self-Locking:** Must the output hold position without power?
- **Duty Cycle:** Continuous run? Intermittent? Occasional?

---

## Step 2: Choose Your Gear Type

The gear type determines torque capacity, precision, noise, cost, and whether the output self-locks.

| Gear Type | Torque Capacity | Backlash | Efficiency | Noise | Self-Locking | Relative Cost | Best For |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **Plastic Spur** | ★☆☆☆☆ | High | 70-80% | <45dB | No | $ | Toys, low-load consumer |
| **Metal Spur** | ★★★☆☆ | Medium | 75-85% | <50dB | No | $$ | Smart locks, cost-sensitive |
| **Planetary** | ★★★★☆ | Low (<1°) | 80-90% | <50dB | No | $$$ | Precision, medical, robotics |
| **Worm** | ★★★☆☆ | Low | 50-65% | <55dB | **Yes** | $$$ | Safety-critical, EV chargers, security |

### Decision flow:

```
Need self-locking?
├── YES → Worm Gear
│   ├── Compact (12mm motor) → N20 Worm
│   └── High torque (24mm motor) → 370/520 Worm
│
└── NO → What's more important?
    ├── Low cost → Metal Spur
    ├── Precision (low backlash) → Planetary
    └── Low noise + low cost, low load → Plastic Spur
```

---

## Step 3: Choose Your Reduction Ratio

The reduction ratio determines the speed-torque trade-off.

| Ratio | Speed (12V) | Torque Multiplier | Best For |
|:---|:---|:---|:---|
| 30:1 | 400 RPM | ×20 | High-speed, low-torque applications |
| 50:1 | 240 RPM | ×35 | Fast actuation cycles |
| **100:1** | **120 RPM** | **×70** | **Standard — smart locks, general actuators** |
| 200:1 | 60 RPM | ×140 | Higher torque, moderate speed |
| 500:1 | 24 RPM | ×350 | High torque, slow deliberate motion |
| 1000:1 | 12 RPM | ×700 | Maximum torque |

> 💡 **Rule of thumb:** Start with 100:1 for most general applications. Adjust from there based on speed and torque requirements.

### Calculating output:

```
Example: N20 Metal Spur, 12V, 100:1 ratio

Motor:
  No-load speed = 12,000 RPM
  Stall torque = 0.04 kg·cm (motor shaft)

After 100:1 Gearbox (85% efficiency):
  Output speed = 12,000 ÷ 100 = 120 RPM (no-load)
  Output torque = 0.04 × 100 × 0.85 = 3.4 kg·cm (stall)
  Rated torque ≈ 3.4 × 0.33 = 1.1 kg·cm (continuous safe operating)
```

---

## Step 4: Select Motor Type

### Brushed DC vs Brushless DC

| | Brushed DC | Brushless DC (BLDC) |
|:---|:---|:---|
| **Cost** | $2 – $15 | $12 – $65+ |
| **Life** | 1,000 – 5,000 hrs | 10,000 – 20,000+ hrs |
| **Noise** | <50-55 dB | <30 dB |
| **EMI** | High (brush arcing) | Low (especially slotless) |
| **Controller** | Simple (DC voltage) | Required (electronic commutation) |
| **Speed Range** | 3,000 – 15,000 RPM | 5,000 – 50,000+ RPM |
| **Efficiency** | 50-70% | 70-90% |
| **Best For** | Cost-sensitive, intermittent duty | Long life, quiet, continuous duty |

**Decision rule:**
- Choose **Brushed DC** for: smart locks, toys, small consumer products, short-duty actuators
- Choose **BLDC** for: medical devices, 24/7 industrial, surgical tools, drones, premium products

---

## Step 5: Add Options

Once you've selected the base motor + gearbox, consider these common add-ons:

| Option | What It Does | When You Need It |
|:---|:---|:---|
| **Encoder** (Hall / Magnetic) | Position and speed feedback | Closed-loop control, precision positioning |
| **Micro Switch** | End-of-travel detection | Limit stops, lock/unlock status, safety |
| **Custom Output Shaft** | Match your mechanism interface | Always — standard on every order |
| **Custom Connector** | Plug-and-play wiring | Production volumes, field replacement |
| **Mounting Bracket** | Direct bolt-in installation | Streamline your assembly process |
| **Waterproofing (IP65/IP67)** | Outdoor/ washdown use | EV chargers, outdoor locks, food equipment |
| **High-Temp Winding** | >85°C operation | Under-hood automotive, industrial ovens |

---

## Common Application Matches

| If You're Building... | Start With This Configuration |
|:---|:---|
| 🔐 **Smart fingerprint lock** | N20 Metal Spur 100:1, 6V, custom shaft |
| 🔐 **Hotel card lock** | N20 Planetary 64:1, 12V + Hall encoder |
| 🔐 **High-security deadbolt** | N20 Worm Self-Lock 200:1, 12V |
| 🔌 **AC EV charging gun (Type 1/2)** | N20 Worm 100:1, 12V + IP67 switch |
| 🔌 **DC fast charging gun (CCS)** | 370 Worm 200:1, 12V/24V + encoder + switch |
| 🏥 **Infusion pump** | N20 Planetary Stepper 64:1 + encoder |
| 🏥 **Ventilator blower** | BL-24C Slotless BLDC, 24V |
| 🏠 **Motorized curtain** | N20 Metal Spur 200:1, 6V, low-noise |
| 🚗 **Automotive door lock actuator** | N20 Worm 200:1, 12V, IATF 16949 |
| 🤖 **Small robot joint** | N20 Planetary 64:1 + magnetic encoder |
| 💧 **Micro liquid dosing** | TF30A Micro Pump + N20 Planetary Stepper |

---

## Download & Next Steps

- 📥 [Download Complete Selection Guide as PDF →]
- 📐 [Request 3D CAD Models for Integration →]
- 🧪 [Order Evaluation Samples (1 Week) →]
- 💬 [Talk to an Engineer About Your Application →]

---

## Summary Checklist

```
☐ Step 1: Define motion type, torque, speed, voltage, constraints
☐ Step 2: Choose gear type (spur / planetary / worm)
☐ Step 3: Calculate reduction ratio from speed/torque requirements
☐ Step 4: Decide brushed DC vs brushless DC
☐ Step 5: Add options (encoder, switch, shaft, connector)
☐ Step 6: Request sample → Test → Iterate → Production
```

> 💡 **Still not sure?** Tell us about your application — our engineers will recommend the optimal configuration within 24 hours. Free. No obligation.

---

> **Yukun** — Your Global Micro Motor Sourcing & Solutions Platform
> 📧 [email] | 📱 [WhatsApp] | 🏭 Shenzhen, China
> *We help engineers select the right micro drive. Fast samples. Consistent quality. Global shipping.*
