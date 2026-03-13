---
title: Dispatches
nav_order: 5
has_children: true
---

# Dispatches

Tracks outbound event delivery to each destination with retry logic. Each dispatch captures every delivery attempt with full HTTP response detail for observability.

## Lifecycle

| State | Description |
|---|---|
| **To-deliver** | Created from a mediation outcome, awaiting first attempt |
| **Attempted** | At least one failed attempt, retries still available |
| **Delivered** | Successfully delivered to the destination |
| **Failed** | All retry attempts exhausted without success |

## Operations

| Operation | Description |
|---|---|
| [Create Dispatch](create-dispatch) | Create a new dispatch from a mediation routing outcome |
| [Record Delivery](record-delivery) | Record a delivery attempt and transition based on result and retry budget |
