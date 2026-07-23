# P0-4 Video Script — Smart Door Lock Motion System

> **⚠️ REVIEW DRAFT — NOT PUBLISHED.** This is a generic engineering teardown script. Before recording, the presenter must open the actual sample and complete the verification checklist at the end. Do not describe a sample-specific component, dimension, material, or measurement unless it is visible or measured.

## Working title

**Smart Door Lock Teardown: The Motor, Gear Train, and Feedback Behind Every Turn**

## Target

- Audience: product engineers, hardware founders, and sourcing teams
- Runtime: approximately 4 minutes
- Format: English voice-over with bench footage and simple annotations

## Segment 1 — Hook (0:00–0:20)

**[SHOW: Exterior of the lock, then a close-up of the deadbolt moving.]**

A smart lock looks like a keypad, a fingerprint reader, or an app. But the moment of truth is mechanical: can a compact actuator move the deadbolt reliably when the door load, battery condition, and alignment are not perfect?

Today, we are mapping the motion system inside a smart door lock—from the motor to the gear train, position feedback, and the final output.

## Segment 2 — What we are examining (0:20–0:45)

**[SHOW: Lock on the bench. Label the exterior assembly, interior assembly, and lock body.]**

Smart locks do not all use the same construction. Some drive a thumb-turn, some move a bolt through an internal gearbox, and others integrate the actuator into the lock body.

For this teardown, we will identify the architecture actually present in the sample. We will keep the electronics discussion brief and focus on the components that create, transfer, and confirm motion.

**[ON SCREEN: “Verify the sample before publishing specifications.”]**

## Segment 3 — Open the housing and map the subsystems (0:45–1:15)

**[SHOW: Safe disassembly. Keep fasteners organized. Reveal the internal assembly.]**

Once the housing is open, divide the system into five functional blocks:

one, the power source;  
two, the control board and motor driver;  
three, the motor and reduction stage;  
four, the output interface connected to the thumb-turn or deadbolt;  
and five, the feedback device that tells the controller where the mechanism is.

**[SHOW: Trace each block with a colored overlay. Do not label a component until confirmed.]**

This block diagram is more useful than guessing a motor model because it shows how an electrical command becomes a controlled mechanical movement.

## Segment 4 — Follow the motion chain (1:15–1:55)

**[SHOW: Rotate the output slowly by hand where safe. Trace motor shaft to final output.]**

The motor provides speed, but a lock needs controlled output force. A reduction stage converts that high-speed rotation into slower movement at the bolt or thumb-turn.

If the sample uses a worm stage, show the worm on the motor shaft and the mating worm wheel. Then trace any additional gears, clutch, coupling, or cam before the final output.

**[SHOW: Side-by-side arrows for motor rotation and output rotation.]**

Do not assume that “worm gear” automatically means the complete lock is self-locking. The result depends on the geometry, friction, downstream mechanism, and whether the design includes a clutch or manual override. Test the assembled mechanism instead of relying on the gearbox name.

## Segment 5 — How the controller knows when to stop (1:55–2:30)

**[SHOW: Locate confirmed micro switches, Hall sensors, encoder features, or current-sensing circuitry.]**

Motion without feedback creates uncertainty. The controller needs a way to recognize the locked position, the unlocked position, or an obstruction.

A design may use a micro switch, a magnetic sensor, an encoder, motor-current behavior, time-based control, or a combination of methods. The sample decides the answer.

If a switch is present, show what feature actuates it and whether it represents bolt position or only gearbox position. That distinction matters when diagnosing a lock that reports success even though the deadbolt did not fully travel.

## Segment 6 — Build the functional BOM (2:30–3:05)

**[SHOW: Place confirmed parts in order on the bench. Add a simple BOM table.]**

The motion BOM should record function before part number:

- motor type and measured envelope;
- reduction architecture and output interface;
- clutch or manual-override mechanism, if present;
- position-feedback component and actuation method;
- motor driver and connector;
- mechanical stops, springs, dampers, and housing features.

For each item, photograph the markings, measure only with appropriate tools, and record how it connects to the next component. This creates a sourcing brief that another engineer can actually review.

## Segment 7 — What to validate before selecting a replacement (3:05–3:40)

**[SHOW: Checklist graphics over the reassembled actuator.]**

A replacement motor cannot be chosen from voltage and diameter alone. Validate the complete operating window:

- output movement and required travel;
- peak load during real door alignment conditions;
- battery voltage across its usable range;
- lock and unlock time;
- stall protection and obstruction behavior;
- manual override;
- acoustic target;
- environmental exposure;
- connector, shaft, mounting, and gearbox interfaces.

The most important test is the assembled lock under realistic load. A motor that works on an open bench may behave differently when the bolt rubs against the strike plate.

## Segment 8 — Summary and CTA (3:40–4:10)

**[SHOW: Reassembled lock cycling once, then the motion-chain diagram.]**

The key lesson is simple: a smart lock is a motion system, not just a motor. Reliable operation depends on the motor, reduction stage, output interface, feedback method, mechanical load, and control logic working together.

Yukun Drive helps product teams clarify these requirements, compare practical component options, and coordinate sourcing for compact motion applications.

If you are developing a smart lock or another small actuator, send your application, available space, power conditions, load, travel, and target behavior to **info@yukun-drive.com**.

Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.

**[ON SCREEN: yukun-drive.com | info@yukun-drive.com]**

---

## Field verification checklist

Complete this before recording or moving the draft into the public content collection:

- [ ] Record the sample brand and model internally; confirm permission before showing branding.
- [ ] Photograph every disassembly stage.
- [ ] Confirm the actual actuation path: motor → reduction → coupling/cam → output.
- [ ] Confirm whether a worm stage is present.
- [ ] Identify any clutch, manual override, spring, damper, or mechanical stop.
- [ ] Identify the feedback method and what physical position it represents.
- [ ] Record visible part markings without inferring missing specifications.
- [ ] Measure motor envelope, shaft/interface, and connector only with appropriate tools.
- [ ] Observe power source and nominal system labeling; do not infer the motor voltage from the battery pack alone.
- [ ] Capture current, time, sound, or force only if the test method and instrument are shown.
- [ ] Test obstruction and misalignment only with a safe procedure that cannot damage the door, lock, or operator.
- [ ] Remove or rewrite every narration line that does not match the actual sample.
