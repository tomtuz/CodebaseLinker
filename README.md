This package is meant to be usable without installation to avoid collisions with the codebase.
It is excluded from git during initialization and placed in a `.cotext` folder.

You can use this in:
- CLI mode: easy, quick file aggregation
- Application mode: repeated, custom behaviour with configuration file `cotext.config.ts`

## Run
```sh
# sane defaults, scan top-level files
cotext

# show [Verbose] [Debug] info, supply [Input] directory path
cotext -v -d -i /home/username/my_folder

# use without installation (only 'npx' for now, 'dlx' breaks) 
npx github:tomtuz/CodebaseLinker -v -d -i /home/username/my_folder

# initialize configuration files (for 'Application Mode')
# - stored at '.cotext' dir (default)
# - excluded from git (in .git/info/exclude file)
# - has type files included
cotext init

# run configuration files
cotext -c <path-to-config>
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
