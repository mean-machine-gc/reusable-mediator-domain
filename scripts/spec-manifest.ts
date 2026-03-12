// scripts/spec-manifest.ts
//
// Add one entry per composed spec (factory). The generate-specs script reads
// this manifest, imports each spec, and writes the .spec.md decision tables
// next to the spec file.
//
// Output path is derived from specPath: same directory, .spec.md extension.

export type ManifestEntry = {
  name:       string   // human-readable name for logging
  specPath:   string   // import path relative to this file (no extension)
  exportName: string   // named export from the spec module
}

export const specManifest: ManifestEntry[] = [
  {
    name: 'evaluate-filter-step',
    specPath: '../src/mediation/mediate/steps/evaluate-filter-step.spec',
    exportName: 'evaluateFilterStepSpec',
  },
  {
    name: 'execute-filters',
    specPath: '../src/mediation/mediate/steps/execute-filters.spec',
    exportName: 'executeFiltersSpec',
  },
  {
    name: 'mediate-core',
    specPath: '../src/mediation/mediate/core/mediate.spec',
    exportName: 'mediateCoreSpec',
  },
  {
    name: 'activate-mediation-core',
    specPath: '../src/mediation/activate-mediation/core/activate-mediation.spec',
    exportName: 'activateMediationCoreSpec',
  },
  {
    name: 'deactivate-mediation-core',
    specPath: '../src/mediation/deactivate-mediation/core/deactivate-mediation.spec',
    exportName: 'deactivateMediationCoreSpec',
  },
  {
    name: 'activate-mediation-shell',
    specPath: '../src/mediation/activate-mediation/activate-mediation.spec',
    exportName: 'activateMediationShellSpec',
  },
  {
    name: 'deactivate-mediation-shell',
    specPath: '../src/mediation/deactivate-mediation/deactivate-mediation.spec',
    exportName: 'deactivateMediationShellSpec',
  },
  {
    name: 'create-mediation-shell',
    specPath: '../src/mediation/create-mediation/create-mediation.spec',
    exportName: 'createMediationShellSpec',
  },
  // ── IncomingProcessing ──────────────────────────────────────────────────────
  {
    name: 'receive-event-core',
    specPath: '../src/incoming-processing/receive-event/core/receive-event.spec',
    exportName: 'receiveEventSpec',
  },
  {
    name: 'receive-event-shell',
    specPath: '../src/incoming-processing/receive-event/receive-event.spec',
    exportName: 'receiveEventShellSpec',
  },
  {
    name: 'validate-processing-core',
    specPath: '../src/incoming-processing/validate-processing/core/validate-processing.spec',
    exportName: 'validateProcessingSpec',
  },
  {
    name: 'validate-processing-shell',
    specPath: '../src/incoming-processing/validate-processing/validate-processing.spec',
    exportName: 'validateProcessingShellSpec',
  },
  {
    name: 'mediate-processing-core',
    specPath: '../src/incoming-processing/mediate-processing/core/mediate-processing.spec',
    exportName: 'mediateProcessingSpec',
  },
  {
    name: 'mediate-processing-shell',
    specPath: '../src/incoming-processing/mediate-processing/mediate-processing.spec',
    exportName: 'mediateProcessingShellSpec',
  },
  {
    name: 'fail-processing-core',
    specPath: '../src/incoming-processing/fail-processing/core/fail-processing.spec',
    exportName: 'failProcessingSpec',
  },
  {
    name: 'fail-processing-shell',
    specPath: '../src/incoming-processing/fail-processing/fail-processing.spec',
    exportName: 'failProcessingShellSpec',
  },
  // ── Dispatches ────────────────────────────────────────────────────────────────
  {
    name: 'create-dispatch-core',
    specPath: '../src/dispatches/create-dispatch/core/create-dispatch.spec',
    exportName: 'createDispatchSpec',
  },
  {
    name: 'create-dispatch-shell',
    specPath: '../src/dispatches/create-dispatch/create-dispatch.spec',
    exportName: 'createDispatchShellSpec',
  },
  {
    name: 'record-delivery-core',
    specPath: '../src/dispatches/record-delivery/core/record-delivery.spec',
    exportName: 'recordDeliverySpec',
  },
  {
    name: 'record-delivery-shell',
    specPath: '../src/dispatches/record-delivery/record-delivery.spec',
    exportName: 'recordDeliveryShellSpec',
  },
  // ── Polling ──────────────────────────────────────────────────────────────────
  {
    name: 'classify-validation-results',
    specPath: '../src/polling/poll-received/steps/classify-validation-results.spec',
    exportName: 'classifyValidationResultsSpec',
  },
  {
    name: 'mediate-all',
    specPath: '../src/polling/poll-validated/steps/mediate-all.spec',
    exportName: 'mediateAllSpec',
  },
  {
    name: 'classify-delivery-results',
    specPath: '../src/polling/poll-dispatches/steps/classify-delivery-results.spec',
    exportName: 'classifyDeliveryResultsSpec',
  },
  {
    name: 'poll-received',
    specPath: '../src/polling/poll-received/poll-received.spec',
    exportName: 'pollReceivedSpec',
  },
  {
    name: 'poll-validated',
    specPath: '../src/polling/poll-validated/poll-validated.spec',
    exportName: 'pollValidatedSpec',
  },
  {
    name: 'poll-dispatches',
    specPath: '../src/polling/poll-dispatches/poll-dispatches.spec',
    exportName: 'pollDispatchesSpec',
  },
]
