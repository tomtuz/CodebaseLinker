import { CodebaseStruct } from './types/codebaseStruct';
import { logger, LogLevel } from './utils/logger';
import { loadConfiguration } from './config/configurationLoader';
import { loadConfiguration as loadConfigurationVite } from './config/configurationLoaderVite';

import { ProgramOptions } from './types/programOptions';

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
    // const codebaseStruct = await loadConfiguration(options.config);
    const codebaseStruct = await loadConfigurationVite(options.config);

    if (!codebaseStruct || !codebaseStruct.options) {
      throw new Error('Invalid or empty configuration loaded');
    }

    // 2. Global Pattern Resolution
    const globalPatterns = resolveGlobalPatterns(codebaseStruct.options);

    // 3. Path-specific File Aggregation & 4. File Processing
    const processedContent = await processAllPaths(codebaseStruct, globalPatterns, options);

    // 5. Output Generation
    await generateOutput(processedContent, codebaseStruct, options);

    // 6. Error Handling and Logging
    logSummary(processedContent);

    // 7. Cleanup
    // (Any necessary cleanup operations)

    logger.info('Processing completed successfully.');
  } catch (error: any) {
    logger.error(`An error occurred during codebase processing: ${error.message}`);
    logger.debug(`Stack trace: ${error.stack}`);
    throw error;
  }
}

// Helper functions (to be implemented)
function resolveGlobalPatterns(options: CodebaseStruct['options']) {
  // Implementation
}

async function processAllPaths(codebaseStruct: CodebaseStruct, globalPatterns: any, options: any) {
  // Implementation
}

async function generateOutput(processedContent: any, codebaseStruct: CodebaseStruct, options: any) {
  // Implementation
}

function logSummary(processedContent: any) {
  // Implementation
}
