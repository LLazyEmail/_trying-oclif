# Cookbook

Copy-paste flows. Every command below works against the stub renderer and the built-in catalog. No sibling package is required.

## New project

```bash
mkdir newsletter && cd newsletter
npx --yes ./path-to-cli   # or: node /path/to/_trying-oclif/bin/run.js
llazy init
llazy parse
llazy config
```

`init` creates `source/source.md` and `.llazyrc.json`. Open `generated/newEmail.html`.

## Watch while editing

```bash
llazy parse --watch
```

Save `source/source.md`. The stub rewrites `generated/newEmail.html`.

## Subject and preview

In `source/source.md`:

```markdown
#! This week in email
#~ Three things worth reading
# This week in email
```

`#!` is the subject. `#~` is the preview. See `src/utils/email-meta.ts`.

## Catalog: list, generate, assert

```bash
llazy templates list
llazy generate --out ./generated
llazy assert ./generated
```

`generate` without `--template` writes every catalog entry. `assert` fails if a file is missing `<html` or `<!doctype`, and warns over 102 KB.

## One template, custom payload

`payload.json`:

```json
{ "name": "Sam", "productName": "LLazyEmail", "actionUrl": "https://example.com" }
```

```bash
llazy generate --template welcome --data ./payload.json
llazy templates render password-reset --data ./payload.json --out ./generated
```

## Project catalog

`.llazy/catalog.json`:

```json
{
  "templates": [
    {
      "ids": ["ReceiptEmail"],
      "aliases": ["receipt"],
      "kind": "transactional",
      "description": "Receipt",
      "fileName": "receipt.html",
      "samplePayload": { "amount": "$10" }
    }
  ]
}
```

```bash
llazy templates list
llazy generate --template receipt
```

A project entry that reuses a built-in id replaces that built-in entry.

## Dry run

```bash
llazy parse --dry-run --verbose
```

Prints the path it would write. Does not write.

See `examples/minimal/` for a folder you can copy.
