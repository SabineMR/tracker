# SabineMR/tracker building reference

Standard version: **1.0.0**. Repository-owned bounded source map; no GraphQL/API/server choice or product validation is implied.

## Commands

Install the existing locked native workspace dependencies with npm ci --ignore-scripts. No parser dependency is added.

From the repository root:

```text
node tools/building-reference/cli.mjs inspect
node tools/building-reference/cli.mjs generate
node tools/building-reference/cli.mjs check
node --test tools/building-reference/test/*.test.mjs
```

`check` is read-only and never installs dependencies or regenerates. Inspect affected sections of `docs/building-reference/index.html` and verify source identity before relevant planning. Approved requirements/decisions, actual code/contracts and relevant tests govern the plan. Skip established cosmetic/mechanical work and reuse unchanged verified context. Missing/stale/partial coverage calls for direct-source planning with explicit uncertainty.

## Reviewed coverage

Scopes: `src`.

Mapping records actual source inventory, declared public vocabulary and literal links reviewed during this local rollout. Exported member/type/parameter grammar is hashed or named; initializers/body values are never copied or executed. SQL/Prisma/platform/asset/DSL files carry inventory and byte identity only. Computed connections, effective Ruby visibility, inferred types, external package/engine behavior and runtime/data semantics are deliberately unsupported. New inventory/exports/fields/type grammar/literal links fail pending deliberate review. Native invalid syntax/missing sources fail closed. Planned work is not mapped because this rollout establishes no new accepted product requirements.

Generated/vendor/cache/test/fixture/secret/data files and all outside-scope trees remain excluded. Rootless source scopes absent at installation are explicitly listed in config; new files there trigger mapping review.

## Upkeep and failure

Wrapped development commands (including development start for Expo/CRA) and build commands preserve their reviewed original commands, arguments, ports and working directories. Production startup retains its original package script directly; refresh during development/build or run the explicit reference commands when needed. Supported dev commands own one serialized polling writer; it coalesces changes, retries pending changes and closes its owned child group on shutdown. Outside-process edits wait for the next generation/build/push. No daemon is installed.

Failed generation replaces the stable guide with visible STALE and preserves prior valid HTML behind a HISTORICAL label. Inspect candidate vocabulary with `inspect`, review the actual source diff, change mapping only for accepted source changes, then generate/check. Do not automatically pipe inspection into mapping. Output tampering, source/Git races and contending writers are rejected. A stale `.writer-lock` requires inspecting its `owner.json` PID and proving that owner stopped before explicitly removing only that abandoned lock. Independent supported dev launchers share one reference updater while each keeps its own native app lifecycle. A remaining launcher takes over upkeep when the owner exits. Watch ownership records bind PID/process birth/token/inode; stopped recorded watch owners recover under a serialized lease. Live owners are preserved. Unknown owner records or abandoned recovery directories require inspection before explicit recovery; never delete a live owner or stop another launcher. Repeat generation ignores outputs and does not rewrite identical bytes.

Native app CI keeps its original checks in a separate checkout. `BUILDING_REFERENCE_NATIVE_PHASE=1` suppresses only reference upkeep in that native pipeline, preventing generated reference files from affecting native clean-candidate checks; all original app gates still run. The dedicated reference workflow independently tests, generates and checks a source bundle in its own checkout. Its success does not establish native-suite success or application readiness. Local builds run the original native command first and then refresh the reference; nested workspace scripts reuse one outer owner.

## Provenance and GitHub

Input identity binds raw scoped source bytes (including dirty/untracked inputs), mapping, tool/templates/tests/configuration and relevant native lock files. Output hashes are independently derived by `check`; ready is bounded to that snapshot. Full checkout SHA alone is insufficient. Unrelated checkout files are not source coverage. Local/PR/non-default output is a candidate. Default-branch artifacts require a separately activated actual successful matching workflow. The new read-only workflow uses `main`, PR and manual triggers, nonpersistent checkout credentials and success-only upload. No PR/task/provider write occurs. App-suite/build/native/provider results are separate from reference checks.

## Controlled upgrades and rollback

`manifest.json` records the standard version and owned tool hashes. Future tooling upgrades require an explicitly scoped review, comparison with those owned bytes, fresh reference tests and relevant native checks; there is no cross-repository background updater. Preserve user-edited mapping and other owner's changes. Roll back this feature branch's exact approved tool/guide/workflow/instruction/script additions after reviewing its diff; do not reset a dirty root or replace app source/vendor/locks.

Source/parser reads are reconciled against identity captured before and after parsing and again before/after publication; an AST from old bytes cannot be attributed to new bytes. Failed HTML shows candidate identity and links separately retained historical map/provenance/state files.

Native literal keys retain their identity; computed keys retain a full hash without exposing expression values. TypeScript constraint grammar uses conservative raw native-node hashing, preserving whitespace/comment-like text inside literals without copying those values. Formatting-only constraint edits may therefore require deliberate mapping review. Babel records native key identity and method/getter/static/shorthand flags; no runtime inference is made.
