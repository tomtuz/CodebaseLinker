/**
 * Options for configuring the codebase structure
 */
export interface CodebaseStructOptions {
  /** Name of the codebase structure */
  name?: string;
  /** Base URL for resolving relative paths */
  baseUrl?: string;
  /** Base URL for output files */
  outUrl?: string;
  /** Global output file name */
  output?: string;
  /** Default format for code blocks */
  format?: string;
  /** Glob patterns to include (takes top level presedence) */
  include?: string[];
  /** Glob patterns to exclude (takes top level presedence) */
  exclude?: string[];
}


/**
 * Configuration for a specific path in the codebase structure
 */
export interface CodebaseStructPath {
  /** File or directory path to process */
  path: string;
  /** Patterns to exclude from processing */
  exclude?: string[];
  /** Patterns to include in processing */
  include?: string[];
  /** Specific output file for this path */
  output?: string;
  /** Format for code blocks from this path */
  format?: string;
  /** If true, this path will only be processed for its specific output */
  explicit?: boolean;
}

/**
 * Main configuration structure for the codebase
 */
export interface CodebaseStruct {
  /** Global options for the codebase structure */
  options: CodebaseStructOptions;
  /** Array of paths to process */
  paths: CodebaseStructPath[];
}

/**
 * Function to define the codebase configuration
 * @param config The codebase configuration object
 * @returns The validated codebase configuration
 */
export function defineConfig(config: CodebaseStruct): CodebaseStruct {
  return config;
}
