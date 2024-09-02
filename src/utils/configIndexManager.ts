import { ProgramOptions } from "@/types/programOptions";
import { CLI_DEFAULTS, DEFAULT_CONFIG } from "@/defaults/defaultConfig";
import { CodebaseStructOptions } from "@/types/codebaseStruct";
import {
  ConfigIndex,
  STRING_OPTIONS,
  ARRAY_OPTIONS,
  BOOLEAN_OPTIONS,
} from "./serializer/configTypes";
import { createHash } from "node:crypto";
import {
  getStringOption,
  getArrayOption,
  getBooleanOption,
} from "./serializer/configOperations";

export type ResolvedConfig = {
  cli: Partial<ProgramOptions>;
  app: CodebaseStructOptions;
};

export function translateConfigIndex(
  configIndex: ConfigIndex,
): CodebaseStructOptions {
  return {
    config:
      getStringOption(configIndex, STRING_OPTIONS.CONFIG) ??
      DEFAULT_CONFIG.options.config,
    name:
      getStringOption(configIndex, STRING_OPTIONS.NAME) ??
      DEFAULT_CONFIG.options.name,
    patterns:
      getArrayOption(configIndex, ARRAY_OPTIONS.PATTERNS) ??
      DEFAULT_CONFIG.options.patterns,
    baseUrl:
      getStringOption(configIndex, STRING_OPTIONS.BASE_URL) ??
      DEFAULT_CONFIG.options.baseUrl,
    output:
      getStringOption(configIndex, STRING_OPTIONS.OUTPUT) ??
      DEFAULT_CONFIG.options.output,
    format:
      getStringOption(configIndex, STRING_OPTIONS.FORMAT) ??
      DEFAULT_CONFIG.options.format,
    selectionMode:
      getStringOption(configIndex, STRING_OPTIONS.SELECTION_MODE) ??
      (DEFAULT_CONFIG.options
        .selectionMode as CodebaseStructOptions["selectionMode"]),
    verbose:
      getBooleanOption(configIndex, BOOLEAN_OPTIONS.VERBOSE) ??
      DEFAULT_CONFIG.options.verbose,
    debug:
      getBooleanOption(configIndex, BOOLEAN_OPTIONS.DEBUG) ??
      DEFAULT_CONFIG.options.debug,
    patternMatch:
      getBooleanOption(configIndex, BOOLEAN_OPTIONS.PATTERN_MATCH) ??
      DEFAULT_CONFIG.options.patternMatch,
  };
}

export function isDefaultConfig(config: ResolvedConfig): boolean {
  return Object.keys(config.cli).length === 0;
}

const configCache = new Map<string, ResolvedConfig>();

function hashConfig(config: Partial<ProgramOptions>): string {
  const hash = createHash("md5");
  hash.update(JSON.stringify(config));
  return hash.digest("hex");
}

// ---- TODO: cleanup ---

// export function createConfigIndex(config: ResolvedConfig): ConfigIndex {
//   const booleanFlags = new Uint8Array(1);
//   const strings: (string | null)[] = new Array(STRING_OPTIONS.COUNT).fill(null);
//   const arrays: (string[] | null)[] = new Array(ARRAY_OPTIONS.COUNT).fill(null);

//   // Set boolean options using bitwise operations
//   if (config.app.debug) booleanFlags[0] |= 1 << BOOLEAN_OPTIONS.DEBUG;
//   if (config.app.verbose) booleanFlags[0] |= 1 << BOOLEAN_OPTIONS.VERBOSE;
//   if (config.app.patternMatch)
//     booleanFlags[0] |= 1 << BOOLEAN_OPTIONS.PATTERN_MATCH;

//   // Set string options
//   strings[STRING_OPTIONS.CONFIG] = config.app.config ?? null;
//   strings[STRING_OPTIONS.OUTPUT] = config.app.output ?? null;
//   strings[STRING_OPTIONS.FORMAT] = config.app.format ?? null;
//   strings[STRING_OPTIONS.PATTERN_LOGS] = config.app.patternLogs ?? null;

//   // Set array options
//   arrays[ARRAY_OPTIONS.INCLUDE] = config.app.include ?? null;
//   arrays[ARRAY_OPTIONS.EXCLUDE] = config.app.exclude ?? null;

//   return { booleanFlags, strings, arrays };
// }

// export function translateConfigIndex(
//   configIndex: ConfigIndex,
// ): CodebaseStructOptions {
//   return {
//     config: configIndex.strings[STRING_OPTIONS.CONFIG] ?? undefined,
//     output: configIndex.strings[STRING_OPTIONS.OUTPUT] ?? "",
//     format: configIndex.strings[STRING_OPTIONS.FORMAT] as any,
//     include: configIndex.arrays[ARRAY_OPTIONS.INCLUDE] ?? undefined,
//     exclude: configIndex.arrays[ARRAY_OPTIONS.EXCLUDE] ?? undefined,
//     verbose: !!(configIndex.booleanFlags[0] & (1 << BOOLEAN_OPTIONS.VERBOSE)),
//     debug: !!(configIndex.booleanFlags[0] & (1 << BOOLEAN_OPTIONS.DEBUG)),
//     patternMatch: !!(
//       configIndex.booleanFlags[0] &
//       (1 << BOOLEAN_OPTIONS.PATTERN_MATCH)
//     ),
//     patternLogs: configIndex.strings[STRING_OPTIONS.PATTERN_LOGS] ?? undefined,
//     baseUrl: "", // This needs to be set separately
//   };
// }

// Assuming the necessary imports and definitions for STRING_OPTIONS, ARRAY_OPTIONS, BOOLEAN_OPTIONS, ConfigIndex, and CodebaseStructOptions are in place

// export function resolveConfig(configIndex: ConfigIndex): CodebaseStructOptions {
//   const booleanFlags = configIndex.booleans; // Corrected from booleanFlags to booleans
//   const strings = configIndex.strings;
//   const arrays = configIndex.arrays;

//   return {
//     config: strings[STRING_OPTIONS.CONFIG] ?? undefined,
//     include: arrays[ARRAY_OPTIONS.INCLUDE] ?? undefined,
//     exclude: arrays[ARRAY_OPTIONS.EXCLUDE] ?? undefined,
//     output: strings[STRING_OPTIONS.OUTPUT] ?? "",
//     format: strings[STRING_OPTIONS.FORMAT] as any,
//     verbose: !!(booleanFlags[0] & (1 << BOOLEAN_OPTIONS.VERBOSE)),
//     debug: !!(booleanFlags[0] & (1 << BOOLEAN_OPTIONS.DEBUG)),
//     patternMatch: !!(booleanFlags[0] & (1 << BOOLEAN_OPTIONS.PATTERN_MATCH)),
//     patternLogs: strings[STRING_OPTIONS.PATTERN_LOGS] ?? undefined,
//     baseUrl: "", // This needs to be set separately
//     selectionMode: "default", // Assuming a default value for selectionMode
//     patterns: [], // Assuming a default value for patterns
//   };
// }
