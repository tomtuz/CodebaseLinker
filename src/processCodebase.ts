import { logger, LogLevel } from './utils/logger';
import { loadConfiguration } from './config/configLoader';
import { ProgramOptions } from './types/programOptions';
import { resolveGlobalPatterns } from './file_processing/globalPatternResolver';
import { processFiles } from './file_processing/fileProcessor';
import path from 'node:path';

export async function processCodebase(options: ProgramOptions): Promise<void> {
  const errors: Error[] = [];

  try {
    logger.debug('options: ', options);
    // Set log level based on options
    logger.setLevel(options.debug ? LogLevel.Debug : LogLevel.Normal);

    logger.debug('Starting codebase processing');
    logger.debug(`Options: ${JSON.stringify(options, null, 2)}`);

    // 1. Configuration Loading
    logger.debug('\n1. Configuration Loading');
    const codebaseStruct = await loadConfiguration(options.config);

    if (!codebaseStruct || !codebaseStruct.options) {
      throw new Error('Invalid or empty configuration loaded');
    }

    // 2. Global Pattern Resolution
    logger.debug('\n2. Global Pattern Resolution');
    const selectedFiles = await resolveGlobalPatterns(codebaseStruct.options, options.patternMatch);

    // 3. File Processing and Aggregation
    logger.debug('\n3. File Processing and Aggregation');
    const { totalCharacters } = await processFiles(selectedFiles, codebaseStruct.options);

    // Display results
    logger.info('\nProcessing Results:');
    logger.info('-------------------');
    logger.info('Selected files:');
    const baseDir = process.cwd();
    // biome-ignore lint/complexity/noForEach: <explanation>
    selectedFiles.forEach(file => {
      logger.info(`- ${path.relative(baseDir, file)}`);
    });
    logger.info(`\nTotal files selected: ${selectedFiles.length}`);
    logger.info(`Total output characters: ${totalCharacters}`);

  } catch (error: any) {
    logger.error(`An error occurred during codebase processing: ${error.message}`);
    logger.debug(`Stack trace: ${error.stack}`);
    errors.push(error);
  }

  // Display errors at the end
  if (errors.length > 0) {
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
    logger.info('\nProcessing completed successfully.');
  }
}
