import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CodebaseStruct } from '@/types/codebaseStruct';
import { logger } from '@/utils/logger';

import {
  ConfigPathNotProvidedError,
  ConfigFileAccessError,
  ConfigParseError,
  InvalidConfigurationError,
  ConfigUndefinedError,
} from '@/errors/ConfigurationErrors';
import { isFileReadable } from './loaderUtils';
import { validateConfig } from './validate';
import { DEFAULT_CONFIG } from '@/defaults/defaultConfig';
import { deepMerge, DeepPartial } from '@/utils/objectUtils';

export async function loadConfiguration(
  configPath?: string,
  configRoot: string = process.cwd()
): Promise<CodebaseStruct> {
  // 1.1 Config Path Validation
  logger.verbose('1.1 Config Path Validation');
  // a) Check if the config path is provided
  if (!configPath) {
    throw new ConfigPathNotProvidedError();
  }
  // b) Validate the provided path
  const resolvedPath = path.resolve(configRoot, configPath);
  logger.info(`Config path: ${resolvedPath}\n`);

  // 1.2 Config File Access
  logger.verbose('1.2 Config File Access');
  // a) Resolve the path relative to the current working directory
  // b) Attempt to access the file at the given path
  try {
    await isFileReadable(resolvedPath);
    logger.verbose('[+] Config access\n', "custom");
  } catch (error) {
    throw new ConfigFileAccessError(resolvedPath, error as Error);
  }

  // 1.3 Config Parsing
  logger.verbose('1.3 Config Parsing');
  // a) Load the configuration file
  // b) Parse the configuration content
  let config: unknown;
  try {
    const fileUrl = pathToFileURL(resolvedPath).href;
    const { default: configData } = await import(fileUrl);
    config = configData;

    logger.verbose(
      'Raw imported configuration:\n',
      JSON.stringify(configData, null, 2)
    );
    logger.verbose('[+] Config parse\n', "custom");
  } catch (error) {
    throw new ConfigParseError(error as Error);
  }

  if (config === undefined) {
    throw new ConfigUndefinedError(resolvedPath);
  }

  // 1.4 Config Merging
  logger.verbose('1.4 Config Merging');
  logger.verbose('Default configuration:\n', JSON.stringify(DEFAULT_CONFIG, null, 2), "\n");

  // a) Merge the loaded configuration with the default configuration
  const mergedConfig = deepMerge<CodebaseStruct>(DEFAULT_CONFIG, config as DeepPartial<CodebaseStruct>);

  // 1.5 Config Validation
  logger.verbose('1.5 Config Validation');
  // a) Check if the merged configuration adheres to the expected CodebaseStruct interface
  // b) Validate specific fields and their types
  if (!await validateConfig(mergedConfig)) {
    logger.verbose('Merged configuration:\n', JSON.stringify(mergedConfig, null, 2), "\n");
    throw new InvalidConfigurationError('Invalid configuration structure');
  }
  logger.verbose('[+] Config valid\n');

  // 1.6 Logging
  logger.verbose('1.6 Logging');
  // a) Log the final configuration (at debug level)
  logger.verbose('Final configuration:', JSON.stringify(mergedConfig, null, 2), "\n");

  return mergedConfig;
}
