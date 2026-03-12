---
title: Polling
nav_order: 5
has_children: true
---

# Polling

Polling orchestrators drive the event processing pipeline by fetching batches of
aggregates in a specific state, invoking the appropriate domain operations, and
producing a summary of outcomes.

Each poller is a batch processor that composes assembled domain shells. They never
fail at the poller level — individual record outcomes (success or failure) are
tracked in the result summary.

## Pipeline

Pollers run in sequence, each picking up where the previous left off:

| Poller | Picks up | Calls | Transitions to |
|---|---|---|---|
| [Poll Received](poll-received) | `received` processing records | `validateProcessing` shell | `validated` or `failed` |
| [Poll Validated](poll-validated) | `validated` processing records | `mediateAll` step, `createDispatch` + `mediateProcessing` shells | `mediated` or `failed` |
| [Poll Dispatches](poll-dispatches) | `to-deliver` + `attempted` dispatches | `recordDelivery` shell | `delivered`, `attempted`, or `failed` |

## Operations

| Operation | Description |
|---|---|
| [Poll Received](poll-received) | Validate schema for received processing records |
| [Poll Validated](poll-validated) | Run mediations, create dispatches, record outcomes |
| [Poll Dispatches](poll-dispatches) | Attempt HTTP delivery, classify results |
