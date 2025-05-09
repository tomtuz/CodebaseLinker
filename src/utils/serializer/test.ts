// @ts-nocheck
import { ProgramOptions } from "@/types/programOptions";
import { CLI_DEFAULTS, DEFAULT_CONFIG } from "@/defaults/defaultConfig";
import { CodebaseStructOptions } from "@/types/codebaseStruct";
import {
  getBooleanOption,
  getStringOption,
  getArrayOption,
} from "./serializer/configOperations";
import {
  ConfigIndex,
  STRING_OPTIONS,
  ARRAY_OPTIONS,
  BOOLEAN_OPTIONS,
} from "./serializer/configTypes";
import { logger } from "../logger";
import {
  setBooleanOption,
  setStringOption,
  setArrayOption,
} from "./configOperations";
import { optionDefinitions } from "./configTypes";

export type ResolvedConfig = {
  cli: Partial<ProgramOptions>;
  app: CodebaseStructOptions;
};

class ConfigIndexManager {
  createConfigIndex(): ConfigIndex {
    return {
      booleans: new Uint8Array(BOOLEAN_OPTIONS.COUNT),
      strings: new Array(STRING_OPTIONS.COUNT).fill(null),
      arrays: new Array(ARRAY_OPTIONS.COUNT).fill(null),
      changedFlags: new Uint32Array(3),
    };
  }

  translateConfigIndex(configIndex: ConfigIndex): CodebaseStructOptions {
    return {
      input: configIndex.input,
      output: configIndex.output,
      format: configIndex.format,
      include: configIndex.include,
      exclude: configIndex.exclude,
      verbose: configIndex.verbose,
      debug: configIndex.debug,
      patternMatch: configIndex.patternMatch,
      logs: configIndex.logs,
      patternLogs: configIndex.patternLogs,
      config: configIndex.config,
    };
  }

  serializeConfigIndex(configIndex: ConfigIndex): string {
    return JSON.stringify({
      b: Array.from(configIndex.booleans),
      s: configIndex.strings,
      a: configIndex.arrays,
      f: Array.from(configIndex.changedFlags),
    });
  }

  deserializeConfigIndex(serialized: string): ConfigIndex {
    const data = JSON.parse(serialized);
    return {
      booleans: new Uint8Array(data.b),
      strings: data.s,
      arrays: data.a,
      changedFlags: new Uint32Array(data.f),
    };
  }
}

export function resolveConfig(cliOptions: Partial<ConfigIndex>): ConfigIndex {
  return {
    ...CLI_DEFAULTS,
    ...Object.fromEntries(
      Object.entries(cliOptions).filter(([_, value]) => value !== undefined),
    ),
  };
}

function mergeConfig(
  cliOptions: Partial<ProgramOptions>,
): CodebaseStructOptions {
  const mergedConfig: CodebaseStructOptions = { ...DEFAULT_CONFIG.options };
  for (const [key, value] of Object.entries(cliOptions)) {
    const typedKey = key as keyof ProgramOptions;
    if (key in mergedConfig && value !== CLI_DEFAULTS[typedKey]) {
      (mergedConfig as any)[typedKey] = value;
    }
  }
  return mergedConfig;
}

export function resolveConfig2(
  cliOptions: Partial<ProgramOptions>,
): ResolvedConfig {
  const resolvedCli: Partial<ProgramOptions> = {};
  const resolvedApp: CodebaseStructOptions = { ...DEFAULT_CONFIG.options };

  // Resolve CLI options
  for (const key in cliOptions) {
    if (Object.prototype.hasOwnProperty.call(cliOptions, key)) {
      const typedKey = key as keyof ProgramOptions;
      const cliValue = cliOptions[typedKey];
      const defaultValue = CLI_DEFAULTS[typedKey];
      if (cliValue !== undefined && cliValue !== defaultValue) {
        (resolvedCli as any)[typedKey] = cliValue;
      }
    }
  }

  // Merge CLI options into app config
  for (const key in resolvedCli) {
    if (Object.prototype.hasOwnProperty.call(resolvedCli, key)) {
      const typedKey = key as keyof CodebaseStructOptions &
        keyof ProgramOptions;
      if (typedKey in resolvedApp) {
        (resolvedApp as any)[typedKey] = resolvedCli[typedKey];
      }
    }
  }

  return { cli: resolvedCli, app: resolvedApp };
}

export function translateVector(vector: ConfigIndex): CodebaseStructOptions {
  return {
    input: vector.input,
    output: vector.output,
    format: vector.format,
    include: vector.include,
    exclude: vector.exclude,
    verbose: vector.verbose,
    debug: vector.debug,
    patternMatch: vector.patternMatch,
    logs: vector.logs,
    patternLogs: vector.patternLogs,
    config: vector.config,
  };
}

type ConfigKey = keyof CodebaseStructOptions;

export function createConfig(
  cliOptions: Partial<ProgramOptions>,
): CodebaseStructOptions {
  const mergedConfig: CodebaseStructOptions = { ...DEFAULT_CONFIG.options };

  // Merge CLI options with default config
  for (const [key, value] of Object.entries(cliOptions) as [
    keyof ProgramOptions,
    any,
  ][]) {
    if (key in mergedConfig && value !== CLI_DEFAULTS[key]) {
      (mergedConfig as any)[key] = value;
    }
  }

  // Create a proxy to handle potential future fields in CodebaseStructOptions
  return new Proxy(mergedConfig, {
    get: (target, prop: ConfigKey) => {
      if (prop in target) {
        return target[prop];
      }
      // Fall back to DEFAULT_CONFIG for properties not set by CLI
      return DEFAULT_CONFIG.options[prop];
    },
  });
}

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
): CodebaseStructOptions {
  return createConfig(cliOptions);
}

export function resolveCliOptions2(cliOptions: ProgramOptions): ConfigIndex {
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

export function serializeConfigIndex(configIndex: ConfigIndex): string {
  return JSON.stringify({
    b: Array.from(configIndex.booleans),
    s: configIndex.strings,
    a: configIndex.arrays,
    f: Array.from(configIndex.changedFlags),
  });
}

export function deserializeConfigIndex(serialized: string): ConfigIndex {
  const data = JSON.parse(serialized);
  return {
    booleans: new Uint8Array(data.b),
    strings: data.s,
    arrays: data.a,
    changedFlags: new Uint32Array(data.f),
  };
}
