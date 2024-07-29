import { logger, LogLevel } from './utils/logger';
import { loadConfiguration as loadConfigurationVite } from './config/configLoader';

import { ProgramOptions } from './types/programOptions';
import { resolveGlobalPatterns } from './file_processing/globalPatternResolver';

export async function processCodebase(options: ProgramOptions): Promise<void> {
  logger.debug('Starting codebase processing');
  logger.debug(`Options: ${JSON.stringify(options, null, 2)}`);

  try {
    // 0. Set log level based on options
    if (options.debug) {
      logger.setLevel(LogLevel.Debug);
    } else if (options.verbose) {
      logger.setLevel(LogLevel.Verbose);
    }


    // 1. Configuration Loading
    const codebaseStruct = await loadConfigurationVite(options.config);

    if (!codebaseStruct || !codebaseStruct.options) {
      throw new Error('Invalid or empty configuration loaded');
    }

    // 2. Global Pattern Resolution
    const selectedFiles = await resolveGlobalPatterns(codebaseStruct.options);

    // 3. File Processing (placeholder)
    // TODO: Implement file processing logic

    // 4. Output Generation (placeholder)
    // TODO: Implement output generation logic

    logger.info('Processing completed successfully.');
  } catch (error: any) {
    logger.error(`An error occurred during codebase processing: ${error.message}`);
    logger.debug(`Stack trace: ${error.stack}`);
    throw error;
  }
}
