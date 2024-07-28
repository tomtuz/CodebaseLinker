

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
