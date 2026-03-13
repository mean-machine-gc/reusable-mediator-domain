import type { DomainDeps } from './domain-deps'
import type { ReceiveEventCommand } from './incoming-processing/receive-event/command/command'
import type { ActivateMediationCommand } from './mediation/activate-mediation/command/command'
import type { DeactivateMediationCommand } from './mediation/deactivate-mediation/command/command'
import type { CreateMediationCommand } from './mediation/create-mediation/command/command'

import { parseReceiveEventCommand } from './incoming-processing/receive-event/command/parse-command'
import { parseActivateMediationCommand } from './mediation/activate-mediation/command/parse-command'
import { parseDeactivateMediationCommand } from './mediation/deactivate-mediation/command/parse-command'
import { parseCreateMediationCommand } from './mediation/create-mediation/command/parse-command'

import { _receiveEvent } from './incoming-processing/receive-event/receive-event'
import { _activateMediation } from './mediation/activate-mediation/activate-mediation'
import { _deactivateMediation } from './mediation/deactivate-mediation/deactivate-mediation'
import { _createMediation } from './mediation/create-mediation/create-mediation'

import { _pollReceived } from './polling/poll-received/poll-received'
import { _pollValidated } from './polling/poll-validated/poll-validated'
import { _pollDispatches } from './polling/poll-dispatches/poll-dispatches'

import {
    generateIdSpec,
    generateTimestampSpec,
    getIncomingProcessingByIdSpec,
    getDispatchByIdSpec,
    getMediationByIdSpec,
    upsertIncomingProcessingSpec,
    upsertDispatchSpec,
    upsertMediationSpec,
    findIncomingProcessingsByStateSpec,
    findDispatchesByStateSpec,
    findActiveMediationsByTopicSpec,
    resolveSchemaSpec,
    deliverSpec,
    getMaxAttemptsSpec,
    getTransformRegistrySpec,
} from './domain-deps.spec'

// ── Runtime API — needs deps ─────────────────────────────────────────────

export const createDomainApi = (deps: DomainDeps) => {
    const receiveEvent = _receiveEvent(deps)
    const activateMediation = _activateMediation(deps)
    const deactivateMediation = _deactivateMediation(deps)
    const createMediation = _createMediation(deps)

    return {
        // ── Commands — app layer entry points, parse + execute ───────────
        cmd: {
            receiveEvent: async (payload: ReceiveEventCommand) => {
                const cmd = parseReceiveEventCommand(payload)
                if (!cmd.ok) return cmd
                return receiveEvent({ cmd: cmd.value })
            },
            activateMediation: async (payload: ActivateMediationCommand) => {
                const cmd = parseActivateMediationCommand(payload)
                if (!cmd.ok) return cmd
                return activateMediation({ cmd: cmd.value })
            },
            deactivateMediation: async (payload: DeactivateMediationCommand) => {
                const cmd = parseDeactivateMediationCommand(payload)
                if (!cmd.ok) return cmd
                return deactivateMediation({ cmd: cmd.value })
            },
            createMediation: async (payload: CreateMediationCommand) => {
                const cmd = parseCreateMediationCommand(payload)
                if (!cmd.ok) return cmd
                return createMediation({ cmd: cmd.value })
            },
        },

        // ── Polling — wire to any scheduler (cron, setInterval, queue) ──
        polling: {
            pollReceived: _pollReceived(deps),
            pollValidated: _pollValidated(deps),
            pollDispatches: _pollDispatches(deps),
        },
    }
}

// Full API type — use to declare it as a dependency in the app layer
export type DomainApi = ReturnType<typeof createDomainApi>

// Union of all command keys — use for routing, logging, or middleware
export type CommandType = keyof DomainApi['cmd']

// ── Dep contract — keys mirror DomainDeps for 1:1 testing ────────────────

export { type DomainDeps } from './domain-deps'
export { testSpec } from './shared/spec-framework'

export const depSpecs = {
    generateId: generateIdSpec,
    generateTimestamp: generateTimestampSpec,
    getIncomingProcessingById: getIncomingProcessingByIdSpec,
    getDispatchById: getDispatchByIdSpec,
    getMediationById: getMediationByIdSpec,
    upsertIncomingProcessing: upsertIncomingProcessingSpec,
    upsertDispatch: upsertDispatchSpec,
    upsertMediation: upsertMediationSpec,
    findIncomingProcessingsByState: findIncomingProcessingsByStateSpec,
    findDispatchesByState: findDispatchesByStateSpec,
    findActiveMediationsByTopic: findActiveMediationsByTopicSpec,
    resolveSchema: resolveSchemaSpec,
    deliver: deliverSpec,
    getMaxAttempts: getMaxAttemptsSpec,
    getTransformRegistry: getTransformRegistrySpec,
}

// ── Domain types — for the app layer to type its own code ────────────────

export type { IncomingProcessing, ReceivedProcessing, ValidatedProcessing, MediatedProcessing, FailedProcessing } from './incoming-processing/types'
export type { Dispatch, ToDeliverDispatch, AttemptedDispatch, DeliveredDispatch, FailedDispatch, DeliveryAttempt } from './dispatches/types'
export type { Mediation, DraftMediation, ActiveMediation, DeactivatedMediation } from './mediation/types'

// ── Spec framework — for the app layer to use testSpec and types ─────────

export type { Cmd, Result, SpecFn, Spec } from './shared/spec-framework'
