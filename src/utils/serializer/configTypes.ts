import { CLI_DEFAULTS, DEFAULT_CONFIG } from "@/defaults/defaultConfig";
import { CodebaseStructOptions } from "@/types/codebaseStruct";
import { ProgramOptions } from "@/types/programOptions";
import {
  getStringOption,
  getArrayOption,
  getBooleanOption,
  setArrayOption,
  setBooleanOption,
  setStringOption,
} from "./configOperations";
import { logger } from "../logger";

export enum BOOLEAN_OPTIONS {
  VERBOSE = 0,
  DEBUG = 1,
  PATTERN_MATCH = 2,
  COUNT = 3,
}

export enum STRING_OPTIONS {
  CONFIG = 0,
  BASE_URL = 1,
  OUTPUT = 2,
  FORMAT = 3,
  SELECTION_MODE = 4,
  NAME = 5,
  COUNT = 6,
}

export enum ARRAY_OPTIONS {
  PATTERNS = 0,
  COUNT = 1,
}

export type ConfigIndex = {
  booleans: Uint8Array;
  strings: (string | null)[];
  arrays: (string[] | null)[];
  changedFlags: Uint32Array;
};

type OptionsIndex = {
  [K in keyof ProgramOptions]: {
    type: "boolean" | "string" | "array";
    index: number;
    default?: any;
  };
};

// map options to indexes
export const optionMapping: OptionsIndex = {
  config: { type: "string", index: STRING_OPTIONS.CONFIG },
  include: { type: "array", index: ARRAY_OPTIONS.PATTERNS },
  exclude: { type: "array", index: ARRAY_OPTIONS.PATTERNS },
  input: { type: "string", index: STRING_OPTIONS.BASE_URL },
  output: { type: "string", index: STRING_OPTIONS.OUTPUT },
  format: { type: "string", index: STRING_OPTIONS.FORMAT },
  verbose: { type: "boolean", index: BOOLEAN_OPTIONS.VERBOSE },
  debug: { type: "boolean", index: BOOLEAN_OPTIONS.DEBUG },
  patternMatch: { type: "boolean", index: BOOLEAN_OPTIONS.PATTERN_MATCH },
  patternLogs: { type: "string", index: STRING_OPTIONS.SELECTION_MODE },
  logs: { type: "string", index: STRING_OPTIONS.SELECTION_MODE },
};

export const optionDefinitions: OptionsIndex = {
  verbose: {
    type: "boolean",
    index: BOOLEAN_OPTIONS.VERBOSE,
    default: CLI_DEFAULTS.verbose,
  },
  debug: {
    type: "boolean",
    index: BOOLEAN_OPTIONS.DEBUG,
    default: CLI_DEFAULTS.debug,
  },
  patternMatch: {
    type: "boolean",
    index: BOOLEAN_OPTIONS.PATTERN_MATCH,
    default: CLI_DEFAULTS.patternMatch,
  },
  config: {
    type: "string",
    index: STRING_OPTIONS.CONFIG,
    default: CLI_DEFAULTS.config,
  },
  input: {
    type: "string",
    index: STRING_OPTIONS.BASE_URL,
    default: CLI_DEFAULTS.input,
  },
  output: {
    type: "string",
    index: STRING_OPTIONS.OUTPUT,
    default: CLI_DEFAULTS.output,
  },
  format: {
    type: "string",
    index: STRING_OPTIONS.FORMAT,
    default: CLI_DEFAULTS.format,
  },
  include: {
    type: "array",
    index: ARRAY_OPTIONS.PATTERNS,
    default: CLI_DEFAULTS.include,
  },
  exclude: {
    type: "array",
    index: ARRAY_OPTIONS.PATTERNS,
    default: CLI_DEFAULTS.exclude,
  },
  patternLogs: {
    type: "string",
    index: STRING_OPTIONS.SELECTION_MODE,
    default: CLI_DEFAULTS.patternLogs,
  },
  logs: {
    type: "string",
    index: STRING_OPTIONS.SELECTION_MODE,
    default: CLI_DEFAULTS.logs,
  },
};

export function createConfigIndex(): ConfigIndex {
  return {
    booleans: new Uint8Array(BOOLEAN_OPTIONS.COUNT),
    strings: new Array(STRING_OPTIONS.COUNT).fill(null),
    arrays: new Array(ARRAY_OPTIONS.COUNT).fill(null),
    changedFlags: new Uint32Array(3), // One for each type: boolean, string, array
  };
}

export function resolveCliOptions(
  cliOptions: Partial<ProgramOptions>,
): ConfigIndex {
  logger.setLevels({
    Info: true,
    Debug: cliOptions.debug,
    Verbose: cliOptions.verbose,
  });
  logger.verbose("options: ", JSON.stringify(cliOptions, null, 2));

  const options = createConfigIndex();

  for (const [key, value] of Object.entries(cliOptions) as [
    keyof ProgramOptions,
    any,
  ][]) {
    if (value !== undefined && value !== CLI_DEFAULTS[key]) {
      const def = optionDefinitions[key];
      if (def) {
        switch (def.type) {
          case "boolean":
            setBooleanOption(options, def.index, Boolean(value));
            break;
          case "string":
            setStringOption(options, def.index, value);
            break;
          case "array":
            if (Array.isArray(value) && value.length > 0) {
              setArrayOption(options, def.index, value);
              setStringOption(
                options,
                STRING_OPTIONS.SELECTION_MODE,
                key === "include" ? "include" : "exclude",
              );
            }
            break;
        }
      }
    }
  }

  logger.verbose("resolvedCliOptions: ", JSON.stringify(options, null, 2));

  return options;
}
