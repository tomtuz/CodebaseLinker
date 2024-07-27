import fg from 'fast-glob';
import path from 'node:path';
import fs from 'node:fs/promises';
import { CodebaseStructPath, CodebaseStructOptions } from '../types/codebaseStruct';
import { logger } from '../utils/logger';
import { DEFAULT_IGNORES } from '../utils/constants';

const MAX_FILES_PER_DIRECTORY = 100;

/**
 * Retrieves file paths based on the provided configuration.
 * 
 * @param basePath - The base path to start searching from.
 * @param pathConfig - Configuration for the specific path.
 * @param globalOptions - Global options that apply to all paths.
 * @returns A promise that resolves to an array of file paths.
 * 
 * This function uses fast-glob to find files matching the specified patterns.
 * It applies both global and path-specific include/exclude patterns.
 * DEFAULT_IGNORES are always applied in addition to user-specified excludes.
 */
export async function getFilePaths(
  basePath: string,
  pathConfig: CodebaseStructPath,
  globalOptions: CodebaseStructOptions,
): Promise<string[]> {
  logger.debug('\n(F) getFilePaths');
  logger.debug('--------------');
  logger.debug(`(P) basePath: ${basePath}`);
  logger.debug(`(P) pathConfig: ${JSON.stringify(pathConfig, null, 2)}`);
  logger.debug(`(P) globalOptions: ${JSON.stringify(globalOptions, null, 2)}`);

  const fullPath = path.resolve(basePath, pathConfig.path);

  try {
    await fs.access(fullPath);
  } catch (error) {
    logger.error(`Path does not exist or is not accessible: ${fullPath}`);
    return [];
  }

  try {
    const globPatterns = buildGlobPatterns(pathConfig, globalOptions);
    logger.debug(`(R) globPatterns: ${JSON.stringify(globPatterns, null, 2)}`);

    const combinedGlobs = [
      ...(globPatterns.exclude || []),
      ...DEFAULT_IGNORES,
    ];
    logger.debug(`(R) combinedGlobs: ${JSON.stringify(combinedGlobs, null, 2)}`);

    const options = {
      cwd: fullPath,
      dot: false,
      absolute: true,
      onlyFiles: true,
      ignore: combinedGlobs,
    };

    const allFiles = await fg(globPatterns.include, options);

    logger.debug(`(R) allFiles: ${JSON.stringify(allFiles, null, 2)}`);

    if (allFiles.length > MAX_FILES_PER_DIRECTORY) {
      logger.error(`Directory "${fullPath}" contains more than ${MAX_FILES_PER_DIRECTORY} files. Skipping to prevent potential issues.`);
      return [];
    }

    return allFiles;
  } catch (error: any) {
    logger.error(`Error processing path ${fullPath}:`, error.message);
    if (logger.isDebugEnabled()) {
      logger.debug("Stack trace:", error.stack);
    }
  }

  return [];
}

function buildGlobPatterns(pathConfig: CodebaseStructPath, globalOptions: CodebaseStructOptions): { include: string[], exclude: string[] } {
  logger.debug('\n(F) buildGlobPatterns');
  logger.debug('--------------');
  logger.debug(`(P) pathConfig: ${JSON.stringify(pathConfig, null, 2)}`);
  logger.debug(`(P) globalOptions: ${JSON.stringify(globalOptions, null, 2)}`);

  const includePatterns = [
    ...(globalOptions.include || []),
    ...(pathConfig.include || [])
  ];
  const excludePatterns = [
    ...(globalOptions.exclude || []),
    ...(pathConfig.exclude || [])
  ];

  if (includePatterns.length === 0) {
    includePatterns.push('**/*'); // Include all files if no specific patterns are provided
  }

  return {
    include: includePatterns,
    exclude: excludePatterns,
  };
}
