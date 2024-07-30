import { DEFAULT_EXCLUSIONS } from '@/utils/defaultPatterns';
import { CodebaseStructOptions } from '../types/codebaseStruct';
import { logger } from '../utils/logger';
import fastGlob from 'fast-glob';
import path from 'node:path';
import { minimatch } from 'minimatch';
import { SelectionModeError, PatternError, FileResolutionError } from '@/errors/GlobErrors';

function logPatternMatch(file: string, pattern: string, matched: boolean) {
  logger.debug(`File: ${file}`);
  logger.debug(`  Pattern: ${pattern}`);
  logger.debug(`  Matched: ${matched}`);
  logger.debug('');
}

export async function resolveGlobalPatterns(options: CodebaseStructOptions, enablePatternMatch: boolean): Promise<string[]> {
  logger.debug('Starting global pattern resolution');

  // ... (keep existing validation logic)

  const cwd = options.baseUrl ? path.resolve(process.cwd(), options.baseUrl) : process.cwd();
  logger.debug(`Working directory for glob: ${cwd}`);

  const globOptions = {
    cwd,
    dot: true,
    onlyFiles: true,
    absolute: true,
    ignore: options.selectionMode === 'include' ? [] : DEFAULT_EXCLUSIONS
  };

  try {
    const allFiles = await fastGlob('**/*', globOptions);
    const selectedFiles = allFiles.filter(file => {
      const relativePath = path.relative(cwd, file);
      const userDefinedPatterns = options.patterns.filter(pattern => pattern.startsWith('!'));
      const matched = options.selectionMode === 'include'
        ? options.patterns.some(pattern => minimatch(relativePath, pattern, { dot: true }))
        : !userDefinedPatterns.some(pattern => minimatch(relativePath, pattern.slice(1), { dot: true }));

      if (enablePatternMatch) {
        logPatternMatch(relativePath, options.patterns.join(', '), matched);
      }

      return matched;
    });

    if (selectedFiles.length === 0) {
      throw new FileResolutionError('No files matched the resolved patterns');
    }

    if (options.selectionMode === 'exclude') {
      const userDefinedPatterns = options.patterns.filter(pattern => pattern.startsWith('!'));
      // biome-ignore lint/complexity/noForEach: <explanation>
      userDefinedPatterns.forEach(pattern => {
        const matchingFiles = selectedFiles.filter(file => {
          const relativePath = path.relative(cwd, file);
          return minimatch(relativePath, pattern.slice(1), { dot: true });
        });

        if (matchingFiles.length === 0) {
          logger.warn(`All files were excluded for pattern: ${pattern}`);
        }
      });
    }

    return selectedFiles;
  } catch (error) {
    throw new FileResolutionError(`Error during file path resolution: ${error}`);
  }
}
