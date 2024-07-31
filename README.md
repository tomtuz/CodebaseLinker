This package is meant to be usable without installation to avoid collisions with the codebase.
It is excluded from git during initialization and placed in a `.cotext` folder.
Not tested on linux for now.

## Setup
```sh
# initialize configuration files
# - stored at '.cotext' dir (default)
# - excluded from git (in .git/info/exclude file)
# - has type files included
pnpm dlx cotext init

# run configuration files
pnpm dlx cotext -c <path-to-config>
```

**Config example:**
```ts
import { defineConfig } from './codebaseStruct';

export default defineConfig({
  options: {
    name: 'Codebase',
    baseUrl: '.',
    // two modes:
    // - include (start from no selections)
    // - exlucde (start from selecting all)
    selectionMode: 'exclude',
    // glob, .gitignore syntax
    patterns: [
      "README.md",
      ".gitignore",
      ".aidigestignore",
      "example",
      ".cotext",
      "vitest.config.ts",
      "tsup.config.ts",
      "biome.jsonc",
      "docs",
      ".vscode",
      "codebase*.md",
      "*.go"
    ],
    format: 'tsx',
    output: 'codebase-context.md'
  }
});
```

**Config result:**
- codebase-context.md with aggregated files in one place
