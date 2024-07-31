import { logger, LogLevel } from '../docs/output/logger_testing/logging_syntax';
import { loadConfiguration } from './config/configLoader';
import { ProgramOptions } from './types/programOptions';
import { resolveGlobalPatterns } from './file_processing/globalPatternResolver';
import { processFiles } from './file_processing/fileProcessor';
import path from 'node:path';

export async function processCodebase(options: ProgramOptions): Promise<void> {
  const errors: Error[] = [];
  const logLevels = logger.getLevels()

  try {
    // Set log level based on options
    const log_settings = ({ Info: true, Debug: options.debug, Verbose: false })
    // const log_ndv = ({ Info: true, Debug: true, Verbose: true })
    // const log_nd = ({ Info: true, Debug: true })
    logger.setLevels(log_settings);
    // logger.setLevel(options.debug ? LogLevel.Debug : LogLevel.Info);

    logger.header('Starting codebase processing');
    // logger.infoObj("CLI Options: ", options);
    logger.verbose("CLI Options: ", options);

    // 1. Configuration Loading
    logger.step('1. Configuration Loading');
    const codebaseStruct = await loadConfiguration(options.config);

    if (!codebaseStruct || !codebaseStruct.options) {
      throw new Error('Invalid or empty configuration loaded');
    }

    // 2. Global Pattern Resolution
    logger.step('2. Selecting Files');
    const selectedFiles = await resolveGlobalPatterns(codebaseStruct.options, options.patternMatch);

    // 3. File Processing and Aggregation
    logger.step('3. File Processing and Aggregation');
    const { totalCharacters } = await processFiles(selectedFiles, codebaseStruct.options);

    // 4. Display results
    logger.step('4. Processing Results:');

    if (logger.getLevels().Verbose) {
      logger.verbose('Selected files:');
      const baseDir = process.cwd();
      for (const file of selectedFiles) {
        logger.info(`- ${path.relative(baseDir, file)}`);
      }
    } else {
      if (selectedFiles.length > 0) {
        logger.status("ok", "info");
      }
    }

    // 5. Summary
    logger.step('5. Summary:');
    logger.info(`- Files linked: ${selectedFiles.length}`);
    logger.info(`- Total output characters: ${totalCharacters}`);

  } catch (error: any) {
    logger.error(`An error occurred during codebase processing: ${error.message}`);
    logger.debug(`Stack trace: ${error.stack}`);
    errors.push(error);
  }

  // Show alternative options
  if (!logLevels.Verbose) {
    logger.info("\n[Details hidden, use --verbose to show]");
  }

  // Display total process status
  if (errors.length > 0) {
    logger.status("Completion with errors.", "error");
    logger.error('\nErrors encountered during processing:');
    logger.error('---------------------------------------');
    errors.forEach((error, index) => {
      logger.error(`Error ${index + 1}:`);
      logger.error(`  Message: ${error.message}`);
      if (options.debug) {
        logger.error(`  Stack: ${error.stack}`);
      }
      logger.error('');
    });
  } else {
    logger.status("Completed successfully.", "success");
  }
}
