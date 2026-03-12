---
title: Dispatches
nav_order: 4
has_children: true
---

# Dispatches

The Dispatches aggregate tracks outbound event delivery from the mediator to downstream destinations. Each dispatch represents a single event being sent to a single destination, with full lifecycle tracking from creation through delivery or failure.

Dispatches support retry logic with configurable maximum attempts. Each delivery attempt captures the full HTTP response (status code, headers, body, response time) for observability and debugging.

## Lifecycle

| State | Description |
|---|---|
| **to-deliver** | Dispatch created, awaiting first delivery attempt |
| **attempted** | At least one failed attempt, retries still available |
| **delivered** | Successfully delivered to the destination |
| **failed** | All retry attempts exhausted without success |

## Operations

| Operation | Description |
|---|---|
| [Create Dispatch](create-dispatch) | Create a new dispatch in to-deliver state from a mediation outcome |
| [Record Delivery](record-delivery) | Record a delivery attempt — transitions to delivered, attempted, or failed |
