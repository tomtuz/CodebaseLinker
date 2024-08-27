import { CLI_DEFAULTS, DEFAULT_CONFIG } from "@/defaults/defaultConfig";
import {
  getStringOption,
  getArrayOption,
  getBooleanOption,
  setArrayOption,
  setBooleanOption,
  setStringOption,
} from "./configOperations";
import {
  VectorizedOptions,
  STRING_OPTIONS,
  ARRAY_OPTIONS,
  OPTIONS,
  createVectorizedOptions,
} from "./configTypes";
import { CodebaseStructOptions } from "@/types/codebaseStruct";
import { ProgramOptions } from "@/types/programOptions";
import { logger } from "../logger";

type BooleanOption = {
  type: "boolean";
  index: OPTIONS;
  default: boolean;
};

type StringOption = {
  type: "string";
  index: STRING_OPTIONS;
  default: string;
};

type ArrayOption = {
  type: "array";
  index: ARRAY_OPTIONS;
  default: string[];
};

type OptionDefinition = BooleanOption | StringOption | ArrayOption;

const optionDefinitions: { [K in keyof ProgramOptions]: OptionDefinition } = {
  verbose: {
    type: "boolean",
    index: OPTIONS.VERBOSE,
    default: CLI_DEFAULTS.verbose,
  },
  debug: { type: "boolean", index: OPTIONS.DEBUG, default: CLI_DEFAULTS.debug },
  patternMatch: {
    type: "boolean",
    index: OPTIONS.PATTERN_MATCH,
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

export function resolveCliOptions(
  cliOptions: ProgramOptions,
): VectorizedOptions {
  logger.setLevels({
    Info: true,
    Debug: cliOptions.debug,
    Verbose: cliOptions.verbose,
  });
  logger.verbose("options: ", JSON.stringify(cliOptions, null, 2));

  const options = createVectorizedOptions();

  for (const [key, def] of Object.entries(optionDefinitions) as [
    keyof ProgramOptions,
    OptionDefinition,
  ][]) {
    const value = cliOptions[key];
    if (value !== undefined && value !== def.default) {
      switch (def.type) {
        case "boolean":
          setBooleanOption(options, def.index, Boolean(value));
          break;
        case "string":
          setStringOption(options, def.index, String(value));
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

  logger.verbose("set options: ", JSON.stringify(options, null, 2));

  return options;
}

type OptionMapping = {
  [K in keyof CodebaseStructOptions]: {
    type: "boolean" | "string" | "array";
    index: number;
  };
};

const optionMapping: OptionMapping = {
  config: { type: "string", index: STRING_OPTIONS.CONFIG },
  name: { type: "string", index: STRING_OPTIONS.NAME },
  patterns: { type: "array", index: ARRAY_OPTIONS.PATTERNS },
  baseUrl: { type: "string", index: STRING_OPTIONS.BASE_URL },
  output: { type: "string", index: STRING_OPTIONS.OUTPUT },
  format: { type: "string", index: STRING_OPTIONS.FORMAT },
  selectionMode: { type: "string", index: STRING_OPTIONS.SELECTION_MODE },
  verbose: { type: "boolean", index: OPTIONS.VERBOSE },
  debug: { type: "boolean", index: OPTIONS.DEBUG },
  patternMatch: { type: "boolean", index: OPTIONS.PATTERN_MATCH },
};

export const translateVector = (
  vectorConfig: VectorizedOptions,
): CodebaseStructOptions => {
  return {
    config:
      getStringOption(vectorConfig, STRING_OPTIONS.CONFIG) ??
      DEFAULT_CONFIG.options.config,
    name:
      getStringOption(vectorConfig, STRING_OPTIONS.NAME) ??
      DEFAULT_CONFIG.options.name,
    patterns:
      getArrayOption(vectorConfig, ARRAY_OPTIONS.PATTERNS) ??
      DEFAULT_CONFIG.options.patterns,
    baseUrl:
      getStringOption(vectorConfig, STRING_OPTIONS.BASE_URL) ??
      DEFAULT_CONFIG.options.baseUrl,
    output:
      getStringOption(vectorConfig, STRING_OPTIONS.OUTPUT) ??
      DEFAULT_CONFIG.options.output,
    format:
      getStringOption(vectorConfig, STRING_OPTIONS.FORMAT) ??
      DEFAULT_CONFIG.options.format,
    selectionMode:
      getStringOption(vectorConfig, STRING_OPTIONS.SELECTION_MODE) ??
      (DEFAULT_CONFIG.options
        .selectionMode as CodebaseStructOptions["selectionMode"]),
    verbose:
      getBooleanOption(vectorConfig, OPTIONS.VERBOSE) ??
      DEFAULT_CONFIG.options.verbose,
    debug:
      getBooleanOption(vectorConfig, OPTIONS.DEBUG) ??
      DEFAULT_CONFIG.options.debug,
    patternMatch:
      getBooleanOption(vectorConfig, OPTIONS.PATTERN_MATCH) ??
      DEFAULT_CONFIG.options.patternMatch,
  };
};

export function serializeOptions(options: VectorizedOptions): string {
  return JSON.stringify({
    b: Array.from(options.booleans),
    s: options.strings,
    a: options.arrays,
    f: Array.from(options.changedFlags),
  });
}

export function deserializeOptions(serialized: string): VectorizedOptions {
  const data = JSON.parse(serialized);
  return {
    booleans: new Uint8Array(data.b),
    strings: data.s,
    arrays: data.a,
    changedFlags: new Uint32Array(data.f),
  };
}

// TODO: validate and cleanup

// export const translateVector = (
//   vectorConfig: VectorizedOptions,
// ): CodebaseStructOptions => {
//   const result: Partial<CodebaseStructOptions> = {};

//   for (const [key, mapping] of Object.entries(optionMapping)) {
//     switch (mapping.type) {
//       case "boolean":
//         result[key] =
//           getBooleanOption(vectorConfig, mapping.index) ??
//           DEFAULT_CONFIG.options[key];
//         break;
//       case "string":
//         result[key] =
//           getStringOption(vectorConfig, mapping.index) ??
//           DEFAULT_CONFIG.options[key];
//         break;
//       case "array":
//         result[key] =
//           getArrayOption(vectorConfig, mapping.index) ??
//           DEFAULT_CONFIG.options[key];
//         break;
//     }
//   }

//   return result as CodebaseStructOptions;
// };

// type OptionMapping = {
//   [K in keyof Partial<CodebaseStructOptions>]: {
//     type: "boolean" | "string" | "array";
//     index: number;
//   };
// };

// const optionMapping: Partial<OptionMapping> = {
//   name: { type: "string", index: STRING_OPTIONS.NAME },
//   patterns: { type: "array", index: ARRAY_OPTIONS.PATTERNS },
//   baseUrl: { type: "string", index: STRING_OPTIONS.BASE_URL },
//   output: { type: "string", index: STRING_OPTIONS.OUTPUT },
//   format: { type: "string", index: STRING_OPTIONS.FORMAT },
//   selectionMode: { type: "string", index: STRING_OPTIONS.SELECTION_MODE },
//   verbose: { type: "boolean", index: OPTIONS.VERBOSE },
//   debug: { type: "boolean", index: OPTIONS.DEBUG },
//   patternMatch: { type: "boolean", index: OPTIONS.PATTERN_MATCH },
// };

// export const translateVector = (
//   vectorConfig: VectorizedOptions,
// ): Partial<CodebaseStructOptions> => {
//   const result: Partial<CodebaseStructOptions> = {};

//   for (const [key, mapping] of Object.entries(optionMapping) as [
//     keyof CodebaseStructOptions,
//     OptionMapping[keyof CodebaseStructOptions],
//   ][]) {
//     if (!mapping) {
//       // break;
//       continue;
//     }

//     switch (mapping.type) {
//       case "boolean": {
//         // result[key] =
//         //   getBooleanOption(vectorConfig, mapping.index) ??
//         //   DEFAULT_CONFIG.options[key];

//         // result[key] =
//           // getBooleanOption(vectorConfig, mapping.index) ??
//           // DEFAULT_CONFIG.options[key];
//         const data = DEFAULT_CONFIG.options[key] || "";
//         const checkIndex = result[key] || {}
//         // const tp = data ? data : "";
//         // // result[key] = data ? data : ;
//         if (result[key]) {
//           result[key] = data;
//         }
//         result[key] = data;

//         break;
//       }
//       case "string": {
//         result[key] =
//           getStringOption(vectorConfig, mapping.index) ??
//           DEFAULT_CONFIG.options[key];
//         break;
//       }
//       case "array": {
//         result[key] =
//           getArrayOption(vectorConfig, mapping.index) ??
//           DEFAULT_CONFIG.options[key];
//         break;
//       }
//       default:
//         break;
//     }
//   }

//   return result as CodebaseStructOptions;
// };
