import { Command } from "commander";
import { processCodebase } from "./processCodebase";
import packageJson from "../package.json";
import { resolveCliOptions } from "./utils/resolveCli";
import { CLI_DEFAULTS } from "./defaults/defaultConfig";
// TODO: re-enable configuration file
// import { initializeProject } from "./init/projectInitializer";

const program = new Command();

program
  .name("cotext")
  .version(packageJson.version)
  .description("A CLI tool to aggregate codebase files for context generation")
  // CONFIG based configuration
  .option(
    "-c, --config <file>",
    "Path to the configuration file",
    CLI_DEFAULTS.config,
  )
  // CLI based configuration
  .option(
    "--include [types...]",
    "include file patterns CLI",
    CLI_DEFAULTS.include,
  )
  .option(
    "--exclude [types...]",
    "exclude file patterns CLI",
    CLI_DEFAULTS.exclude,
  )
  // Set remote path (BaseUrl)
  .option("-i, --input <directory>", "Input directory", CLI_DEFAULTS.input)
  // Formatting options
  .option("-o, --output <file>", "Output file name", CLI_DEFAULTS.output)
  .option(
    "-f, --format <format>",
    "Output format (md, json, yaml)",
    CLI_DEFAULTS.format,
  )
  // Output settings
  .option("-v, --verbose", "Enable verbose output", CLI_DEFAULTS.verbose)
  .option("-d, --debug", "Enable debug output", CLI_DEFAULTS.debug)
  .option(
    "--pattern-match",
    "Enable pattern match debugging",
    CLI_DEFAULTS.patternMatch,
  )
  .option("--logs <file>", "Save logs to a file", CLI_DEFAULTS.logs)
  .option(
    "--pattern-logs <file>",
    "Save pattern match logs to a file",
    CLI_DEFAULTS.patternLogs,
  )
  .action(async (options) => {
    try {
      const startTime = performance.now();
      const vectorizedOptions = resolveCliOptions(options);
      await processCodebase(vectorizedOptions);
      const endTime = performance.now();
      const result = ((endTime - startTime) / 1000).toFixed(5);
      console.log(`Execution time: ${result} ms`);
    } catch (error: any) {
      console.error(`An error occurred: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
