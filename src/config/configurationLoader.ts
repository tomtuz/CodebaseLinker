import path from 'node:path';
import fs from 'node:fs/promises';
import { cosmiconfig } from 'cosmiconfig';
import { CodebaseStruct } from '@/types/codebaseStruct';
import { logger } from '@/utils/logger';
import {
  ConfigPathNotProvidedError,
  ConfigFileAccessError,
  ConfigParseError,
  InvalidConfigurationError
} from '@/errors/ConfigurationErrors';

const defaultStruct: CodebaseStruct = {
  options: {
    name: 'Default Codebase',
    baseUrl: '.',
    format: 'ts',
  },
  paths: [{ path: '.' }]
};

export async function loadConfiguration(configPath: string | undefined): Promise<CodebaseStruct> {
  logger.debug('Starting configuration loading process');

  if (configPath === undefined) {
    const error = new ConfigPathNotProvidedError();
    logger.error(`Configuration loading failed: ${error.message}`);
    throw error;
  }

  const resolvedConfigPath = path.resolve(process.cwd(), configPath);
  try {
    await fs.access(resolvedConfigPath);
  } catch (error: any) {
    const accessError = new ConfigFileAccessError(resolvedConfigPath, error);
    logger.error(`Configuration loading failed: ${accessError.message}`);
    throw accessError;
  }

  const explorer = cosmiconfig('cotext');
  try {
    const result = await explorer.load(resolvedConfigPath);
    if (!result) {
      throw new ConfigParseError(new Error('Empty configuration file'));
    }

    if (!isValidCodebaseStruct(result.config)) {
      throw new InvalidConfigurationError();
    }

    const mergedConfig: CodebaseStruct = {
      options: { ...defaultStruct.options, ...result.config.options },
      paths: result.config.paths
    };

    logger.debug(`Final configuration: ${JSON.stringify(mergedConfig, null, 2)}`);

    return mergedConfig;
  } catch (error: any) {
    logger.error(`Error loading configuration: ${error.message}`);
    logger.debug(`Stack trace: ${error.stack}`);
    throw error;
  }
}

function isValidCodebaseStruct(obj: any): obj is CodebaseStruct {
  logger.debug('\n(F) isValidCodebaseStruct');
  logger.debug('--------------');
  logger.debug(`(P) obj: ${JSON.stringify(obj, null, 2)}`);

  if (!obj || typeof obj !== 'object') return false;
  if (obj.options && typeof obj.options !== 'object') return false;
  if (obj.paths && !Array.isArray(obj.paths)) return false;

  if (obj.options) {
    const validOptionKeys = ['name', 'baseUrl', 'outUrl', 'output', 'format', 'include', 'exclude'];
    const invalidKey = Object.keys(obj.options).find(key => !validOptionKeys.includes(key));
    if (invalidKey) return false;
  }

  if (obj.paths) {
    for (const path of obj.paths) {
      if (typeof path !== 'object') return false;
      if (typeof path.path !== 'string') return false;
      if (path.exclude && !Array.isArray(path.exclude)) return false;
      if (path.include && !Array.isArray(path.include)) return false;
      if (path.output && typeof path.output !== 'string') return false;
      if (path.format && typeof path.format !== 'string') return false;
      if (path.explicit && typeof path.explicit !== 'boolean') return false;
    }
  }

  return true;
}

