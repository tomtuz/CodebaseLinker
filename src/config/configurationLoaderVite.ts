import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CodebaseStruct } from '@/types/codebaseStruct';
import { logger } from '@/utils/logger';
import {
  ConfigPathNotProvidedError,
  ConfigFileAccessError,
  ConfigParseError,
  InvalidConfigurationError,
  ConfigResolutionError
} from '@/errors/ConfigurationErrors';
import { isFileReadable } from './loaderUtils';
import { validateConfig } from './validate';

const DEFAULT_CONFIG: CodebaseStruct = {
  options: {
    name: 'Default Codebase',
    baseUrl: '.',
    format: 'ts',
  },
  paths: [{ path: '.' }],
};

export async function loadConfiguration(
  configPath?: string,
  configRoot: string = process.cwd()
): Promise<CodebaseStruct> {
  logger.debug('# Configuration loading:');
  logger.info('---------------');

  // 1.b) Validate the provided path
  if (!configPath) {
    // E1b: Invalid config path
    throw new ConfigPathNotProvidedError();
  }

  // 2.a) Resolve the path relative to the current working directory
  const resolvedPath = path.resolve(configRoot, configPath);
  if (!resolvedPath) {
    throw new ConfigResolutionError();
  }
  logger.debug('Resolved config path:', resolvedPath);

  try {
    await isFileReadable(resolvedPath);
  } catch (error) {
    // E2b: File doesn't exist or can't be accessed
    throw new ConfigFileAccessError(resolvedPath, error as Error);
  }

  // 3.a) Load the configuration file
  let rawConfig: Record<string, any> | any
  try {
    const fileUrl = pathToFileURL(resolvedPath).href;
    rawConfig = await import(fileUrl);
  } catch (error) {
    // E3a: File read error
    throw new ConfigParseError(error as Error);
  }

  // 3.b) Parse the configuration content
  const config = typeof rawConfig.default === 'function' ? rawConfig.default() : rawConfig.default;

  // 4. Config Merging
  const mergedConfig = mergeConfig(DEFAULT_CONFIG, config);

  // 5. Config Validation
  if (!await validateConfig(mergedConfig)) {
    // E4: Invalid configuration structure
    throw new InvalidConfigurationError();
  }

  // 6. Logging
  logger.debug('Final configuration:', JSON.stringify(mergedConfig, null, 2));

  return mergedConfig;
}

function mergeConfig(defaults: CodebaseStruct, overrides: Partial<CodebaseStruct>): CodebaseStruct {
  return {
    ...defaults,
    ...overrides,
    options: {
      ...defaults.options,
      ...overrides.options,
    },
    paths: overrides.paths ?? defaults.paths,
  };
}
