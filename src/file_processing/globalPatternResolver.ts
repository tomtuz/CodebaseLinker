import { DEFAULT_EXCLUSIONS } from '@/utils/defaultPatterns';
import { CodebaseStructOptions } from '@/types/codebaseStruct';
import { logger } from '@/utils/logger';
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

  // 2. Global Pattern Resolution
  // 2.1 Determine Selection Mode
  logger.debug('2.1 Determine Selection Mode');
  const { selectionMode, patterns, baseUrl } = options;

  // a) Retrieve the selectionMode from the configuration
  if (!selectionMode) {
    throw new SelectionModeError('E2.1a: Selection mode is not provided in the configuration');
  }

  // b) Validate that the mode is either 'include' or 'exclude'
  if (selectionMode !== 'include' && selectionMode !== 'exclude') {
    throw new SelectionModeError('E2.1b: Invalid selection mode specified. Must be either "include" or "exclude"');
  }

  // c) Set up the initial file selection based on the mode
  logger.debug(`Selection mode: ${selectionMode}`);

  // 2.2 Process Default Exclusions
  logger.debug('2.2 Process Default Exclusions');
  // a) If in 'exclude' mode:
  //    - Apply the list of default exclusions (e.g., node_modules, .git)
  //    - Check for any overrides in the user's patterns and apply them
  // Note: This is implicitly handled in the globOptions below

  // 2.3 Process User-Defined Patterns
  logger.debug('2.3 Process User-Defined Patterns');
  // a) Retrieve the patterns array from the configuration
  // b) Validate that the patterns array exists and is not empty
  if (!patterns || patterns.length === 0) {
    throw new PatternError('E2.3a/b: Patterns array is missing or empty');
  }

  // c) Process the patterns
  const processedPatterns = patterns.map(pattern => {
    // If a pattern includes a wildcard or has a file extension, leave it as is
    if (pattern.includes('*') || path.extname(pattern)) {
      return pattern;
    }
    // For patterns without wildcards or extensions, add a wildcard to match both files and directories
    // {,/**/*} means:
    // - Match the pattern as-is (empty part before the comma)
    // - OR (,) match the pattern followed by any depth of subdirectories and any file (/***/)
    return `${pattern}{,/**/*}`;
  });

  logger.debug(`Processed patterns: ${processedPatterns.join(', ')}`);

  // 2.4 Resolve File Paths
  logger.debug('2.4 Resolve File Paths');
  // a) Use fast-glob to resolve the final list of file paths based on the processed patterns
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

    // b) For 'include' mode: Use fast-glob with the processed patterns directly
    if (selectionMode === 'include') {
      selectedFiles = await fastGlob(processedPatterns, globOptions);
    } else {
      // c) For 'exclude' mode:
      //    - Get all files using fast-glob
      //    - Filter out files that match any of the exclude patterns using minimatch
      const allFiles = await fastGlob('**/*', globOptions);
      selectedFiles = allFiles.filter(file => {
        const relativePath = path.relative(cwd, file);
        const shouldExclude = processedPatterns.some(pattern =>
          minimatch(relativePath, pattern, { dot: true }));
        return !shouldExclude;
      });
    }

    // Debug logging for pattern matching
    if (enablePatternMatch) {
      for (const file of selectedFiles) {
        const relativePath = path.relative(cwd, file);
        for (const pattern of processedPatterns) {
          const matched = minimatch(relativePath, pattern, { dot: true });
          logPatternMatch(relativePath, pattern, matched);
        }
      }
    }

    // d) Validate that the final list is not empty
    if (selectedFiles.length === 0) {
      throw new FileResolutionError('E2.4a: No files matched the resolved patterns');
    }

    // 2.5 Logging
    logger.debug('2.5 Logging');
    // a) Log the final list of selected files
    logger.debug(`Final selected files:\n${selectedFiles.join('\n')}`);
    logger.info(`Total files selected: ${selectedFiles.length}`);

    // b) Log any warnings for unexpected results:
    //    - For each original pattern, check if any files were matched
    //    - In 'include' mode, warn if no files were included for a pattern
    //    - In 'exclude' mode, warn if all files were excluded for a pattern
    // Note: This step is partially implemented in the debug logging above

    return selectedFiles;
  } catch (error) {
    throw new FileResolutionError(`E2.4b: Error during file path resolution: ${error}`);
  }
}
