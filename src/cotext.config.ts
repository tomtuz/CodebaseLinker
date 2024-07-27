import type { CodebaseStruct } from "./codebaseStruct";

// Used for testing context on the package itself
const codebaseStruct: CodebaseStruct = {
  options: {
    name: 'Codebase',
    format: "ts",
  },
  paths: [
    { path: './src', },
    { path: './tsconfig.json', },
    { path: './package.json', },
  ]
}
export default codebaseStruct;
