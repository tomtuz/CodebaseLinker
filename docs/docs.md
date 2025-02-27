
### TODO
- file watcher function
- strong defaults so that it would work without configuration
- '--pattern-match' command output is too big, for long outputs we should use '--logs' to save the output logs.

### Configuring prebuilt .tgz tarball

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

### Flow
CLI Input → ProgramOptions → createConfig → ConfigProxy → processCodebase

### **Scripts**:
```jsonc
// Dev
"dev" // run the project (with debug, info options)
"dist" // run the package from ./dist folder (with debug, info options)
"dev:config" // create configuration file locally

// Build
"build" // build project
"build:run" // building and testing immediatelly

// Binaries
"bin:build" // for building Rust / Go file-crawler binaries
"bin:run" // run the binary file handler

// Lifecycle scripts
"prepare" // auto-run before pack or publish
"prepublishOnly" // auto-run before publish 

// dev scripts
"pack" // pack without publishing for testing

// Debugging
"debug:dist"
"debug:dist:external"
"debug:dev"
"debug:dev:external"

// Vitest testing
"test" // run Vitest testing
"test:ui" // run Vitest in UI mode
"test:run" // run Vitest without 'watch' mode
```


### **Lifecycle hooks used**:
- **`prepublishOnly`**: before `publish`
- **`prepare`**: before `pack`, `publish`, and after installing from a git 

### **Testing: different package managers (linux only)**:
You can switch between different package managers to test their installation workflows.
This includes installation commands like 'npx' (from npm) and 'dlx' (from pnpm)

This functionality is handled in `./debug` folder, which contains `.sh` scripts and default `package.json` files

Switching package managers with a helper script:
WARNING: your current package.json will overwritten. This is usually fine if you are not making decisive changes.
```sh
# change to NPM
./debug/use-NPM.sh

# change to PNPM
./debug/use-PNPM.sh
```
