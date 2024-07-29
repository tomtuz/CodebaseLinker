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

  /**
   * Selection mode for file inclusion/exclusion
   * - 'include': Only explicitly included files will be processed
   * - 'exclude': All files except explicitly excluded ones will be processed
   */
  selectionMode: 'include' | 'exclude';

  /**
   * Array of glob patterns for file selection
   * - In 'include' mode: Patterns specify which files to include
   * - In 'exclude' mode: Patterns specify which files to exclude
   * 
   * Patterns are processed in order, allowing for overrides.
   * Use negative patterns (starting with !) to negate a previous pattern.
   */
  patterns: string[];
}

/**
 * Main configuration structure for the codebase
 */
export interface CodebaseStruct {
  /** Global options for the codebase structure */
  options: CodebaseStructOptions;
}

/**
 * Function to define the codebase configuration
 * @param config The codebase configuration object
 * @returns The validated codebase configuration
 */
export function defineConfig(config: CodebaseStruct): CodebaseStruct {
  return config;
}
