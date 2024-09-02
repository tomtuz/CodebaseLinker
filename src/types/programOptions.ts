export interface ProgramOptions {
  /** Path to the configuration file */
  config?: string;
  /** Include glob paths */
  include: string[];
  /** Exclude glob paths */
  exclude: string[];
  /** Input directory */
  input?: string;
  /** Output file name */
  output: string;
  /** Output format (md, json, yaml) */
  format: "md" | "json" | "yaml" | "";
  /** Enable verbose output */
  verbose: boolean;
  /** Enable debug output */
  debug: boolean;
  /** Enable pattern match debugging */
  patternMatch: boolean;
  // TODO: document
  patternLogs: string;
  /** Enable pattern match debugging */
  logs: string;
}
