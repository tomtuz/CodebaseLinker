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
# OR
npm npx cotext init

# run configuration files
pnpm dlx cotext -c <path-to-config>
# OR
npm npx cotext -c <path-to-config>
```

**Config example:**
```ts
import { defineConfig } from './codebaseStruct';

export default defineConfig({
  options: {
    name: 'Example Codebase',
    format: "tsx", // base format highlighting for markdown codeblocks
    baseUrl: 'example', // base folder
    include: ["**/*.{ts,js,json}"], // glob matching (top level presedence)
    exclude: ["evil_folder/**"], // glob matching (top level presedence)
  },
  paths: [
    { path: 'forms/editor/react', }, // process 'react' folder
    {
      path: 'hooks',
      include: [ // explicitly select only defined files
        'useRedrawCountFull.tsx',
        'useRedrawCount.tsx'
      ],
    },
    { 
      path: 'src/types',
      exclude: ['index.ts'], // explicitly eclude 'index.ts', but select everything else
      format: "ts", // use 'ts' highlighting for markdown codeblock
      output: 'cr_codebase_type.md', // explicitly set output file for this path
      explicit: true // defines explicit path processing, distinct from global aggregation to a single file.
    }
  ]
});
```

**Config result:**
- example\cotext_output.md
- example\cr_codebase_type.md
```sh
# File 1:
- example\cotext_output.md

## File 1 contents:
- "example/hooks/useRedrawCountFull.tsx",
- "example/hooks/useRedrawCount.tsx",
- "example/hooks/useFormData.ts",
- "example/hooks/useFormSave.ts",
- "example/hooks/useLocalStorage.ts"

# File 2:
- example\cr_codebase_type.md

# File 2 Contents:
- "example/types/react.ts"
```
