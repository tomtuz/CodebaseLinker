import { CodebaseStruct } from '@/types/codebaseStruct';

export const DEFAULT_CONFIG: CodebaseStruct = {
  options: {
    name: 'Default Codebase',
    baseUrl: '.',
    format: 'ts',
  },
  paths: [{ path: '.' }],
};
