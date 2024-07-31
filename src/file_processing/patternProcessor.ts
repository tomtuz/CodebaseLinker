import { minimatch } from 'minimatch';
import path from 'node:path';
import { logger } from '@/utils/logger';

export function processPatterns(patterns: string[], selectionMode: 'include' | 'exclude'): string[] {
  return patterns.map(pattern => {
    if (pattern.includes('*') || path.extname(pattern)) {
      return pattern;
    }
    return `${pattern}{,/**/*}`;
  });
}

export function filterFilesByPatterns(files: string[], patterns: string[], cwd: string, selectionMode: 'include' | 'exclude'): string[] {
  return files.filter(file => {
    const relativePath = path.relative(cwd, file);
    const matches = patterns.some(pattern => minimatch(relativePath, pattern, { dot: true }));
    return selectionMode === 'include' ? matches : !matches;
  });
}

export function logPatternWarnings(effectivePatterns: string[], selectedFiles: string[], selectionMode: 'include' | 'exclude', cwd: string): void {
  for (const pattern of effectivePatterns) {
    const matchingFiles = selectedFiles.filter(file => {
      const relativePath = path.relative(cwd, file);
      return minimatch(relativePath, pattern, { dot: true });
    });

    if (matchingFiles.length === 0) {
      if (selectionMode === 'include') {
        logger.warn(`No files were included for pattern: ${pattern}`);
      } else {
        logger.warn(`All files were excluded for pattern: ${pattern}`);
      }
    }
  }
}
