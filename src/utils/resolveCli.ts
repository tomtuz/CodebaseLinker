import { ProgramOptions } from "@/types/programOptions";
import { logger } from "./logger";
import { CLI_DEFAULTS } from "@/defaults/defaultConfig";
import {
  setBooleanOption,
  setStringOption,
  setArrayOption,
} from "./serializer/configOperations";
import {
  VectorizedOptions,
  createVectorizedOptions,
  OPTIONS,
  STRING_OPTIONS,
  ARRAY_OPTIONS,
} from "./serializer/configTypes";

type OptionMapping = {
  [K in keyof ProgramOptions]: {
    type: "boolean" | "string" | "array";
    index: number;
  };
};

const optionMapping: OptionMapping = {
  verbose: { type: "boolean", index: OPTIONS.VERBOSE },
  debug: { type: "boolean", index: OPTIONS.DEBUG },
  patternMatch: { type: "boolean", index: OPTIONS.PATTERN_MATCH },
  config: { type: "string", index: STRING_OPTIONS.CONFIG },
  input: { type: "string", index: STRING_OPTIONS.BASE_URL },
  output: { type: "string", index: STRING_OPTIONS.OUTPUT },
  format: { type: "string", index: STRING_OPTIONS.FORMAT },
  include: { type: "array", index: ARRAY_OPTIONS.PATTERNS },
  exclude: { type: "array", index: ARRAY_OPTIONS.PATTERNS },
  // TODO: finish
  patternLogs: { type: "string", index: STRING_OPTIONS.SELECTION_MODE },
  logs: { type: "string", index: STRING_OPTIONS.SELECTION_MODE },
  // Add other options here
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

  for (const [key, value] of Object.entries(cliOptions) as [
    keyof ProgramOptions,
    any,
  ][]) {
    if (value !== undefined && value !== CLI_DEFAULTS[key]) {
      const mapping = optionMapping[key];
      if (mapping) {
        switch (mapping.type) {
          case "boolean":
            setBooleanOption(options, mapping.index, Boolean(value));
            break;
          case "string":
            setStringOption(options, mapping.index, value);
            break;
          case "array":
            if (Array.isArray(value) && value.length > 0) {
              setArrayOption(options, mapping.index, value);
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

  logger.verbose("set options: ", JSON.stringify(options, null, 2));

  return options;
}

// TODO: validate and cleanup
// export function resolveCliOptions(
//   cliOptions: ProgramOptions,
// ): VectorizedOptions {
//   logger.setLevels({
//     Info: true,
//     Debug: cliOptions.debug,
//     Verbose: cliOptions.verbose,
//   });
//   logger.verbose("options: ", JSON.stringify(cliOptions, null, 2));

//   const options = createVectorizedOptions();

//   if (
//     cliOptions.verbose !== undefined &&
//     cliOptions.verbose !== CLI_DEFAULTS.verbose
//   ) {
//     setBooleanOption(options, OPTIONS.VERBOSE, cliOptions.verbose);
//   }

//   if (
//     cliOptions.debug !== undefined &&
//     cliOptions.debug !== CLI_DEFAULTS.debug
//   ) {
//     setBooleanOption(options, OPTIONS.DEBUG, cliOptions.debug);
//   }

//   if (
//     cliOptions.patternMatch !== undefined &&
//     cliOptions.patternMatch !== CLI_DEFAULTS.patternMatch
//   ) {
//     setBooleanOption(
//       options,
//       OPTIONS.PATTERN_MATCH,
//       Boolean(cliOptions.patternMatch),
//     );
//   }

//   if (cliOptions.config && cliOptions.config !== CLI_DEFAULTS.config) {
//     setStringOption(options, STRING_OPTIONS.CONFIG, cliOptions.config);
//   }

//   if (cliOptions.input && cliOptions.input !== CLI_DEFAULTS.input) {
//     setStringOption(options, STRING_OPTIONS.BASE_URL, cliOptions.input);
//   }

//   if (cliOptions.output && cliOptions.output !== CLI_DEFAULTS.output) {
//     setStringOption(options, STRING_OPTIONS.OUTPUT, cliOptions.output);
//   }

//   if (cliOptions.format && cliOptions.format !== CLI_DEFAULTS.format) {
//     setStringOption(options, STRING_OPTIONS.FORMAT, cliOptions.format);
//   }

//   if (cliOptions.include && cliOptions.include.length > 0) {
//     setArrayOption(options, ARRAY_OPTIONS.PATTERNS, cliOptions.include);
//     setStringOption(options, STRING_OPTIONS.SELECTION_MODE, "include");
//   } else if (cliOptions.exclude && cliOptions.exclude.length > 0) {
//     setArrayOption(options, ARRAY_OPTIONS.PATTERNS, cliOptions.exclude);
//     setStringOption(options, STRING_OPTIONS.SELECTION_MODE, "exclude");
//   }

//   logger.verbose("set options: ", JSON.stringify(options, null, 2));

//   return options;
// }
