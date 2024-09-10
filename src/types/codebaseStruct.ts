/**
 * Options for configuring the codebase structure
 */
export interface CodebaseStruct {
  /** Name of the codebase structure */
  name?: string;

  /** Path to config a file */
  config?: string;

  /** Base URL for resolving relative paths */
  input: string;

  /** Global output file name */
  output: string;

  /** specifies 'include' file pattern globs */
  include?: string[];

  /** specifies 'exclude' file pattern globs */
  exclude?: string[];

  /** Default format for code blocks */
  format?: string;

  // -- Logging

  /** Log 'debug' info */
  debug?: boolean;

  /** Log 'verbose' debug info */
  verbose?: boolean;

  // TODO: validate and document
  // input: string;

  /** enables patternLogs */
  patternMatch: boolean; // enables patternLogs

  /**
   * Specifies the path to store the pattern logs.
   * (usually too long to display in console)
   * used within 'createLogWriter'
   * */
  patternLogs?: string;

  /**
   * Specifies the path to store the regular console logs.
   * */
  logs: string;

  // -- OUTDATED --
  // These options shouldn't be used and should be replaced soon.

  /**
   * Array of glob patterns for file selection
   * - In 'include' mode: Patterns specify which files to include
   * - In 'exclude' mode: Patterns specify which files to exclude
   *
   * Patterns are processed in order, allowing for overrides.
   * Use negative patterns (starting with !) to negate a previous pattern.
   */
  // (OUTDATED for 'include', 'exclude')
  patterns?: string[];

  /**
   * Selection mode for file inclusion/exclusion
   * - 'include': Only explicitly included files will be processed
   * - 'exclude': All files except explicitly excluded ones will be processed
   */
  // (OUTDATED)
  selectionMode?: "include" | "exclude" | string;

  /**
   * (OUTDATED for 'output')
   * Base URL for output files
   * */
  outUrl?: string;

  /**
   * (OUTDATED for 'input')
   * Base URL for resolving relative paths
   * */
  baseUrl?: string;
}

/**
 * Main configuration structure for the codebase
 */
// export interface CodebaseStruct {
//   /** Global options for the codebase structure */
//   options: CodebaseStructOptions;
// }

/**
 * Function to define the codebase configuration
 * @param config The codebase configuration object
 * @returns The validated codebase configuration
 */
export function defineConfig(config: CodebaseStruct): CodebaseStruct {
  return config;
}
