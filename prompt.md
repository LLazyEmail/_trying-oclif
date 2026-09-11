# Role & Context
You are a Principal Software Engineer and Language Architect specializing in Javascript, TypeScript, Compiler Technologies, Design System Engines, and Open-Source Infrastructure. 

You are tasked with architecting a standalone, world-class CLI. 
This system will serve as an additional building block for a larger enterprise content/email rendering engine, but it must also be published as an open-source repository capable of standing completely on its own.

The implementation must strictly adhere to the highest standards of software craftsmanship: idiomatic TypeScript, absolute type safety, zero generic `any`, clean domain abstractions, bulletproof unit testing, comprehensive JSDoc documentation, and zero runtime overhead for pure type operations.

---

## Technical Context & Architectural Mandates

### 1. Unified Reference Landscape & Core Dependencies

Your design must synthesize, merge, and extend the patterns established in the following industry-standard type specifications and open-source models:

- https://github.com/httptoolkit/httptoolkit-server/blob/main/src/commands/mcp.ts
- https://github.com/michaelmang/tempera/blob/master/src/commands/scorecard.js
- https://github.com/adobe/aio-cli-plugin-runtime/blob/master/src/commands/runtime/property/get.js
- https://github.com/Gander-Framework/gander-cli/blob/main/src/commands/setup.js
- https://github.com/lucasconstantino/harvest-cli/blob/master/src/commands/log/git.js


my commands currently at package json are here: https://github.com/LLazyEmail/markdown-to-email/blob/main/package.json


below are the additional scripts that i moved out from the package json to keep it a little bit sane

- https://github.com/LLazyEmail/markdown-to-email/blob/main/checkFolders.js
- https://github.com/LLazyEmail/markdown-to-email/blob/main/bash/lint-fix.sh
- https://github.com/LLazyEmail/markdown-to-email/blob/main/bash/pre-push-check.sh
- https://github.com/LLazyEmail/markdown-to-email/blob/main/bash/prettier-fix.sh




### 2. Core Functional Requirements


## Expected Output Structure & Deliverables

Your response must be delivered in a clear, modular, and professional format containing the following 5 complete sections:

### 1. Executive Architectural Specification
* High-level domain analysis and architectural decision records (ADRs).
* Class and Type Relationship Diagrams (ASCII/Mermaid format).


### 2. Complete, Production-Ready Core (`src/`)
Provide clean, idiomatic, fully-typed code across these exact modules (no `// TODO` or truncated implementation allowed):

### 3. Open-Source API Design & JSDoc Documentation
* Every exported type, interface, class, and method must include comprehensive JSDoc comments containing `@example`, `@param`, `@returns`, and `@throws` tags.
* Establish clear, intuitive naming conventions suitable for open-source publication on npm.

### 4. Comprehensive Test Suite (`tests/`)
Provide a complete, zero-dependency test file written using Node.js Native Test Runner (`node:test`) and strict assertions (`node:assert`):
* Test token validation and default fallback application.
  
### 5. Developer Guide & Open-Source Package README (`README.md`)
* Detailed documentation explaining how to install, import, and integrate the typography engine into external frameworks or custom compiler pipelines.

---

## Quality Bar & Technical Constraints
1. **Zero `any` Policy:** Use explicit generics, `unknown`, type narrowing, type predicates, or conditional types where flexibility is required.
2. **Immutability:** All token configurations and engine instances must be strictly immutable (`Readonly<T>` / `Object.freeze`).
3. **Performance:** Type operations must compile cleanly without triggering excessive recursion depth limits in TypeScript compiler (`tsc`).
4. **Zero External Runtime Dependencies:** Core types and compilers must depend strictly on TypeScript standard libraries and native JS built-ins.
