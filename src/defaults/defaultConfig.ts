import { CodebaseStruct } from '@/types/codebaseStruct';

export const DEFAULT_CONFIG: CodebaseStruct = {
  options: {
    name: 'Codebase',
    format: "tsx",
    selectionMode: 'include',
    baseUrl: '.',
    patterns: ['*']
  }
};
