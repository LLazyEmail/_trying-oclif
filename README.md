# @llazyemail/cli

> Standalone oclif CLI for the LLazyEmail rendering engine.

Built with [oclif](https://oclif.io) v5 and strict TypeScript. Zero `any`, immutable config, native Node test runner.

This repository is a **working sandbox**. Commands run and write files. The renderer and the catalog are stubs. Sibling packages (`markdown-to-email`, `generate-template`, Postmark templates) are not imported yet.

**Agents: start at [AGENTS.md](AGENTS.md).**

| Doc | What it is |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Task router, invariants, how to add a command / template / engine |
| [docs/architecture.md](docs/architecture.md) | Layers, the two pipelines, error model |
| [docs/roadmap.md](docs/roadmap.md) | Next ten PRs |
| [docs/commands.md](docs/commands.md) | Command reference |
| [docs/catalog.md](docs/catalog.md) | Built-in + project catalog |
| [docs/engines.md](docs/engines.md) | Renderer registry |
| [docs/adr/0001-sandbox-boundaries.md](docs/adr/0001-sandbox-boundaries.md) | Why nothing is imported yet |

Requires **Node.js 22+**.

## Install

```bash
git clone https://github.com/LLazyEmail/_trying-oclif.git
cd _trying-oclif
npm install
npm run build
npm test
npm run dev -- --help
```

## Quick start

```bash
llazy init
llazy parse
llazy parse --watch
llazy config
llazy check folders

llazy templates list
llazy generate
llazy assert ./generated
```

## Commands

| Command | Description |
| --- | --- |
| `llazy init` | Scaffold `source/`, `generated/`, sample Markdown, `.llazyrc.json` |
| `llazy parse [FILE]` | Parse Markdown via the selected engine (default `stub`) |
| `llazy config` | Print resolved config and registered engines |
| `llazy check folders` | Validate required and recommended folders |
| `llazy templates list` | List the merged catalog |
| `llazy templates render <id>` | Render one catalog template |
| `llazy generate` | Render one (`--template`) or all catalog templates |
| `llazy assert [DIR]` | Assert HTML documents and the 102 KB size limit |
| `llazy hello [NAME]` | Smoke test |

Full flag and example list: [docs/commands.md](docs/commands.md).

## Config

Optional. First match wins: `.llazyrc.json`, then `llazy.config.json`.

```json
{
  "sourceDir": "./source",
  "outputDir": "./generated",
  "parseMode": "full",
  "format": "html",
  "verbose": false,
  "dryRun": false
}
```

Precedence: **defaults → config file → explicit flags**.

## Catalog

Optional. First match wins: `.llazy/catalog.json`, then `llazy.catalog.json`. Project entries override built-in ids. See [docs/catalog.md](docs/catalog.md).

## Development

```bash
npm run build
npm test
npm run lint
npm run format
npm run dev -- parse --dry-run
```

CI (`.github/workflows/ci.yml`) runs install, build, test, and `./bin/run.js --help`.

## License

MIT © LLazyEmail
