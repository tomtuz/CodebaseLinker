export class ConfigPathNotProvidedError extends Error {
  constructor() {
    super('E1a: Config path is not supplied. Please provide a valid config file path with the -c option.');
    this.name = 'ConfigPathNotProvidedError';
  }
}

export class ConfigFileAccessError extends Error {
  constructor(path: string, originalError: Error) {
    super(`E2b: Cannot access config file at path: ${path}. ${originalError.message}`);
    this.name = 'ConfigFileAccessError';
  }
}

export class ConfigParseError extends Error {
  constructor(originalError: Error) {
    super(`E3: Failed to parse the configuration file. ${originalError.message}`);
    this.name = 'ConfigParseError';
  }
}

export class InvalidConfigurationError extends Error {
  constructor(message = 'Invalid configuration structure.') {
    super(`E5: ${message}`);
    this.name = 'InvalidConfigurationError';
  }
}
