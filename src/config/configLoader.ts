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
  logger.debug('# 1. Configuration Loading:');
  logger.debug('---------------------------');

  // 1.1 Config Path Validation
  logger.step('1.1 Config Path Validation');
  // a) Check if the config path is provided
  if (!configPath) {
    throw new ConfigPathNotProvidedError();
  }
  // b) Validate the provided path
  const resolvedPath = path.resolve(configRoot, configPath);
  logger.info(`Resolved config path: ${resolvedPath}`);

  // 1.2 Config File Access
  logger.step('1.2 Config File Access');
  // a) Resolve the path relative to the current working directory
  // b) Attempt to access the file at the given path
  try {
    await isFileReadable(resolvedPath);
  } catch (error) {
    throw new ConfigFileAccessError(resolvedPath, error as Error);
  }

  // 1.3 Config Parsing
  logger.step('1.3 Config Parsing');
  // a) Load the configuration file
  // b) Parse the configuration content
  let rawConfig: unknown;
  try {
    const fileUrl = pathToFileURL(resolvedPath).href;
    rawConfig = await import(fileUrl);
    logger.info('Raw imported configuration:');
    logger.debug(JSON.stringify(rawConfig, null, 2));
  } catch (error) {
    throw new ConfigParseError(error as Error);
  }

  if (rawConfig === undefined || (typeof rawConfig === 'object' && rawConfig !== null && Object.keys(rawConfig).length === 0)) {
    throw new ConfigUndefinedError(resolvedPath);
  }

  const config = typeof (rawConfig as { default?: unknown }).default === 'function'
    ? (rawConfig as { default: () => unknown }).default()
    : (rawConfig as { default?: unknown }).default;

  if (config === undefined) {
    throw new ConfigUndefinedError(resolvedPath);
  }

  logger.debug('Processed imported configuration:');
  logger.debug(JSON.stringify(config, null, 2));

  // 1.4 Config Merging
  logger.debug('1.4 Config Merging');
  logger.debug('Default configuration:');
  logger.debug(JSON.stringify(DEFAULT_CONFIG, null, 2));

  // a) Merge the loaded configuration with the default configuration
  const mergedConfig = deepMerge<CodebaseStruct>(DEFAULT_CONFIG, config as DeepPartial<CodebaseStruct>);

  logger.debug('Merged configuration:');
  logger.debug(JSON.stringify(mergedConfig, null, 2));

  // 1.5 Config Validation
  logger.debug('1.5 Config Validation');
  // a) Check if the merged configuration adheres to the expected CodebaseStruct interface
  // b) Validate specific fields and their types
  if (!await validateConfig(mergedConfig)) {
    throw new InvalidConfigurationError('Invalid configuration structure');
  }

  // 1.6 Logging
  logger.debug('1.6 Logging');
  // a) Log the final configuration (at debug level)
  logger.debug(`Final configuration: ${JSON.stringify(mergedConfig, null, 2)}`);

  return mergedConfig;
}
