# Roadmap — next ten PRs

The CLI works as a sandbox. These ten PRs make it something an agent can extend without rediscovering the shape, and something a human can run against a real project folder.

Merge in order. Each is ≤15 files. None imports a sibling package.

## 1. Docs (this PR)

`AGENTS.md`, architecture, this roadmap, command reference, catalog notes, one ADR.

**Done when** a new agent can answer: where do I add a command, a template, an engine?

## 2. `generated/index.html` preview

After `llazy generate --all`, write `generated/index.html` that links every HTML file. Same idea as the generate-template sandbox.

**Done when** `llazy generate && open generated/index.html` lists every catalog entry.

## 3. `init` writes a sample catalog

`llazy init` also writes `.llazy/catalog.json` with one example project template (and does not overwrite unless `--force`).

**Done when** a fresh `llazy init && llazy templates list` shows the example plus the built-ins.

## 4. Lockfile + `npm ci`

Commit `package-lock.json`. Switch CI from `npm install --ignore-scripts` to `npm ci --ignore-scripts`.

**Done when** CI is reproducible and still green.

## 5. Wire `#!` / `#~` into parse

`runParseOnce` calls `extractEmailMeta` and passes subject / preview into the render request. The stub prints them. No new dependency.

**Done when** a source with `#! Hello` produces HTML whose title is `Hello`.

## 6. `llazy doctor`

One command that runs folder check, prints resolved config, lists engines, and asserts `generated/` if it has HTML. Exit non-zero on hard failures.

**Done when** `llazy doctor` is the single "is this project ok?" command.

## 7. Command tests for generate / templates / assert

Native tests that call the domain functions (not the oclif class) for: list, resolve, render with `--data` payload, assert pass, assert fail on missing doctype, size warning.

**Done when** those paths cannot regress silently.

## 8. Public catalog exports

Export catalog types, `listCatalog`, `resolveTemplate`, `loadMergedCatalog`, `renderCatalogEntry` from `src/index.ts` so another package can drive the CLI library without shelling out.

**Done when** `import { loadMergedCatalog } from '@llazyemail/cli'` typechecks.

## 9. Adapter boundary types

Add `src/engine/adapters/types.ts` describing the contract a markdown-to-email adapter and a generate-template adapter must satisfy. No imports. A short comment lists the real entry points those adapters will call later.

**Done when** the next engine PR has a file to implement against, not a blank slate.

## 10. Cookbook + fixture project

`docs/cookbook.md` with copy-paste flows (init → parse, catalog → generate → assert). `examples/minimal/` with a catalog file, a payload, and a source.md that CI does not need to run, but agents can copy.

**Done when** a new user can follow the cookbook without reading source.

---

## After the ten

Only then:

- optional peer dependency on `@llazyemail/generate-template`
- markdown-to-email adapter behind `--engine markdown`
- `lint` / `format` commands (topics are already reserved)
- publish to GitHub Packages
