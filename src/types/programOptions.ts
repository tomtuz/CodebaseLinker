import { UNIVERSAL_CONFIG } from "@/defaults/defaultConfig";

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

// CLI default options
// supports variadic inputs
// all unchanged values fallback to UNIVRESAL_CONFIG
export const customOptions = {
  name: {
    type: "string" as const,
    short: "n",
    store: "name",
    default: UNIVERSAL_CONFIG.name,
  },
  config: {
    type: "string" as const,
    short: "c",
    store: "config",
    default: UNIVERSAL_CONFIG.config,
  },
  input: {
    type: "string" as const,
    short: "i",
    store: "input",
    default: UNIVERSAL_CONFIG.input,
  },
  output: {
    type: "string" as const,
    short: "o",
    store: "output",
    default: UNIVERSAL_CONFIG.output,
  },
  include: {
    type: "string" as const,
    multiple: true,
    store: "include",
    variadic: true,
    default: UNIVERSAL_CONFIG.include,
  },
  exclude: {
    type: "string" as const,
    multiple: true,
    store: "exclude",
    variadic: true,
    default: UNIVERSAL_CONFIG.exclude,
  },
  format: {
    type: "string" as const,
    short: "f",
    store: "format",
    default: UNIVERSAL_CONFIG.format,
  },
  debug: {
    type: "boolean" as const,
    short: "d",
    store: "debug",
    default: UNIVERSAL_CONFIG.debug,
  },
  verbose: {
    type: "boolean" as const,
    short: "v",
    store: "verbose",
    default: UNIVERSAL_CONFIG.verbose,
  },
  "pattern-match": {
    type: "boolean" as const,
    store: "patternMatch",
    default: UNIVERSAL_CONFIG.patternMatch,
  },
  "pattern-logs": {
    type: "string" as const,
    store: "patternLogs",
    default: UNIVERSAL_CONFIG.patternLogs,
  },
  logs: {
    type: "string" as const,
    short: "l",
    store: "logs",
    default: UNIVERSAL_CONFIG.logs,
  },
};

// CLI parsing args
export type ArgType = "string" | "boolean";

export interface ArgOption {
  type: ArgType;
  short?: string;
  multiple?: boolean;
  default?: any;
  store: string;
}

export interface ParseOptions {
  [key: string]: ArgOption;
}

export interface ParseResult {
  values: { [key: string]: any };
  positionals: string[];
}

// Interface defining the structure of command-line argument options
export interface ExtendedArgOption {
  type: "string" | "boolean";
  short?: string;
  multiple?: boolean;
  default?: any;
  store: string;
  variadic?: boolean;
  choices?: string[];
}

// Interface for the options object passed to the parser
export interface ExtendedParseOptions {
  [key: string]: ExtendedArgOption;
}

// Custom error class for argument-related errors
export class ArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArgumentError";
  }
}
