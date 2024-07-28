export class ConfigPathNotProvidedError extends Error {
  constructor() {
    super('Config path is not supplied. Please provide a valid config file path with the -c option.');
    this.name = 'ConfigPathNotProvidedError';
  }
}

export class ConfigFileAccessError extends Error {
  constructor(path: string, originalError: Error) {
    super(`Cannot access config file at path: ${path}. ${originalError.message}`);
    this.name = 'ConfigFileAccessError';
  }
}

export class ConfigParseError extends Error {
  constructor(originalError: Error) {
    super(`Failed to parse the configuration file. ${originalError.message}`);
    this.name = 'ConfigParseError';
  }
}

export class InvalidConfigurationError extends Error {
  constructor() {
    super('Invalid configuration structure.');
    this.name = 'InvalidConfigurationError';
  }
}

export class ConfigResolutionError extends Error {
  constructor() {
    super('Config path could not be parsed.');
    this.name = 'ConfigResolutionError';
  }
}

