import { CodebaseStruct } from "@/types/codebaseStruct";
import { ProgramOptions } from "@/types/programOptions";

// Purpose:
// - sane defaults when running without configuration
export const DEFAULT_CONFIG: CodebaseStruct = {
  name: "Codebase",
  patterns: ["*"],
  baseUrl: ".", // input
  input: ".",
  output: "codebase-context.md",
  format: "",
  selectionMode: "include", // include | exclude
  verbose: false,
  debug: false,
  patternMatch: false, // enables patternLogs
  patternLogs: "", // specifies the path to store pattern logs (usually too long to display in console), used within createLogWriter
  logs: "", // specifies path to use to save the console output
};

// attempt to merge two configs
export const UNIVERSAL_CONFIG: CodebaseStruct = {
  name: "Codebase",
  config: "", // not set for CLI

  input: ".", // baseUrl
  output: "codebase-context.md",

  include: ["*"], // determines mode 'include' or 'exclude'
  exclude: [], // determines mode 'include' or 'exclude'

  format: "",

  // -- logging options

  debug: false,
  verbose: false,
  patternMatch: false, // enables patternLogs
  patternLogs: "", // specifies the path to store pattern logs (usually too long to display in console), used within createLogWriter
  logs: "", // specifies path to use to save the console output
};

// Null values of CLI for reference
// Purpose:
// - provide safe values for CLI defaults
// - detect changed settings
export const CLI_DEFAULTS: Required<ProgramOptions> = {
  config: "",
  include: [],
  exclude: [],
  input: "",
  output: "",
  format: "",
  verbose: false,
  debug: false,
  patternMatch: false,
  patternLogs: "",
  logs: "",
};
