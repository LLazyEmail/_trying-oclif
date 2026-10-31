# Catalog

The catalog is how the CLI knows named templates. It is data, not code.

## Built-in entries

Defined in `src/catalog/builtin.ts`:

| Id | Aliases | Kind |
| --- | --- | --- |
| `WelcomeEmail` | `welcome` | transactional |
| `PasswordResetEmail` | `password-reset`, `reset` | transactional |
| `InvoiceEmail` | `invoice` | transactional |
| `LeadNurtureEmail` | `lead`, `lead-nurture` | lead |
| `NewsletterEmail` | `newsletter` | newsletter |

These exist so `generate` and `assert` work with zero setup. They are stubs.

## Project file

First match wins:

1. `.llazy/catalog.json`
2. `llazy.catalog.json`

Shape (wrapper or bare array):

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

`kind` must be `transactional`, `newsletter`, or `lead`. `ids` must be a non-empty string array. `samplePayload` must be an object.

A project entry that shares any id or alias with a built-in entry **replaces** that built-in entry. Other built-ins stay.

## Payloads

`--data ./payload.json` replaces `samplePayload` for that one render. The file must be a JSON object. It is only valid with a single template (`--template` on generate, or the render arg).

## Renderer

`renderCatalogEntry` in `src/catalog/render-entry.ts` emits an XHTML document with the payload as a table. Replace this function (or have a catalog entry point at a real renderer) when the generate-template adapter lands. Do not special-case template ids inside the renderer.
