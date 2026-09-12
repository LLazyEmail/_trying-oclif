/**
 * @llazyemail/cli
 *
 * Public entry point for the LLazyEmail CLI package.
 * Commands are discovered automatically by oclif from the `commands` directory.
 *
 * @packageDocumentation
 */

export {run} from '@oclif/core'

export type {CliConfig, OutputFormat, ParseMode} from './types/config.js'
export {DEFAULT_CONFIG, createConfig, mergeConfig, isParseMode, isOutputFormat} from './types/config.js'
export type {Result} from './types/result.js'
export {ok, err, isOk, isErr} from './types/result.js'
export type {RendererEngine, RenderRequest, RenderOutput} from './engine/types.js'
export {registerEngine, getEngine, listEngines} from './engine/registry.js'
export {runParseOnce} from './parse/run-parse.js'
