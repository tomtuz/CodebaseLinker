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

  // 2.1 Determine Selection Mode
  logger.debug('2.1 Determine Selection Mode');
  const { selectionMode, patterns, baseUrl } = options;

  if (!selectionMode) {
    throw new SelectionModeError('E2.1a: Selection mode is not provided in the configuration');
  }

  if (selectionMode !== 'include' && selectionMode !== 'exclude') {
    throw new SelectionModeError('E2.1b: Invalid selection mode specified. Must be either "include" or "exclude"');
  }

  logger.debug(`Selection mode: ${selectionMode}`);

  // 2.2 Process Patterns
  logger.debug('2.2 Process Patterns');
  if (!patterns || patterns.length === 0) {
    throw new PatternError('E2.2: Patterns array is missing or empty');
  }

  const processedPatterns = patterns.map(pattern => {
    if (pattern.includes('*') || path.extname(pattern)) {
      return pattern;
    }
    return `${pattern}{,/**/*}`;
  });

  logger.debug(`Processed patterns: ${processedPatterns.join(', ')}`);

  // 2.3 Resolve File Paths
  logger.debug('2.3 Resolve File Paths');
  const cwd = baseUrl ? path.resolve(process.cwd(), baseUrl) : process.cwd();
  logger.debug(`Working directory for glob: ${cwd}`);

  const globOptions = {
    cwd,
    dot: true,
    onlyFiles: true,
    absolute: true,
    ignore: selectionMode === 'include' ? [] : [...DEFAULT_EXCLUSIONS, ...processedPatterns]
  };

  logger.debug(`Glob options: ${JSON.stringify(globOptions, null, 2)}`);

  try {
    let selectedFiles: string[];

    if (selectionMode === 'include') {
      selectedFiles = await fastGlob(processedPatterns, globOptions);
    } else {
      const allFiles = await fastGlob('**/*', globOptions);
      selectedFiles = allFiles.filter(file => {
        const relativePath = path.relative(cwd, file);
        const shouldExclude = processedPatterns.some(pattern =>
          minimatch(relativePath, pattern, { dot: true }));
        return !shouldExclude;
      });
    }

    if (enablePatternMatch) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      selectedFiles.forEach(file => {
        const relativePath = path.relative(cwd, file);
        // biome-ignore lint/complexity/noForEach: <explanation>
        processedPatterns.forEach(pattern => {
          const matched = minimatch(relativePath, pattern, { dot: true });
          logPatternMatch(relativePath, pattern, matched);
        });
      });
    }

    // 2.4 Validate Results
    if (selectedFiles.length === 0) {
      throw new FileResolutionError('E2.4: No files matched the resolved patterns');
    }

    // 2.5 Logging
    logger.debug('2.5 Logging');
    logger.debug(`Final selected files:\n${selectedFiles.join('\n')}`);
    logger.info(`Total files selected: ${selectedFiles.length}`);

    return selectedFiles;
  } catch (error) {
    throw new FileResolutionError(`Error during file path resolution: ${error}`);
  }
}
