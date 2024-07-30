import { defineConfig } from '@/defaults/codebaseStruct';

export default defineConfig({
  options: {
    name: 'Codebase',
    format: "tsx",
    baseUrl: '.',
    selectionMode: 'exclude',
    patterns: [
      './src',
      './tsconfig.json',
      './package.json',
      "example"
    ]
  },
});
