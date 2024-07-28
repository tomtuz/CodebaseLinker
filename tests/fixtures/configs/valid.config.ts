import { defineConfig } from './codebaseStruct';

export default defineConfig({
  options: {
    name: 'Codebase',
    format: "tsx",
    baseUrl: '.',
    exclude: ["example"]
  },
  paths: [
    { path: './src', },
    { path: './tsconfig.json', },
    { path: './package.json', },
  ]
});
