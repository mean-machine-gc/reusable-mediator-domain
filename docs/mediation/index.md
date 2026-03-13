---
title: Mediation
nav_order: 3
has_children: true
---

# Mediation

The Mediation aggregate connects a source topic to a destination endpoint. It owns the pipeline of operations (filter, transform, enrich) applied to CloudEvents before routing them to third-party webhook destinations.

## Lifecycle

| State | Description |
|---|---|
| **Draft** | Created with pipeline configuration, not yet routing events |
| **Active** | Accepting and processing events for its topic |
| **Deactivated** | Paused, no longer processing events |

## Operations

| Operation | Description |
|---|---|
| [Create Mediation](create-mediation) | Create a new draft mediation with topic, destination, and pipeline |
| [Activate Mediation](activate-mediation) | Transition a draft or deactivated mediation to active |
| [Deactivate Mediation](deactivate-mediation) | Pause an active mediation |
| [Mediate](mediate) | Run an event through a mediation's pipeline |
