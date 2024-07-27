import { cosmiconfig } from 'cosmiconfig';
import { CodebaseStruct } from '../codebaseStruct';
import { logger } from './logger';

const defaultStruct: CodebaseStruct = {
  options: {
    name: 'Default Codebase',
    baseUrl: '.',
    format: 'ts',
  },
  paths: [
    { path: '.' }
  ]
};

export async function loadStructFile(configPath: string | undefined): Promise<CodebaseStruct> {
  logger.debug('\n(F) loadStructFile');
  logger.debug('--------------');
  logger.debug(`(P) loadStructFile: ${configPath}`);

  const explorer = cosmiconfig('cotext', {
    searchPlaces: ['cotext.config.ts', 'cotext.config.js'],
  });

  try {
    let result: any;
    if (configPath) {
      result = await explorer.load(configPath);
    } else {
      result = await explorer.search();
    }

    if (!result) {
      logger.warn('No configuration file found. Using default configuration.');
      return defaultStruct;
    }

    const userStruct = result.config;

    if (!isValidCodebaseStruct(userStruct)) {
      logger.warn('Invalid configuration. Using default configuration.');
      return defaultStruct;
    }

    return {
      options: { ...defaultStruct.options, ...userStruct.options },
      paths: userStruct.paths || defaultStruct.paths
    };
  } catch (error: any) {
    logger.error('Error loading configuration:');
    throw new Error(error.message);
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

