# ADR 0001 — Sandbox boundaries

## Status

Accepted.

## Context

This CLI will eventually drive markdown-to-email and the generate-template catalog. Those packages move on their own timeline. Importing them now would couple a sandbox to unstable entry points and force a GitHub Packages token in CI.

## Decision

1. The CLI stands alone. Runtime dependencies are `@oclif/core` and its plugins only.
2. Domain shapes (engine, catalog entry, config, Result) are owned here.
3. Sibling packages are **patterns**, not dependencies, until an adapter PR says otherwise.
4. Stubs must produce real files so commands are testable and demoable.

## Consequences

- Agents must not add `@llazyemail/*` to `package.json` in a drive-by change.
- A future adapter PR is allowed to add one optional dependency and one file under `src/engine/adapters/`.
- Documentation has to say "stub" out loud so nobody treats placeholder HTML as the product.
