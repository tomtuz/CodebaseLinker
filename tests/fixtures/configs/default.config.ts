import { defineConfig } from '@/defaults/codebaseStruct';

export const DEFAULT_CONFIG = defineConfig({
  options: {
    name: 'Default Codebase',
    baseUrl: '.',
    format: 'ts',
    selectionMode: 'include',
    patterns: ['.'],
  },
});
