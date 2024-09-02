

## path resolution
During dev, if running `tsx`, we use `tsconfig-paths` to resolve path aliases defined in tsconfig.json:
```sh
# example
tsx -r tsconfig-paths/register src/index.ts init
```

After build, this is not needed, as it uses files placed in 'dist' folder by postbuild.mjs script.

# TODO
- file watcher function
- entire workflow refactor
- strong defaults so that it would work without configuration
- linux support / testing
- '--pattern-match' command output is too big, for long outputs we should use '--logs' to save the output logs.
- consider also allowing to select only the parts you want for the output.

## Running
```
tsx src/index.ts -d -i C:\Users\tto\Desktop\tamper\linker
```


# Running preinstalled .tgz

```jsonc
//  remove 'bin' reference, which usually runs node
"bin": {
  "cotext": "./bin/cli.js"
},
// add script to install tar package
"scripts": {
  "prepare": "pnpm install ./bin/prebuilt/cotext-1.0.0.tgz",
}
```


# Running preinstalled .tgz

```jsonc
//  remove 'bin' reference, which usually runs node
"bin": {
  "cotext": "./bin/cli.js"
},
// add script to install tar package
"scripts": {
  "prepare": "pnpm install ./bin/prebuilt/cotext-1.0.0.tgz",
}
```

1. `resolveCliOptions`
- Takes CLI input and creates a ConfigIndex.
- Uses CLI_DEFAULTS as reference to check which options have been changed.
- Populates the ConfigIndex with changed values and sets corresponding flags.


I.e.:
```json
resolvedCliOptions:  {
  "booleans": {
    "0": 1,
    "1": 1,
    "2": 0
  },
  "strings": [
    ".cotext/test.config.ts",
    null,
    null,
    null,
    null,
    null
  ],
  "arrays": [
    null
  ],
  "changedFlags": {
    "0": 3,
    "1": 1,
    "2": 0
  }
}
```



2. `translateConfigIndex`
- Takes a ConfigIndex and converts it back into a CodebaseStructOptions object.
- Uses DEFAULT_CONFIG as a base and only overrides values that have been changed (as indicated by the changedFlags).
- This function essentially "decodes" the ConfigIndex back into a usable configuration object.
- Creates a config from DEFAULT_CONFIG by mapping 
- Resoles options using the map of config indexes

----


## 1. CLI Input
CLI -> `ProgramOptions`

## 2. `createConfig(ProgramOptions)`
1. use `DEFAULT_CONFIG.options`

2. map `ProgramOptions` onto `DEFAULT_CONFIG.options`
   - IF option exists in `CodebaseStructOptions` and differs from `CLI_DEFAULTS`
     - Update merged configuration

3. Create a Proxy object for the merged configuration
   - Direct access for existing properties
   - Fallback to `DEFAULT_CONFIG.options` for missing properties

## 3. Configuration Usage
- `processCodebase` function receives the Proxy object
- When accessing configuration values:
  1. Proxy 'get' function checks if value was set by CLI (in merged configuration)
  2. If not, fall back to `DEFAULT_CONFIG.options`

## Key Points
- Maintains separation between CLI options (`ProgramOptions`) and app configuration (`CodebaseStructOptions`)
- Allows for future expansion of `CodebaseStructOptions` without changing merging logic
- Provides a single, consistent interface for accessing configuration values
- Prioritizes CLI-provided values over default values
- Handles potential mismatches between `ProgramOptions` and `CodebaseStructOptions`

## Flow
CLI Input → ProgramOptions → createConfig → ConfigProxy → processCodebase


+-------------------+
|   LogWriter.ts    |
|-------------------|
| - LogWriter       |
|   - initializeLogFile |
|   - writeLog      |
| - createLogWriter |
+-------------------+
         |
         | Creates instance
         v
+-------------------+
| configOperations.ts |
|-------------------|
| - setBooleanOption |
| - getBooleanOption |
| - setStringOption  |
| - getStringOption  |
| - setArrayOption   |
| - getArrayOption   |
| - serializeOptions |
| - deserializeOptions |
+-------------------+
         |
         | Modifies and retrieves options
         v
+-------------------+
|  defaultConfig.ts  |
|-------------------|
| - DEFAULT_CONFIG   |
| - CLI_DEFAULTS     |
+-------------------+
         |
         | Provides default configurations
         v
+-------------------+
|  code_file.tsx     |
|-------------------|
| - TestForm         |
+-------------------+
