import { defineBuildConfig } from "unbuild";
import { copyFile, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

export default defineBuildConfig([
  {
    entries: ["./src/index"],
    outDir: "dist",
    clean: true,
    failOnWarn: false,
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@defaults": fileURLToPath(new URL("./src/defaults", import.meta.url)),
    },
    rollup: {
      inlineDependencies: true,
      emitCJS: false,
    },
    hooks: {
      "build:done": () => {
        cpSync(
          // copy config with typings
          join(__dirname, "src/defaults/build"),
          join(__dirname, "dist/defaults"),
          {
            recursive: true,
          },
        );
        copyFile("./bin/cli.js", "./dist/cli.js", (err) => {
          if (err) throw err;
          console.log("cli.js copied to dist/");
        });
      },
    },
    externals: ["esbuild", "rollup"],
  },
]);
