import { logger } from "@/utils/logger";
import { resolveGlobalPatterns } from "./file_processing/globalPatternResolver";
import { processFiles } from "./file_processing/fileProcessor";
import path from "node:path";
import { createLogWriter, LogWriter } from "./utils/logWriter";
import { VectorizedOptions } from "./utils/serializer/configTypes";
import {
  resolveCliOptions,
  translateVector,
} from "./utils/serializer/optionResolver";

export async function processCodebase(
  vectorConfig: VectorizedOptions,
): Promise<void> {
  const errors: Error[] = [];
  const logLevels = logger.getLevels();
  let patternLogWriter: LogWriter | null = null;

  // 0. Config options are pre-handled and correct
  const defaultConfig = translateVector(vectorConfig);
  // const defaultConfig = resolveCliOptions(vectorConfig);

  try {
    // Set log level based on options
    const log_settings = {
      Info: true,
      Debug: defaultConfig.debug,
      Verbose: defaultConfig.verbose,
    };
    logger.setLevels(log_settings);

    logger.header("Starting codebase processing");
    logger.verbose("CLI Options: ", defaultConfig);

    // Initialize pattern log writer if pattern-match is enabled
    if (defaultConfig.patternMatch) {
      patternLogWriter = createLogWriter(
        defaultConfig.patternLogs || "cotext.pattern.logs",
      );
    }

    const configSupplied = !!defaultConfig.config;
    const fileConfig = defaultConfig;

    // TODO: re-enable
    // const fileConfig = configSupplied
    //   ? await loadConfiguration(defaultConfig.config, defaultConfig.baseUrl)
    //   : defaultConfig;

    // let fileConfig = {};
    if (configSupplied) {
      logger.step("1. Configuration Loading");

      if (!fileConfig) {
        throw new Error("Invalid or empty configuration loaded");
      }
    } else {
      logger.step("1. Using Default Configuration");
    }

    // 2. Global Pattern Resolution
    logger.step("2. Selecting Files");
    const selectedFiles = await resolveGlobalPatterns(fileConfig);

    // 2.5 Resolve File Paths
    const baseDir = process.cwd();
    const relativePaths = selectedFiles.map((file) =>
      path.relative(baseDir, file),
    );

    // 3. File Processing and Aggregation
    logger.step("3. File Processing and Aggregation");
    const { totalCharacters } = await processFiles(
      relativePaths,
      selectedFiles,
      fileConfig,
    );
    logger.info(`Total characters processed: ${totalCharacters}`);
  } catch (error: any) {
    errors.push(error);
  }

  // Show alternative options
  if (!logLevels.Verbose) {
    logger.info("\n[Details hidden, use --verbose to show]");
  }

  // Display total process status
  if (errors.length > 0) {
    logger.status("Completion with errors.", "error");
    logger.error("\nErrors encountered during processing:");
    logger.error("---------------------------------------");
    errors.forEach((error, index) => {
      logger.error(`Error ${index + 1}:`);
      logger.error(`  Message: ${error.message}`);
      if (defaultConfig.debug) {
        logger.error(`  Stack trace: ${error.stack}`);
      }
      logger.error("");
    });
  } else {
    logger.status("Completed successfully.", "success");
  }

  if (defaultConfig.patternMatch) {
    logger.info(
      `Pattern match logs have been saved to: ${defaultConfig.patternLogs || "cotext.pattern.logs"}`,
    );
  }
}
