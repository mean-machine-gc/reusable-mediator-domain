# create-mediation-shell

> Auto-generated from `create-mediation-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseTopic` | `STEP` | Parse and validate the topic | `not_a_string`, `empty`, `too_short_min_2`, `too_long_max_256`, `invalid_format_dot_separated_segments`, `invalid_chars_alphanumeric_hyphens_and_dots_only`, `script_injection` |
| 2 | `parseDestination` | `STEP` | Parse and validate the destination | `not_a_string`, `empty`, `too_long_max_2048`, `invalid_format_url`, `script_injection` |
| 3 | `parsePipeline` | `STEP` | Parse and validate the pipeline | `not_an_array`, `empty`, `invalid_step` |
| 4 | `generateId` | `DEP` | Generate a unique mediation ID | -- |
| 5 | `generateTimestamp` | `DEP` | Generate creation timestamp | -- |
| 6 | `assembleDraftMediation` | `STEP` | Assemble the draft mediation | -- |
| 7 | `saveMediation` | `DEP` | Persist the new mediation | -- |

---

## Decision Table

| Scenario | `parseTopic` :not_a_string | `parseTopic` :empty | `parseTopic` :too_short_min_2 | `parseTopic` :too_long_max_256 | `parseTopic` :invalid_format_dot_separated_segments | `parseTopic` :invalid_chars_alphanumeric_hyphens_and_dots_only | `parseTopic` :script_injection | `parseDestination` :not_a_string | `parseDestination` :empty | `parseDestination` :too_long_max_2048 | `parseDestination` :invalid_format_url | `parseDestination` :script_injection | `parsePipeline` :not_an_array | `parsePipeline` :empty | `parsePipeline` :invalid_step | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK mediation-created | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | mediation-created |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_short_min_2 | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `too_short_min_2` |
| FAIL too_long_max_256 | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `too_long_max_256` |
| FAIL invalid_format_dot_separated_segments | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_format_dot_separated_segments` |
| FAIL invalid_chars_alphanumeric_hyphens_and_dots_only | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_chars_alphanumeric_hyphens_and_dots_only` |
| FAIL script_injection | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `script_injection` |
| FAIL not_a_string | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_2048 | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `too_long_max_2048` |
| FAIL invalid_format_url | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `invalid_format_url` |
| FAIL script_injection | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `script_injection` |
| FAIL not_an_array | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `not_an_array` |
| FAIL empty | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `empty` |
| FAIL invalid_step | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `invalid_step` |
