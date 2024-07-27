import path from 'node:path';
import fs from 'node:fs/promises';
import { CodebaseStruct } from './codebaseStruct';
import { logger, LogLevel } from './utils/logger';
import { getFilePaths, formatFile } from './utils';

export async function processCodebase(
  options: any,
  inputCodebaseStruct?: CodebaseStruct
): Promise<void> {
  logger.debug('\n(F) processCodebase');
  logger.debug('--------------');
  logger.debug(`(P) options: ${JSON.stringify(options, null, 2)}`);
  logger.debug(`(P) inputCodebaseStruct: ${JSON.stringify(inputCodebaseStruct, null, 2)}`);

  const basePath = options.input || process.cwd();
  const globalOutput = options.output || 'cotext_output.md';
  const format = options.format || 'md';
  const warnings: string[] = [];
  const processedFiles: Set<string> = new Set();

  if (options.verbose) {
    logger.setLevel(LogLevel.Verbose);
  }
  if (options.debug) {
    logger.setLevel(LogLevel.Debug);
  }

  let codebaseStruct = inputCodebaseStruct
  if (!codebaseStruct) {
    logger.warn('No codebase structure provided. Using default configuration.');
    codebaseStruct = {
      options: { name: 'Default Codebase', baseUrl: '.', format: 'ts' },
      paths: [{ path: '.' }]
    };
  }

  const { options: structOptions, paths } = codebaseStruct;
  const baseUrl = structOptions?.baseUrl ? path.resolve(basePath, structOptions.baseUrl) : basePath;

  for (const pathConfig of paths) {
    try {
      logger.info(`Processing path: ${pathConfig.path}`);
      const filePaths = await getFilePaths(baseUrl, pathConfig, structOptions);

      if (filePaths.length === 0) {
        logger.warn(`No files found for path: ${pathConfig.path}`);
        continue;
      }

      logger.info(`Found ${filePaths.length} files to process.`);

      const formattedContent = await Promise.all(
        filePaths.map(async (filePath) => {
          try {
            return await formatFile(filePath, pathConfig.format || structOptions?.format || 'txt');
          } catch (error: any) {
            logger.error(`Error formatting file ${filePath}: ${error.message}`);
            return '';
          }
        })
      );

      const validContent = formattedContent.filter(content => content !== '');

      if (validContent.length === 0) {
        logger.warn(`No valid content generated for path: ${pathConfig.path}`);
        continue;
      }

      const outputContent = `${validContent.join('\n\n')}\n`;

      const outputPath = pathConfig.explicit
        ? path.resolve(baseUrl, pathConfig.output || `${pathConfig.path}.${format}`)
        : path.resolve(baseUrl, globalOutput);

      const writeMethod = processedFiles.has(outputPath) ? fs.appendFile : fs.writeFile;
      await writeMethod(outputPath, outputContent);
      processedFiles.add(outputPath);

      logger.info(`Processed ${validContent.length} files for path: ${pathConfig.path}`);
      logger.info(`Output written to: ${outputPath}`);

    } catch (error: any) {
      logger.error(`Error processing path ${pathConfig.path}: ${error.message}`);
      warnings.push(`Failed to process path: ${pathConfig.path}`);
    }
  }

  if (warnings.length > 0) {
    logger.warn('Processing completed with warnings:');
    // biome-ignore lint/complexity/noForEach: <explanation>
    warnings.forEach(warning => logger.warn(`- ${warning}`));
  } else {
    logger.info('Processing completed successfully.');
  }

  logger.info(`Total output files generated: ${processedFiles.size}`);
  // biome-ignore lint/complexity/noForEach: <explanation>
  processedFiles.forEach(file => logger.info(`- ${file}`));
}
