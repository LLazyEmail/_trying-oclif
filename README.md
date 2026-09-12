# @llazyemail/cli

> World-class, type-safe CLI for the LLazyEmail content & email rendering engine.

Built with [oclif](https://oclif.io) and strict TypeScript. Zero `any`, immutable configuration, native Node.js test runner, and clean domain abstractions.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@llazyemail/cli.svg)](https://npmjs.org/package/@llazyemail/cli)
[![License](https://img.shields.io/npm/l/@llazyemail/cli.svg)](https://github.com/LLazyEmail/_trying-oclif/blob/main/LICENSE)

---

## Installation

```bash
npm install -g @llazyemail/cli
# or use directly
npx @llazyemail/cli --help
```

Requires **Node.js 22+**.

## Quick start

```bash
llazy init
llazy parse
llazy parse --dry-run --verbose
llazy parse --format json
llazy parse --watch
llazy config
llazy check folders
```

## Commands

| Command | Description |
|---------|-------------|
| `llazy init` | Scaffold `source/`, `generated/`, sample Markdown, and `.llazyrc.json` |
| `llazy parse [FILE]` | Parse Markdown into email-ready HTML, React, or JSON |
| `llazy config` | Print the resolved config (defaults + file + flags) |
| `llazy check folders` | Validate required & recommended project folders |
| `llazy hello [NAME]` | Smoke-test command |
| `llazy help [COMMAND]` | Display help |

### Config file

Optional. First match wins:

- `.llazyrc.json`
- `llazy.config.json`

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

Precedence: **defaults → config file → explicit CLI flags**.

### Shared flags

| Flag | Short | Description |
|------|-------|-------------|
| `--source` | `-s` | Source directory |
| `--output` | `-o` | Output directory |
| `--mode` | `-m` | `full` \| `reactFull` \| `recipesFull` \| `hackernoonFront` |
| `--format` | `-f` | `html` \| `react` \| `json` |
| `--verbose` | `-v` | Verbose logging |
| `--dry-run` | | Log actions without writing files |

`parse` also accepts `--engine <name>` (default `stub`) and `--watch`.

The current renderer is a **stub**. It writes a real file so the CLI is usable, but it does not run markdown-to-email yet. A future adapter registers itself with `registerEngine()` and can be selected with `--engine`.

## Development

```bash
git clone https://github.com/LLazyEmail/_trying-oclif.git
cd _trying-oclif
npm install
npm run build
npm test

npm run dev -- init
npm run dev -- parse --dry-run
npm run dev -- config
```

## License

MIT © LLazyEmail
