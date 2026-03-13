---
title: Incoming Processing
nav_order: 4
has_children: true
---

# Incoming Processing

Tracks the lifecycle of an inbound CloudEvent from arrival through schema validation, mediation, and outcome recording. Provides a persistent, inspectable audit trail for every event that enters the system.

## Lifecycle

| State | Description |
|---|---|
| **Received** | Event accepted, awaiting validation |
| **Validated** | Schema validation passed, awaiting mediation |
| **Mediated** | All mediations evaluated, outcomes recorded |
| **Failed** | An error occurred at any stage (terminal) |

## Operations

| Operation | Description |
|---|---|
| [Receive Event](receive-event) | Accept an inbound CloudEvent and create a processing record |
| [Validate Processing](validate-processing) | Validate the event data against its declared JSON Schema |
| [Mediate Processing](mediate-processing) | Record mediation outcomes on the processing record |
| [Fail Processing](fail-processing) | Transition a processing record to failed with a reason |
