import { parseArgs } from "node:util";
import { processCodebase } from "./processCodebase";
import { translateConfigIndex } from "./utils/configIndexManager";
import { CLI_DEFAULTS } from "./defaults/defaultConfig";
import { ProgramOptions } from "./types/programOptions";
import { resolveCliOptions } from "./utils/serializer/configTypes";

// Directly map configuration options to ProgramOptions
const parseOptions = (): Partial<ProgramOptions> => {
  const { values } = parseArgs({
    options: {
      config: { type: "string", short: "c", default: CLI_DEFAULTS.config },
      include: {
        type: "string",
        multiple: true,
        default: CLI_DEFAULTS.include,
      },
      exclude: {
        type: "string",
        multiple: true,
        default: CLI_DEFAULTS.exclude,
      },
      input: { type: "string", short: "i", default: CLI_DEFAULTS.input },
      output: { type: "string", short: "o", default: CLI_DEFAULTS.output },
      format: { type: "string", short: "f", default: CLI_DEFAULTS.format },
      verbose: { type: "boolean", short: "v", default: CLI_DEFAULTS.verbose },
      debug: { type: "boolean", short: "d", default: CLI_DEFAULTS.debug },
      "pattern-match": { type: "boolean", default: CLI_DEFAULTS.patternMatch },
      logs: { type: "string", default: CLI_DEFAULTS.logs },
      "pattern-logs": { type: "string", default: CLI_DEFAULTS.patternLogs },
    },
  });

  return values as Partial<ProgramOptions>;
};

const main = async () => {
  try {
    const startTime = process.hrtime.bigint();

    // old_approach
    // 1. > I: _, O:ProgramOptions
    // const options = parseOptions();
    // 2. > I: ProgamOptions, O: CodebaseStructOptions
    // const resolvedConfig = resolveConfig(options);
    // 3. > I: ResolvedConfig, O: ConfigIndex
    // const configIndex = createConfigIndex(resolvedConfig);

    const options = parseOptions();

    // 1. > I: ProgamOptions, O: ConfigIndex
    const configIndex = resolveCliOptions(options);

    // 2. > I: ConfigIndex, O: CodebaseStructOptions
    const codebaseStructOptions = translateConfigIndex(configIndex);

    const config_type = options.config ? "app" : "cli";
    await processCodebase(codebaseStructOptions, config_type);

    const endTime = process.hrtime.bigint();
    const executionTime = Number(endTime - startTime) / 1e9;
    console.log(`Execution time: ${executionTime.toFixed(5)} s`);
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
};

main();
