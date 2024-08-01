import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }

  // biome-ignore lint/complexity/noForEach: <explanation>
  fs.readdirSync(from).forEach((element) => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// Copy the defaults folder
const srcDefaultsPath = path.join(__dirname, "..", "defaults");
const distDefaultsPath = path.join(__dirname, "..", "..", "dist", "defaults");
copyFolderSync(srcDefaultsPath, distDefaultsPath);

// Copy codebaseStruct.d.ts
const srcTypesPath = path.join(__dirname, "../defaults", "codebaseStruct.ts");
const distTypesPath = path.join(
  __dirname,
  "..",
  "..",
  "dist",
  "codebaseStruct.ts",
);
fs.copyFileSync(srcTypesPath, distTypesPath);

console.log("Post-build tasks completed.");
