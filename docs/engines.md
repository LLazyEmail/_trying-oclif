# Engines

`parse` does not know how to turn Markdown into HTML. It asks the registry.

## Contract

```ts
interface RenderRequest {
  markdown: string
  inputPath: string
  config: Readonly<CliConfig>
}

interface RenderOutput {
  body: string
  extension: string
}

interface RendererEngine {
  readonly name: string
  render(request: RenderRequest): RenderOutput
}
```

Register with `registerEngine`. Look up with `getEngine(name)`, which returns `Result<RendererEngine>`.

## Stub

`src/engine/stub.ts` registers `stub` on import. It writes a document that includes the input path and a slice of the Markdown so the CLI produces a real file. That is the whole point of the stub: `parse` is not a no-op.

## Adapter boundary

`src/engine/adapters/types.ts` is the contract a future adapter implements. It imports nothing from sibling packages.

Reserved names (do not register a stub under these): `markdown`, `generate-template`.

| Adapter | Will call | CLI still owns |
| --- | --- | --- |
| markdown-to-email | the parse that is `dev:parseFull` today | reading the file, writing the output |
| generate-template | `createGenerator` + `run` / `writeAll` | the catalog file format, the write |

## Adding one later

```ts
import {registerEngine} from './registry.js'

registerEngine({
  name: 'markdown',
  render(request) {
    return {body: realHtml, extension: 'html'}
  },
})
```

Selection: `llazy parse --engine markdown`.

Keep the adapter in `src/engine/adapters/`. The adapter may import a sibling package. The rest of the CLI must not.
