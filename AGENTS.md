
<!-- BEGIN building-reference planning -->
## Building reference planning and upkeep

Before behavior, public-contract, dependency, connected-part or unfamiliar-code planning, read affected sections of `docs/building-reference/index.html` and verify current inputs/actual sources and accepted decisions with the read-only `node tools/building-reference/cli.mjs check`. Do not install/regenerate merely to read. Reuse unchanged verified context; skip known cosmetic/mechanical changes. Missing/stale/partial coverage requires direct-source checks and explicit uncertainty. The map is orientation, not runtime/API/application-test/release/status evidence.

After relevant authorized source changes, run `node tools/building-reference/cli.mjs generate` and `node tools/building-reference/cli.mjs check`; run `node --test tools/building-reference/test/*.test.mjs` for tool/mapping changes. Read `tools/building-reference/README.md` for exact scope, native parser setup, lifecycle triggers, stale recovery and versioned upgrades. New shapes/inventory need deliberate reviewed mapping updates; never auto-approve candidates. Preserve native clean-candidate CI gates before reference dependency/output generation and other owner's work. No daemon, GraphQL choice, automatic PR or task-status write is implied.
<!-- END building-reference planning -->
