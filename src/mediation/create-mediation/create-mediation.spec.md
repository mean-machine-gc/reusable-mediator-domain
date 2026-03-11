# create-mediation-shell

> **Operation Specification**

---

## 4. Pipeline

<!-- BEGIN:GENERATED:PIPELINE -->
| # | Name | Type | Failure Codes |
| --- | --- | --- | --- |
| 1 | `parseTopic` | `STEP` | `not_a_string`, `empty`, `too_short_min_2`, `too_long_max_256`, `invalid_format_dot_separated_segments`, `invalid_chars_alphanumeric_hyphens_and_dots_only`, `script_injection` |
| 2 | `parseDestination` | `STEP` | `not_a_string`, `empty`, `too_long_max_2048`, `invalid_format_url`, `script_injection` |
| 3 | `parsePipeline` | `STEP` | `not_an_array`, `empty`, `invalid_step` |
| 4 | `assembleDraftMediation` | `STEP` | — |
| 5 | `generateId` | `DEP` | `generate_id_failed` |
| 6 | `generateTimestamp` | `DEP` | `generate_timestamp_failed` |
| 7 | `saveMediation` | `DEP` | `save_failed` |
<!-- END:GENERATED:PIPELINE -->

---

## 5. Decision Tables

<!-- BEGIN:GENERATED:DECISION -->
| Scenario | `parseTopic` :not_a_string | `parseTopic` :empty | `parseTopic` :too_short_min_2 | `parseTopic` :too_long_max_256 | `parseTopic` :invalid_format_dot_separated_segments | `parseTopic` :invalid_chars_alphanumeric_hyphens_and_dots_only | `parseTopic` :script_injection | `parseDestination` :not_a_string | `parseDestination` :empty | `parseDestination` :too_long_max_2048 | `parseDestination` :invalid_format_url | `parseDestination` :script_injection | `parsePipeline` :not_an_array | `parsePipeline` :empty | `parsePipeline` :invalid_step | `generateId` :generate_id_failed | `generateTimestamp` :generate_timestamp_failed | `saveMediation` :save_failed | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| ✅ mediation-created | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | mediation-created |
| ❌ not_a_string | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ empty | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ too_short_min_2 | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `too_short_min_2` |
| ❌ too_long_max_256 | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `too_long_max_256` |
| ❌ invalid_format_dot_separated_segments | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `invalid_format_dot_separated_segments` |
| ❌ invalid_chars_alphanumeric_hyphens_and_dots_only | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `invalid_chars_alphanumeric_hyphens_and_dots_only` |
| ❌ script_injection | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | Fails: `script_injection` |
| ❌ not_a_string | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ empty | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ too_long_max_2048 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | Fails: `too_long_max_2048` |
| ❌ invalid_format_url | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | Fails: `invalid_format_url` |
| ❌ script_injection | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | Fails: `script_injection` |
| ❌ not_an_array | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `not_an_array` |
| ❌ empty | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `empty` |
| ❌ invalid_step | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `invalid_step` |
| ❌ generate_id_failed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `generate_id_failed` |
| ❌ generate_timestamp_failed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `generate_timestamp_failed` |
| ❌ save_failed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `save_failed` |
<!-- END:GENERATED:DECISION -->
