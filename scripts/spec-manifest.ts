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
  // Example:
  // {
  //   name: 'subtract-quantity-shell',
  //   specPath: '../src/cart/subtract-quantity/subtract-quantity.spec',
  //   exportName: 'subtractQuantityShellSpec',
  // },
]
