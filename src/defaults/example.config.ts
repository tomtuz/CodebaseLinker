import { CodebaseStruct } from '@/types/codebaseStruct';

const config: CodebaseStruct = {
  options: {
    name: 'My Project',
    baseUrl: './src',
    selectionMode: 'exclude',
    patterns: [
      '**/node_modules/**',
      '**/test/**',
      '!**/src/**/*.test.ts', // This negative pattern re-includes .test.ts files in the src directory
    ],
    format: 'ts',
    output: 'codebase-context.md'
  }
};

const test_config: CodebaseStruct = {
  options: {
    name: 'Codebase',
    baseUrl: './example',
    selectionMode: 'include',
    patterns: [
      'evil_folder',
      'forms',
      'hooks',
      'types/react.ts',
    ],
    format: 'tsx',
    output: 'codebase-context.md'
  }
};
