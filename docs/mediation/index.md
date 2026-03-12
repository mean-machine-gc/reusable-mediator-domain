---
title: Mediation
nav_order: 2
has_children: true
---

# Mediation

The Mediation aggregate connects a source topic to a destination adapter. It owns the pipeline of operations (filter, transform, enrich) applied to CloudEvents before routing them to third-party webhook endpoints.

**Lifecycle:** Draft &rarr; Active &rarr; Deactivated

**Constraints:**
- Only one Mediation can be Active for a given topic+destination pair.

---

## Operations

| Operation | Description |
|---|---|
| [Create Mediation](create-mediation) | Create a new Mediation in Draft state with source topic, destination, and pipeline steps |
| [Activate Mediation](activate-mediation) | Transition a Draft or Deactivated mediation to Active |
| [Deactivate Mediation](deactivate-mediation) | Transition an Active mediation to Deactivated |
| [Mediate](mediate) | Run the pipeline against an incoming CloudEvent — filter, transform, and route |
