import { processCodebase } from "./processCodebase";
import { customOptions, ProgramOptions } from "./types/programOptions";
import { logger } from "./utils/logger";
import { cliParser } from "./utils/cliParser";
import { CodebaseStruct } from "./types/codebaseStruct";

// experimental custom parser
// - faster than native one
// - custom arg key names, i.e. <kebab-case> to <camelCase>
// - parsed options are already merged with defaults
const parseOptions = (): Partial<ProgramOptions> => {
  const { values } = cliParser(customOptions);
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
    logger.setLevels({
      Info: true,
      Debug: true,
      Verbose: true,
    });

    const options = parseOptions() as CodebaseStruct;

    // CLI mode
    if (!options?.config) {
      // 1. We can run CLI with args from CLI directly
      await processCodebase(options, "cli");
    } else if (options?.config) {
      // APP mode
      logger.info("APP_MODE");
      // // 1. > I: ProgamOptions, O: ConfigIndex
      // const configIndex = resolveCliOptions(options);

      // // 2. > I: ConfigIndex, O: CodebaseStructOptions
      // const codebaseStructOptions = translateConfigIndex(configIndex);

      // const config_type = options.config ? "app" : "cli";
      // await processCodebase(codebaseStructOptions, config_type);
    }

    const endTime = process.hrtime.bigint();
    const executionTime = Number(endTime - startTime) / 1e9;
    console.log(`Execution time: ${executionTime.toFixed(5)} s`);
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
};

main();
