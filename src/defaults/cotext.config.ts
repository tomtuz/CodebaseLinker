import { defineConfig } from './codebaseStruct';

export default defineConfig({
  options: {
    name: 'Codebase',
    format: "tsx",
    selectionMode: 'include',
    baseUrl: '.',
    patterns: ['./']
  }
});
