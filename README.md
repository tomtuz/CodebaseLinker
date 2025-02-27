# Cotext 

This package is meant to be usable without installation to avoid collisions with the codebase.

Configuration (optional):
- should be excluded from git within `.cotext` folder.

Runtime modes:
- CLI mode: easy, quick file aggregation
- Application mode: for repeated, custom behaviour with configuration file `.cotext/cotext.config.ts`

## Run
```sh
# sane defaults, scan top-level files
cotext

# show [Verbose] [Debug] info, supply [Input] directory path
cotext -v -d -i /home/username/my_folder

# use without installation ('npx' / 'dlx') 
npx github:tomtuz/CodebaseLinker -v -d -i /home/username/my_folder

# initialize configuration files (for 'Application Mode')
# - stored at '.cotext' dir (default)
# - excluded from git (in .git/info/exclude file)
# - has type files included
cotext init

# run configuration files
cotext -c <path-to-config>
```

**Config (optional) example:**
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

**Default output:**
- codebase-context.md with aggregated files in one place

Dev instructions:
- [dev docs](./docs/dev.md)
