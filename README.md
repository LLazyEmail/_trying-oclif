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

## Quick start

```bash
# Smoke test
llazy hello
llazy hello Alice --force

# Validate project folders (replaces the old checkFolders.js)
llazy check folders
llazy check folders --root ./my-project --strict

# Parse Markdown → email HTML (skeleton – engine integration coming)
llazy parse
llazy parse ./source/source.md --mode reactFull --format react
llazy parse --dry-run --verbose
```

## Commands

| Command | Description |
|---------|-------------|
| `llazy hello [NAME]` | Say hello (example / smoke-test) |
| `llazy check folders` | Validate required & recommended project folders |
| `llazy parse [FILE]` | Parse Markdown into email-ready HTML or React trees |
| `llazy help [COMMAND]` | Display help |

### Shared flags (most commands)

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--source` | `-s` | `./source` | Source directory |
| `--output` | `-o` | `./generated` | Output directory |
| `--mode` | `-m` | `full` | Parse mode (`full` \| `reactFull` \| `recipesFull` \| `hackernoonFront`) |
| `--format` | `-f` | `html` | Output format (`html` \| `react` \| `json`) |
| `--verbose` | `-v` | `false` | Verbose logging |
| `--dry-run` | | `false` | Log actions without writing files |

Invalid `--mode` / `--format` values emit a warning and fall back to the defaults – the CLI never crashes on user input.

## Architecture highlights

- **Strict TypeScript** – `noImplicitAny`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, etc.
- **Immutable config** – `Readonly<CliConfig>` + `Object.freeze`; `createConfig()` always returns a new frozen object.
- **Result monad** – pure domain functions return `Result<T>` instead of throwing for expected failures.
- **BaseCommand** – shared flag set + validated config resolution for every domain command.
- **Zero external runtime deps for core types** – only `@oclif/core` and Node built-ins.
- **Native tests** – `node:test` + `node:assert/strict` (no Jest/Mocha required for the unit suite).

### Class / type relationship (simplified)

```
┌─────────────────┐
│   BaseCommand   │  (extends @oclif/core Command)
│  resolveConfig()│
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    │         │              │
 Hello   CheckFolders     Parse
    │         │              │
    └────┬────┴──────────────┘
         │
┌────────▼────────┐
│   CliConfig     │  (Readonly + frozen)
│  ParseMode      │
│  OutputFormat   │
│  Result<T>      │
└─────────────────┘
```

## Development

```bash
git clone https://github.com/LLazyEmail/_trying-oclif.git
cd _trying-oclif
npm install
npm run build
npm test

# Live development (ts-node / tsx)
npm run dev -- hello
npm run dev -- check folders
npm run dev -- parse --dry-run
```

### Adding a new command

1. Create `src/commands/<topic>/<name>.ts` (or `src/commands/<name>.ts`).
2. Extend `BaseCommand` and reuse `sharedFlags` when configuration is needed.
3. Export the class as `default`.
4. Add tests under `test/`.
5. Run `npm run build` – oclif discovers the command automatically.

## Relationship to the wider LLazyEmail ecosystem

This CLI is designed as a standalone open-source package while serving as the command-line surface for the larger content / email rendering engine (markdown-to-email, typography packages, layout generators, etc.). Future PRs will wire the real parsing & typography engines behind the `parse` command without changing the public CLI contract.

## License

MIT © LLazyEmail
