import { logger } from "@/utils/logger";
import { resolveGlobalPatterns } from "./file_processing/globalPatternResolver";
import { processFiles } from "./file_processing/fileProcessor";
import path from "node:path";
import { createLogWriter, LogWriter } from "./utils/logWriter";
import { loadConfiguration } from "./config/configLoader";
import { DEFAULT_CONFIG } from "./defaults/defaultConfig";
import { isDefaultConfig } from "./utils/configIndexManager";
import { CodebaseStruct } from "@/types/codebaseStruct";

// Cache for loaded configurations
const configCache = new Map<string, CodebaseStruct>();

async function lazyLoadConfig(
  config: CodebaseStruct,
  config_type: string,
): Promise<CodebaseStruct> {
  if (config_type === "app") {
    const cacheKey = config?.config || "";

    if (configCache.has(cacheKey)) {
      const cachedConfig = configCache.get(cacheKey);
      if (cachedConfig) {
        return cachedConfig;
      }
    }

    logger.step("1. Loading Configuration File");
    const loadedConfig = await loadConfiguration(config.config, process.cwd());
    if (!loadedConfig) {
      throw new Error("Invalid or empty configuration loaded");
    }

    configCache.set(cacheKey, loadedConfig);
    return loadedConfig;
  }

  logger.step("1. Using Default Configuration");
  return DEFAULT_CONFIG;
}

export async function processCodebase(
  config: CodebaseStruct,
  config_type: string,
): Promise<void> {
  const errors: Error[] = [];

  try {
    // Set log level based on options
    logger.setLevels({
      Info: true,
      Debug: config.debug,
      Verbose: config.verbose,
    });

    logger.header(`Starting codebase processing - [${config_type}]`);
    logger.verbose("Config: ", config);

    // Lazy load configuration
    const fileConfig = await lazyLoadConfig(config, config_type);

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

    // Initialize pattern log writer only if needed
    if (config.patternMatch) {
      const patternLogWriter = createLogWriter(
        config.patternLogs || "cotext.pattern.logs",
      );
      logger.info(
        `Pattern match logs have been saved to: ${patternLogWriter.getFilePath()}`,
      );
    }
  } catch (error: any) {
    errors.push(error);
  }

  // Display total process status
  if (errors.length > 0) {
    logger.status("Completion with errors.", "error");
    logger.error("\nErrors encountered during processing:");
    logger.error("---------------------------------------");
    errors.forEach((error, index) => {
      logger.error(`Error ${index + 1}:`);
      logger.error(`  Message: ${error.message}`);
      if (config.debug) {
        logger.error(`  Stack trace: ${error.stack}`);
      }
      logger.error("");
    });
  } else {
    logger.status("Completed successfully.", "success");
  }

  // Show alternative options
  if (!config.verbose) {
    logger.info("\n[Details hidden, use --verbose to show]");
  }
}
