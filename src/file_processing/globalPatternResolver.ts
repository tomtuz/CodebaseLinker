import { DEFAULT_EXCLUSIONS } from '@/utils/constants';
import { CodebaseStructOptions } from '../types/codebaseStruct';
import { logger } from '../utils/logger';
import fastGlob from 'fast-glob';
import path from 'node:path';

// Custom error types
class SelectionModeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SelectionModeError';
  }
}

class PatternError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PatternError';
  }
}

class FileResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileResolutionError';
  }
}

export async function resolveGlobalPatterns(options: CodebaseStructOptions): Promise<string[]> {
  logger.debug('Starting global pattern resolution');

  // 2.1 Determine Selection Mode
  logger.debug('2.1 Determine Selection Mode');
  const { selectionMode, patterns, baseUrl } = options;

  // 2.1a) Retrieve the selectionMode from the configuration
  if (!selectionMode) {
    // E2.1a: Missing selection mode in configuration
    throw new SelectionModeError('E2.1a: Selection mode is not provided in the configuration');
  }

  // 2.1b) Validate that the mode is either 'include' or 'exclude'
  if (selectionMode !== 'include' && selectionMode !== 'exclude') {
    // E2.1b: Invalid selection mode specified
    throw new SelectionModeError('E2.1b: Invalid selection mode specified. Must be either "include" or "exclude"');
  }

  logger.debug(`Selection mode: ${selectionMode}`);

  // 2.1c) Set up the initial file selection based on the mode
  let selectedFiles: string[] = [];
  if (selectionMode === 'exclude') {
    logger.debug('Starting with all files selected (exclude mode)');
  } else {
    logger.debug('Starting with no files selected (include mode)');
  }

  // 2.2 Process Default Exclusions
  logger.debug('2.2 Process Default Exclusions');
  let effectivePatterns: string[] = [];
  if (selectionMode === 'exclude') {
    effectivePatterns = [...DEFAULT_EXCLUSIONS];
    // Check for overrides in user patterns
    // biome-ignore lint/complexity/noForEach: <explanation>
    patterns.forEach(pattern => {
      if (pattern.startsWith('!')) {
        const overriddenPattern = pattern.slice(1);
        effectivePatterns = effectivePatterns.filter(p => p !== overriddenPattern);
        logger.debug(`Overridden default exclusion: ${overriddenPattern}`);
      } else {
        effectivePatterns.push(pattern);
      }
    });
  } else {
    effectivePatterns = patterns;
  }

  logger.debug(`Effective patterns: ${effectivePatterns.join(', ')}`);

  // 2.3 Process User-Defined Patterns
  logger.debug('2.3 Process User-Defined Patterns');
  // 2.3a) Retrieve the patterns array from the configuration
  // 2.3b) Validate that the patterns array exists and is not empty
  if (!effectivePatterns || effectivePatterns.length === 0) {
    // E2.3a: Missing patterns array in configuration
    // E2.3b: Empty patterns array
    throw new PatternError('E2.3a/b: Patterns array is missing or empty');
  }

  // 2.3c) Validate the pattern syntax
  // Note: We're not implementing full pattern syntax validation here,
  // but we're separating directory and file patterns
  const directoryPatterns: string[] = [];
  const filePatterns: string[] = [];

  // biome-ignore lint/complexity/noForEach: <explanation>
  effectivePatterns.forEach(pattern => {
    if (path.extname(pattern) || pattern.includes('*')) {
      filePatterns.push(pattern);
    } else {
      directoryPatterns.push(`${pattern}/**/*`);
    }
  });

  logger.debug(`Directory patterns: ${directoryPatterns.join(', ')}`);
  logger.debug(`File patterns: ${filePatterns.join(', ')}`);

  // 2.4 Resolve File Paths
  logger.debug('2.4 Resolve File Paths');
  // 2.4a) Use a glob matching library to resolve the final list of file paths
  const cwd = baseUrl ? path.resolve(process.cwd(), baseUrl) : process.cwd();
  logger.debug(`Working directory for glob: ${cwd}`);

  const globOptions = {
    cwd,
    dot: true,
    onlyFiles: true,
    absolute: true,
    ignore: selectionMode === 'include' ? [] : DEFAULT_EXCLUSIONS
  };

  logger.debug(`Glob options: ${JSON.stringify(globOptions, null, 2)}`);

  try {
    const dirFiles = await fastGlob(directoryPatterns, globOptions);
    const specificFiles = await fastGlob(filePatterns, globOptions);
    selectedFiles = [...new Set([...dirFiles, ...specificFiles])];
  } catch (error) {
    // 2.4b) Error during file path resolution
    throw new FileResolutionError(`E2.4b: Error during file path resolution: ${error}`);
  }

  // 2.4a) Validate that the final list is not empty
  if (selectedFiles.length === 0) {
    throw new FileResolutionError('E2.4a: No files matched the resolved patterns');
  }

  // 2.5 Logging
  logger.debug('2.5 Logging');
  // 2.5a) Log the final list of selected files
  logger.debug(`Final selected files:\n${selectedFiles.join('\n')}`);
  logger.info(`Total files selected: ${selectedFiles.length}`);

  // 2.5b) Log any warnings for unexpected results
  const providedDirectories = effectivePatterns.filter(pattern => !path.extname(pattern) && !pattern.includes('*'));
  for (const dir of providedDirectories) {
    const filesInDir = selectedFiles.filter(file => file.includes(`/${dir}/`));
    if (filesInDir.length === 0) {
      logger.warn(`No files selected in provided directory: ${dir}`);
    }
  }

  const providedSpecificFiles = effectivePatterns.filter(pattern => path.extname(pattern) || pattern.includes('*'));
  for (const file of providedSpecificFiles) {
    if (!selectedFiles.some(selectedFile => selectedFile.endsWith(file))) {
      logger.warn(`The specified file ${file} was not selected`);
    }
  }

  return selectedFiles;
}
