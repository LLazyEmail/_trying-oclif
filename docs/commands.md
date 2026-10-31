# Command reference

All commands are `llazy <command>`. Shared flags live on `BaseCommand` and apply where that base is used.

## Shared flags

| Flag | Short | Values | Notes |
| --- | --- | --- | --- |
| `--source` | `-s` | path | Overrides `sourceDir` |
| `--output` | `-o` | path | Overrides `outputDir` |
| `--mode` | `-m` | `full` \| `reactFull` \| `recipesFull` \| `hackernoonFront` | Invalid values warn and fall back |
| `--format` | `-f` | `html` \| `react` \| `json` | |
| `--verbose` | `-v` | boolean | |
| `--dry-run` | | boolean | Log, do not write |

Precedence: defaults → config file → these flags.

## `llazy init`

Creates `source/`, `generated/`, `source/source.md`, and `.llazyrc.json`.

```bash
llazy init
llazy init --force
```

`--force` overwrites sample files. Existing files are skipped otherwise.

## `llazy parse [FILE]`

Reads Markdown (default `source/source.md`), renders through the selected engine, writes `generated/newEmail.<ext>`.

```bash
llazy parse
llazy parse ./source/source.md --dry-run --verbose
llazy parse --engine stub --format html
llazy parse --watch
```

`--watch` re-runs on save (debounced `fs.watch`). `--engine` defaults to `stub`.

## `llazy config`

Prints the resolved frozen config and the registered engines.

```bash
llazy config
llazy config --format json
```

## `llazy check folders`

Requires `source/` and `generated/`. Warns on recommended folders. `--strict` turns warnings into failures.

```bash
llazy check folders
llazy check folders --strict
```

## `llazy templates list`

Prints the merged catalog (project overrides + built-ins). If a catalog file exists, its path is printed first.

```bash
llazy templates list
```

## `llazy templates render <id>`

Renders one template. `<id>` is a CamelCase id or a kebab alias.

```bash
llazy templates render WelcomeEmail
llazy templates render password-reset --out ./generated
llazy templates render welcome --data ./payload.json
```

## `llazy generate`

`--template` writes one. Omitting it writes all (same as `--all`).

```bash
llazy generate
llazy generate --all --out ./generated
llazy generate --template lead --data ./payload.json
```

`--data` without `--template` is an error.

## `llazy assert [DIR]`

Default dir is `./generated`. A file counts if it contains `<html` or `<!doctype`. Files over `--size-limit-kb` (default 102) are warnings. Missing doctype is a failure.

```bash
llazy assert
llazy assert ./generated --size-limit-kb 80
```

## `llazy hello [NAME]`

Smoke test. Not part of the product surface.

## Reserved, not implemented

`lint` and `format` are topics in `package.json`. There are no command files yet.
