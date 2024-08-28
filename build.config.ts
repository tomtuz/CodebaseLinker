import { defineBuildConfig } from "unbuild";
import { cpSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from "node:url";

export default defineBuildConfig([
  {
    name: "ESM only",
    outDir: "dist",
    entries: [
      'src/index.ts',
    ],
    clean: true,
    sourcemap: true,
    declaration: true,
    failOnWarn: false,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@defaults': fileURLToPath(new URL('./src/defaults', import.meta.url)),
    },
    rollup: {
      inlineDependencies: true,
      dts: {
        compilerOptions: {
          emitDeclarationOnly: true,
        },
      },
      esbuild: {
        minify: true,
      },
    },
    hooks: {
      'build:done': () => {
        cpSync(
          // copy config with typings
          join(__dirname, 'src/defaults/build'),
          join(__dirname, 'dist/defaults'),
          {
            recursive: true,
          },
        )
      },
    },
  },
]);
