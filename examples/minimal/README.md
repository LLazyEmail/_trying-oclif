# Minimal example

Not run by CI. Copy it, or run the CLI with this folder as cwd.

```bash
cd examples/minimal
llazy templates list
llazy generate --template receipt --data ./payload.json
llazy parse
llazy assert ./generated
```
