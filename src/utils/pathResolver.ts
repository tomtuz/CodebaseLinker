import path from 'node:path';

export function resolvePath(basePath: string, relativePath: string): string {
  return path.resolve(basePath, relativePath);
}
