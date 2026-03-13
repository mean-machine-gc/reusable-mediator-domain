import type {
    GenerateIdFn,
    GenerateTimestampFn,
    GetIncomingProcessingByIdFn,
    GetDispatchByIdFn,
    GetMediationByIdFn,
    UpsertIncomingProcessingFn,
    UpsertDispatchFn,
    UpsertMediationFn,
    FindIncomingProcessingsByStateFn,
    FindDispatchesByStateFn,
    FindActiveMediationsByTopicFn,
    ResolveSchemaFn,
    DeliverFn,
    GetMaxAttemptsFn,
    GetTransformRegistryFn,
} from './domain-deps.spec'

export type DomainDeps = {
    // ── id generation ─────────────────────────────────────────────────────

    generateId: GenerateIdFn['depSignature']

    // ── timestamps ──────────────────────────────────────────────────────────

    generateTimestamp: GenerateTimestampFn['depSignature']

    // ── persistence: getById ─────────────────────────────────────────────

    getIncomingProcessingById: GetIncomingProcessingByIdFn['depSignature']
    getDispatchById: GetDispatchByIdFn['depSignature']
    getMediationById: GetMediationByIdFn['depSignature']

    // ── persistence: upsert ──────────────────────────────────────────────

    upsertIncomingProcessing: UpsertIncomingProcessingFn['depSignature']
    upsertDispatch: UpsertDispatchFn['depSignature']
    upsertMediation: UpsertMediationFn['depSignature']

    // ── persistence: find ────────────────────────────────────────────────

    findIncomingProcessingsByState: FindIncomingProcessingsByStateFn['depSignature']
    findDispatchesByState: FindDispatchesByStateFn['depSignature']
    findActiveMediationsByTopic: FindActiveMediationsByTopicFn['depSignature']

    // ── others ──────────────────────────────────────────────────────────────

    resolveSchema: ResolveSchemaFn['depSignature']
    deliver: DeliverFn['depSignature']
    getMaxAttempts: GetMaxAttemptsFn['depSignature']
    getTransformRegistry: GetTransformRegistryFn['depSignature']
}
