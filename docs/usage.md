---
title: Usage
nav_order: 2
---

# Usage

Everything is accessed through `src/api.ts` — the single entry point for the domain package.

```ts
import {
    createDomainApi,
    depSpecs, testSpec,
    type DomainDeps,
    type DomainApi,
} from './api'
```

---

## 1. Implement dependencies

The domain declares what infrastructure it needs through the `DomainDeps` type. Your app layer provides the implementations — database queries, HTTP clients, clocks, ID generators.

```ts
const deps: DomainDeps = {
    generateId: async () => { /* return a UUID */ },
    generateTimestamp: async () => { /* return current Date */ },
    getIncomingProcessingById: async (id) => { /* query your DB */ },
    upsertIncomingProcessing: async (aggregate) => { /* persist */ },
    // ... all 15 deps
}
```

Each dep has a spec with assertions that define its contract. Use `testSpec` and `depSpecs` to validate your implementations — the keys match `DomainDeps` 1:1:

```ts
import { depSpecs, testSpec } from './api'

testSpec('generateId', depSpecs.generateId, deps.generateId)
testSpec('getMediationById', depSpecs.getMediationById, deps.getMediationById)
// ... one line per dep
```

---

## 2. Create the API

```ts
const mediator = createDomainApi(deps)
```

This returns an object with two sections: `cmd` and `polling`.

---

## 3. Commands

Commands are the app layer's entry points into the domain. Each accepts a typed payload, validates it, and executes the operation.

```ts
// Receive an inbound CloudEvent
const result = await mediator.cmd.receiveEvent({
    processingId: '550e8400-e29b-41d4-a716-446655440000',
    event: cloudEvent,
})

// Manage mediations
await mediator.cmd.createMediation({
    topic: 'patient.created',
    destination: 'https://downstream.example.com/webhook',
    pipeline: [{ type: 'filter', rules: { logic: 'and', conditions: [...] } }],
})
await mediator.cmd.activateMediation({ mediationId: '...' })
await mediator.cmd.deactivateMediation({ mediationId: '...' })
```

Every command returns a `Result`:

```ts
if (result.ok) {
    // result.value — the aggregate after the operation
    // result.successType — e.g. ['event-received'], ['draft-activated']
} else {
    // result.errors — e.g. ['not_found'], ['invalid_activate_mediation_command']
    // result.details — optional, TypeBox validation messages on parse failures
}
```

---

## 4. Polling

Polling functions drive the processing pipeline. Wire them to any scheduler — they take no arguments and process the next available batch.

```ts
// Simple interval
setInterval(() => mediator.polling.pollReceived(), 5_000)
setInterval(() => mediator.polling.pollValidated(), 5_000)
setInterval(() => mediator.polling.pollDispatches(), 5_000)

// Or cron, queue triggers, k8s CronJobs — whatever fits your infra
```

| Function | Picks up | Does |
|---|---|---|
| `pollReceived` | Received events | Validates against declared JSON Schema |
| `pollValidated` | Validated events | Runs matching mediations, creates dispatches |
| `pollDispatches` | Pending dispatches | Delivers to destinations with retries |

---

## 5. Types

Domain types are re-exported for use in your app layer:

```ts
import type { Mediation, Dispatch, IncomingProcessing } from './api'
```

See [Aggregates](/) for the full lifecycle and state transitions of each type.
