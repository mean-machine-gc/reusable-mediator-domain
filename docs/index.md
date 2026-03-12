---
layout: default
title: Home
nav_order: 1
---

# OpenHIM Reusable Mediator

> A configurable mediator that sits between OpenHIM channels and downstream endpoints,
> applying pipelines of operations (filter, transform, enrich) to CloudEvents before
> routing them to third-party webhook destinations — with full lifecycle tracking
> from ingestion through delivery.

---

## How it works

1. An inbound CloudEvent arrives and is **received** as an Incoming Processing record
2. The event data is **validated** against its declared JSON Schema
3. All active Mediations matching the event's topic are evaluated — each applies its
   pipeline (filter, transform, enrich) and produces a routing outcome
4. For each routed destination, a **Dispatch** is created and delivery is attempted
   with configurable retries
5. The processing record is updated with mediation outcomes (dispatched or skipped per mediation)

---

## Aggregates

### [Mediation](mediation/)

Connects a source topic to a destination. Owns the pipeline of filter/transform/enrich
steps applied to each event on that route.

| State | Description |
|---|---|
| **Draft** | Created with pipeline configuration, not yet routing events |
| **Active** | Accepting and processing events for its topic |
| **Deactivated** | Paused, no longer processing events |

**Constraint:** Only one Mediation can be Active for a given topic+destination pair.

**Operations:** [Create](mediation/create-mediation) | [Activate](mediation/activate-mediation) | [Deactivate](mediation/deactivate-mediation) | [Mediate](mediation/mediate) | [Handle Event](mediation/handle-event)

---

### [Incoming Processing](incoming-processing/)

Tracks the lifecycle of an inbound CloudEvent from arrival through schema validation,
mediation, and outcome recording. Provides a persistent, inspectable audit trail.

| State | Description |
|---|---|
| **Received** | Event accepted, awaiting validation |
| **Validated** | Schema validation passed, awaiting mediation |
| **Mediated** | All mediations evaluated, outcomes recorded |
| **Failed** | An error occurred at any stage (terminal) |

**Operations:** [Receive Event](incoming-processing/receive-event) | [Validate Processing](incoming-processing/validate-processing) | [Mediate Processing](incoming-processing/mediate-processing) | [Fail Processing](incoming-processing/fail-processing)

---

### [Dispatches](dispatches/)

Tracks outbound event delivery to each destination with retry logic. Each dispatch
captures every delivery attempt with full HTTP response detail for observability.

| State | Description |
|---|---|
| **To-deliver** | Created from a mediation outcome, awaiting first attempt |
| **Attempted** | At least one failed attempt, retries still available |
| **Delivered** | Successfully delivered to the destination |
| **Failed** | All retry attempts exhausted without success |

**Operations:** [Create Dispatch](dispatches/create-dispatch) | [Record Delivery](dispatches/record-delivery)

---

## Event flow

```
CloudEvent ──▶ Receive ──▶ Validate ──▶ Mediate ──┬──▶ Dispatch A ──▶ Deliver
               (Processing)                       ├──▶ Dispatch B ──▶ Deliver
                                                   └──▶ (skipped)
```

Each arrow is a tracked state transition. Failures at any point are recorded
with full context for debugging and retry.
