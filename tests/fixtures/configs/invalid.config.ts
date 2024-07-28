// import { defineConfig } from './codebaseStruct';

export default {
  options: {
    name: 'Codebase',
    format: "tsx",
    baseUrl: '.',
    exclude: ["example"],
    custom_tag: true,
  },
  paths: [
    { path: './src', },
    { path: './tsconfig.json', },
    { path: './package.json', },
  ]
};
