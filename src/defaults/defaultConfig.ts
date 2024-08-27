import { CodebaseStruct, CodebaseStructOptions } from "@/types/codebaseStruct";
import { ProgramOptions } from "@/types/programOptions";

// Purpose:
// - sane defaults when running without configuration
export const DEFAULT_CONFIG: CodebaseStruct = {
  options: {
    name: "Codebase",
    patterns: ["*"],
    baseUrl: ".", // input
    output: "codebase-context.md",
    format: "",
    selectionMode: "include", // include | exclude
    verbose: false,
    debug: false,
    patternMatch: false,
    patternLogs: "", // logs
  },
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
