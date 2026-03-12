---
title: Incoming Processing
nav_order: 3
has_children: true
---

# Incoming Processing

The Incoming Processing aggregate tracks the lifecycle of an inbound CloudEvent from the moment it arrives through schema validation, mediation, and eventual dispatch. It provides a persistent, inspectable record of every step the system took to handle an event.

**Lifecycle:** Received &rarr; Validated &rarr; Mediated

Any non-terminal state can transition to **Failed** if an error occurs during processing.

**Terminal states:** Mediated, Failed

---

## Operations

| Operation | Description |
|---|---|
| [Receive Event](receive-event) | Accept an incoming CloudEvent and create the initial processing record |
| [Validate Processing](validate-processing) | Validate event data against its declared JSON Schema |
| [Mediate Processing](mediate-processing) | Record the outcomes of mediation (dispatched/skipped per mediation) |
| [Fail Processing](fail-processing) | Transition a non-terminal processing record to failed with a reason |
