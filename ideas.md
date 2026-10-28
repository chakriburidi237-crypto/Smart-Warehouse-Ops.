# WarehouseIQ — Product & Visual Direction

## Three Directions Considered

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| Signal Room | A control-tower workspace where urgency, flow, and decisions read at a glance. This direction feels calm under pressure rather than visually loud. | 0.07 |
| Industrial Ledger | A tactile operations notebook inspired by paper manifests, stamped labels, and warehouse floor signage. It makes process accountability feel physical and deliberate. | 0.04 |
| Night Shift Grid | A dense, high-contrast logistics console with luminous status signals and compact instrumentation. It brings a focused late-shift command-centre energy. | 0.09 |

## Chosen Direction: Signal Room

### Design Movement
**Editorial operations design** meets a modern logistics control tower. The interface borrows the composure of a financial newspaper, the clarity of air-traffic flow displays, and the material restraint of contemporary industrial wayfinding.

### Core Principles
1. **Decision before data:** Each region leads with a recommendation or operating state, then exposes the evidence.
2. **Flow is visible:** Fulfillment stages, team motion, and bottlenecks are represented as linked, directional systems rather than disconnected cards.
3. **Quiet precision:** Neutral surfaces provide rest; amber and red appear only when a decision demands attention.
4. **Human accountability:** Operational work is grounded in owners, zones, timing, and clear next actions.

### Color Philosophy
The product uses **warm parchment and graphite** as a stable operations surface, reflecting physical manifests and warehouse materials without becoming retro. **Signal orange (#E46B35)** is the ownable action color: it marks an intervention, not decoration. Deep ink blue denotes stable system state, sage supports healthy flow, and alert crimson is reserved for true exceptions. The result avoids the generic blue SaaS dashboard while keeping severity immediately legible.

### Layout Paradigm
The page behaves as an **operational field desk**, not a centralised card grid. A fixed ledger-style left rail anchors navigation and warehouse context. The top strip acts as a live shift brief. Below it, an asymmetric two-column workspace places the active decision stream on the left and real-time warehouse condition on the right. Tables retain useful density but use long horizontal rules, editorial labels, and variable block sizes to create rhythm.

### Signature Elements
1. **Flow tape:** A slim, directional stage indicator with small numbered positions and real-time status pulses.
2. **Decision tickets:** Amber-edged recommendation modules that connect a stated exception to a clear action and projected outcome.
3. **Coordinate tags:** Small monospace location chips (for example, `A-03 / BIN-17`) that tie digital activity back to the physical warehouse.

### Interaction Philosophy
Interactions should feel like manipulating a well-organised shift board. Prioritisation actions produce immediate, traceable feedback; state changes are concise and reversible where appropriate. Hover states lift only slightly, reveal a utility affordance, and never obscure operational information. The interface favours explicit controls over hidden magic.

### Animation
Use brief **180–240 ms** transform-and-opacity transitions with a `cubic-bezier(0.23, 1, 0.32, 1)` easing. Lists and queue entries enter with a 35–60 ms stagger. Exception tickets use a restrained left-edge pulse only until acknowledged. Stage dots may softly breathe to signal active work, but metrics do not count up continuously. Respect reduced-motion preferences and keep keyboard-triggered actions instant.

### Typography System
**DM Sans** provides highly readable operational body copy and interface labels. **DM Mono** is reserved for warehouse coordinates, order IDs, timestamps, and numeric deltas. **Bodoni Moda** appears in selected display headings and the daily operational narrative, adding editorial character without compromising utility. Headings are tight and high contrast; labels are uppercase, tracked, and compact; data columns align using tabular numerals.

### Brand Essence
**WarehouseIQ is a decision desk for fulfillment teams who need to turn warehouse signals into the next best action.**

Personality: **assured, analytical, grounded**.

### Brand Voice
Headlines are direct, observational, and action-oriented. CTAs use operational verbs, not generic conversion language. Microcopy explains the consequence of an intervention in a calm, specific tone.

> “One decision is holding 12 shipments. Resolve it before the 16:00 cut-off.”

> “Allocate 7 available units to the priority order — preserve the promise window.”

### Wordmark & Logo
The logo is a bold **stacked-path glyph**: three offset warehouse aisles forming an upward-facing arrow within a square. It represents stock flow, prioritisation, and forward movement without relying on text. The wordmark pairs a confident serif “Warehouse” with compact mono “IQ” when required.

### Signature Brand Color
**Signal Orange — #E46B35**

## Style Decisions

- **Signal Orange #E46B35** is reserved for active exceptions, recommended actions, SLA risk, and primary resolution controls. Stable navigation counts and neutral metadata use ink blue, sage, graphite, or parchment.
- **Every major panel demonstrates an operational decision:** the evidence, its owner or location, and the next linked hand-off are shown before decorative detail.
- **Warehouse imagery behaves as floor-state evidence,** paired with a coordinate, live zone state, or shift annotation rather than functioning as generic hero photography.

## Product Model & Decision Logic

### Core Objects

| Object | Key fields | Operational purpose |
| --- | --- | --- |
| Order | ID, customer, priority, promised cut-off, item demand, stage, SLA risk | Determines what must move next. |
| SKU | available, reserved, inbound, reorder point, bin locations, velocity | Establishes inventory health and allocation capacity. |
| Allocation | order, SKU, committed quantity, rule, competing demand | Records why limited stock was assigned. |
| Task | zone, picker, route, sequence, task status | Coordinates picking and packing work. |
| Exception | severity, type, affected order/SKU, recommended resolution, owner | Turns a problem into a controlled resolution workflow. |

### Priority Score

`Priority score = urgency weight + SLA risk + customer tier + fulfillment readiness + exception penalty`

Urgent orders approaching a cut-off rank first. When stock is constrained, the allocation engine protects the highest score first, flags affected lower-priority demand, and proposes the exact trade-off. Inventory is not silently oversold.

### Demonstrated Decision Scenario

Order **SO-48219** is urgent, needs **10 units** of `LUMA-200`, and has a 16:00 promise window. Only **7 units** are available; a lower-priority order has **5 units** reserved. The system proposes that the lead reallocate the 7 available units to SO-48219, split-ship the remaining 3 from inbound stock at 14:20, and release the lower-priority reservation with a revised next-day promise. The action preserves the high-value SLA and records the impact transparently.
