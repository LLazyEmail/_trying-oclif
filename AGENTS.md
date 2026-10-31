# AGENTS.md

Task router for AI agents working in `@llazyemail/cli`.
Read this before touching code. Then read `docs/architecture.md` and `docs/roadmap.md`.

This repository is a **sandbox CLI**. It is usable end to end with a stub renderer and a stub catalog. It does **not** import `markdown-to-email`, `@llazyemail/generate-template`, or the Postmark packages yet. Do not add those imports unless the user explicitly asks.

## What this package is

An oclif v5 CLI (`llazy`) that will eventually drive the LLazyEmail rendering engine. Today it owns:

- project scaffold (`init`)
- config resolution (defaults → `.llazyrc.json` → flags)
- a Markdown parse pipeline (`parse`) that calls a registered `RendererEngine`
- a named template catalog (`templates`, `generate`, `assert`)
- folder checks

The public library entry is `src/index.ts`. Commands are discovered by oclif from `src/commands/`.

## Invariants (do not break)

1. **Zero `any`.** Use `unknown`, generics, type predicates, or discriminated unions.
2. **Immutability.** Configs and catalog entries are `Readonly<T>` / `Object.freeze`. Do not mutate a resolved `CliConfig`.
3. **`Result<T>` for expected failures.** Use `ok` / `err` from `src/types/result.ts`. Reserve `this.error()` for user-facing command exits.
4. **`exactOptionalPropertyTypes` is on.** Optional fields that can be *present and undefined* (oclif flags) must be typed `prop?: T | undefined`, not `prop?: T`.
5. **No sibling-package imports** until an explicit adapter PR. Add an interface and a stub instead.
6. **Small PRs.** Prefer ≤15 files. One concern per branch.
7. **Node ≥ 22.** Native `node:test` + `node:assert/strict`. No Jest, no Vitest.
8. **ESM.** `"type": "module"`. Imports end in `.js`.

## Commands an agent should run

```bash
npm install --ignore-scripts   # prepare runs tsc; CI does this too
npm run build
npm test
node ./bin/run.js --help
node ./bin/run.js hello
```

`npm run dev -- <args>` runs the CLI through tsx without a build.

## Where things live

| Path | Owns |
| --- | --- |
| `src/commands/` | oclif commands. One file (or folder) per command. |
| `src/commands/base.ts` | `BaseCommand` + `resolveConfig()` |
| `src/types/config.ts` | `CliConfig`, defaults, `mergeConfig` |
| `src/types/result.ts` | `Result<T>` |
| `src/utils/config-file.ts` | `.llazyrc.json` / `llazy.config.json` loader |
| `src/utils/fs.ts` | Result-based read / write / ensureDir |
| `src/engine/` | `RendererEngine` + registry + stub |
| `src/parse/run-parse.ts` | single parse pass, used by `parse` and `--watch` |
| `src/catalog/` | built-in catalog, project catalog, lookup, render |
| `src/utils/email-meta.ts` | `#!` subject and `#~` preview extraction |
| `src/utils/assert-html.ts` | doctype + 102 KB Gmail size check |
| `test/` | mirrors `src/` |

## How to add a command

1. Create `src/commands/<name>.ts` (or `src/commands/<topic>/<name>.ts`).
2. Default-export a class extending `Command` or `BaseCommand`.
3. Set `static description`, `examples`, `flags`, `args`.
4. Add a topic entry in `package.json` → `oclif.topics` if it is a new topic.
5. Add a `test/commands/<name>.test.ts` using `node:test`.
6. Update `docs/commands.md` and the README command table.

## How to add a built-in template

1. Append an entry to `BUILTIN_CATALOG` in `src/catalog/builtin.ts`.
2. Id is CamelCase (`SomethingEmail`). Alias is kebab (`something`).
3. Provide `kind`, `description`, `fileName`, `samplePayload`.
4. Cover it in `test/catalog/lookup.test.ts`.

Project templates do not require a code change. Users drop `.llazy/catalog.json` or `llazy.catalog.json`.

## How to add a real engine (later)

1. Implement `RendererEngine` from `src/engine/types.ts`.
2. Call `registerEngine(engine)` at startup (today the stub self-registers).
3. Select it with `llazy parse --engine <name>`.
4. Do not import the engine package from the CLI until that package has a stable, documented entry. Prefer a thin adapter file under `src/engine/adapters/`.

## Config precedence

```
defaults  →  .llazyrc.json / llazy.config.json  →  explicit CLI flags
```

`mergeConfig` only applies overlay keys that are not `undefined`. That is intentional: oclif often passes `undefined` for omitted flags, and those must not clobber a config file.

## Catalog precedence

```
project catalog  overrides  built-in catalog   (by shared id or alias)
```

Missing catalog file is not an error. Invalid JSON or a bad entry is an error.

## What is stubbed

- `StubRenderer` writes a placeholder HTML / React / JSON document. It is not markdown-to-email.
- `renderCatalogEntry` writes a placeholder XHTML document from the payload. It is not Postmark or generate-template.
- `lint` / `format` topics are declared in `package.json` but have no command files.

## Do not

- Do not add `any`.
- Do not commit `dist/` or `oclif.manifest.json`.
- Do not switch the test runner.
- Do not pin sibling packages as dependencies in a drive-by PR.
- Do not rewrite `BaseCommand.resolveConfig()` without a test for the three-layer merge.
