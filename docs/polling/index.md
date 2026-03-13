---
title: Polling
nav_order: 6
has_children: true
---

# Polling

Scheduler-driven functions that advance the processing pipeline by fetching batches of aggregates in a specific state and invoking domain operations. Each poller is a self-contained async function — wire it to any scheduler (cron, setInterval, queue trigger).

## Pollers

| Poller | Picks up | Transitions to |
|---|---|---|
| [Poll Received](poll-received) | `received` records | `validated` or `failed` |
| [Poll Validated](poll-validated) | `validated` records | `mediated` or `failed` (+ dispatches created) |
| [Poll Dispatches](poll-dispatches) | `to-deliver` / `attempted` dispatches | `delivered`, `attempted`, or `failed` |
