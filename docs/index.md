---
layout: default
title: Home
nav_order: 1
mermaid: true
---

# OpenHIM Reusable Mediator

> A configurable mediator that sits between OpenHIM channels and downstream endpoints,
> applying pipelines of operations (filter, transform, enrich) to CloudEvents before
> routing them to third-party webhook destinations — with full lifecycle tracking
> from ingestion through delivery.

---

## Event Flow

```mermaid
flowchart LR
    CE([CloudEvent]) --> Receive
    subgraph Processing["Incoming Processing"]
        Receive --> Validate
        Validate --> Mediate
    end
    Mediate --> M1[Mediation A]
    Mediate --> M2[Mediation B]
    M1 -->|routed| D1[Dispatch A]
    M1 -->|skipped| S1(( ))
    M2 -->|routed| D2[Dispatch B]
    D1 --> Deliver1[Deliver]
    D2 --> Deliver2[Deliver]

    style S1 fill:#555,stroke:#555
    style Processing fill:none,stroke:#666
```

---

## Aggregates

### [Mediation](mediation/)

Connects a source topic to a destination. Owns the pipeline of filter/transform/enrich
steps applied to each event on that route.

```mermaid
stateDiagram-v2
    [*] --> Draft : create
    Draft --> Active : activate
    Active --> Deactivated : deactivate
    Deactivated --> Active : re-activate
```

**Constraint:** Only one Mediation can be Active for a given topic+destination pair.

**Operations:** [Create](mediation/create-mediation) | [Activate](mediation/activate-mediation) | [Deactivate](mediation/deactivate-mediation) | [Mediate](mediation/mediate) | [Handle Event](mediation/handle-event)

---

### [Incoming Processing](incoming-processing/)

Tracks the lifecycle of an inbound CloudEvent from arrival through schema validation,
mediation, and outcome recording. Provides a persistent, inspectable audit trail.

```mermaid
stateDiagram-v2
    [*] --> Received : receive
    Received --> Validated : validate
    Validated --> Mediated : mediate
    Received --> Failed : fail
    Validated --> Failed : fail
```

**Operations:** [Receive Event](incoming-processing/receive-event) | [Validate Processing](incoming-processing/validate-processing) | [Mediate Processing](incoming-processing/mediate-processing) | [Fail Processing](incoming-processing/fail-processing)

---

### [Dispatches](dispatches/)

Tracks outbound event delivery to each destination with retry logic. Each dispatch
captures every delivery attempt with full HTTP response detail for observability.

```mermaid
stateDiagram-v2
    [*] --> ToDeliver : create
    ToDeliver --> Delivered : attempt succeeds
    ToDeliver --> Attempted : attempt fails
    Attempted --> Delivered : retry succeeds
    Attempted --> Attempted : retry fails, retries remain
    Attempted --> Failed : retry fails, max reached
```

**Operations:** [Create Dispatch](dispatches/create-dispatch) | [Record Delivery](dispatches/record-delivery)
