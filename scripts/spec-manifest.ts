// scripts/spec-manifest.ts
//
// Add one entry per factory spec. The generate-specs script reads this manifest,
// imports each spec, and writes the .spec.md decision tables next to the spec file.
//
// Output path is derived from specPath: same directory, .spec.md extension.

export type ManifestEntry = {
  name:       string   // human-readable name for logging
  specPath:   string   // import path relative to this file (no extension)
  exportName: string   // named export from the spec module
}

export const specManifest: ManifestEntry[] = [
  {
    name: 'create-mediation-shell',
    specPath: '../src/mediation/create-mediation/create-mediation.spec',
    exportName: 'createMediationShellSpec',
  },
  {
    name: 'activate-mediation-core',
    specPath: '../src/mediation/activate-mediation/core/activate-mediation.spec',
    exportName: 'activateMediationCoreSpec',
  },
  {
    name: 'activate-mediation-shell',
    specPath: '../src/mediation/activate-mediation/activate-mediation.spec',
    exportName: 'activateMediationShellSpec',
  },
  {
    name: 'deactivate-mediation-core',
    specPath: '../src/mediation/deactivate-mediation/core/deactivate-mediation.spec',
    exportName: 'deactivateMediationCoreSpec',
  },
  {
    name: 'deactivate-mediation-shell',
    specPath: '../src/mediation/deactivate-mediation/deactivate-mediation.spec',
    exportName: 'deactivateMediationShellSpec',
  },
  {
    name: 'delete-mediation-core',
    specPath: '../src/mediation/delete-mediation/core/delete-mediation.spec',
    exportName: 'deleteMediationCoreSpec',
  },
  {
    name: 'delete-mediation-shell',
    specPath: '../src/mediation/delete-mediation/delete-mediation.spec',
    exportName: 'deleteMediationShellSpec',
  },
  {
    name: 'update-pipeline-core',
    specPath: '../src/mediation/update-pipeline/core/update-pipeline.spec',
    exportName: 'updatePipelineCoreSpec',
  },
  {
    name: 'update-pipeline-shell',
    specPath: '../src/mediation/update-pipeline/update-pipeline.spec',
    exportName: 'updatePipelineShellSpec',
  },
]
