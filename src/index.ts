import { processCodebase } from "./processCodebase";
import { customOptions, ProgramOptions } from "./types/programOptions";
import { Logger } from "./utils/logger";
import { cliParser } from "./utils/cliParser";
import { CodebaseStruct } from "./types/codebaseStruct";

if (process.env.MODE_DEV) {
  console.log("\nENV values:");
  console.log(` - DEV_BUILD_DIR: ${process.env.DEV_BUILD_DIR}`);
  console.log(` - EXTERNAL_DIR: ${process.env.EXTERNAL_DIR}`);
  console.log(` - TEST_BUILD_DIR: ${process.env.TEST_BUILD_DIR}`);
  console.log(` - MODE_DEV: ${process.env.MODE_DEV}`);
  console.log(` - MODE_PROD: ${process.env.MODE_PROD}`);
}

// experimental custom parser
// experimental custom parser
// - faster than native one
// - custom arg key names, i.e. <kebab-case> to <camelCase>
// - parsed options are already merged with defaults
const parseOptions = (): Partial<ProgramOptions> => {
  const { values } = cliParser(customOptions);
  return values as Partial<ProgramOptions>;
};

// const logger = new Logger("index");
const logger = new Logger("index", {
  Info: true,
  Debug: false,
  Verbose: false
});

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
    const options = parseOptions() as CodebaseStruct;
    logger.verbose("\nParsed options: ", options);

    // CLI mode
    if (!options?.config) {
      // 1. We can run CLI with args from CLI directly
      await processCodebase(options, "cli");
    } else if (options?.config) {
      // APP mode
      logger.info("APP_MODE (OFF)");
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
