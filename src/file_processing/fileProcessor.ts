import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../utils/logger';
import { CodebaseStructOptions } from '../types/codebaseStruct';

// export async function processFiles(filePaths: string[], options: CodebaseStructOptions): Promise<void> {
//   logger.debug('Starting file processing and aggregation');

//   // 3.1 Iterate Over Selected Files
//   logger.debug('3.1 Iterate Over Selected Files');
//   const processedContents: string[] = [];

//   for (const filePath of filePaths) {
//     try {
//       // 3.2 Read File Contents
//       logger.debug(`3.2 Read File Contents: ${filePath}`);
//       const content = await fs.readFile(filePath, 'utf-8');

//       // 3.3 Apply Formatting Rules
//       logger.debug(`3.3 Apply Formatting Rules: ${filePath}`);
//       const formattedContent = formatContent(filePath, content, options.format);

//       // 3.4 Content Aggregation
//       logger.debug(`3.4 Content Aggregation: ${filePath}`);
//       processedContents.push(formattedContent);

//       logger.info(`Successfully processed: ${filePath}`);
//     } catch (error) {
//       if (error instanceof FileReadError || error instanceof FormattingError) {
//         logger.error(`Error processing ${filePath}: ${error.message}`);
//       } else {
//         logger.error(`Unexpected error processing ${filePath}: ${error}`);
//       }
//     }
//   }

export async function processFiles(filePaths: string[], options: CodebaseStructOptions): Promise<{ totalCharacters: number }> {
  logger.debug('Starting file processing and aggregation');

  let totalCharacters = 0;
  const processedContents: string[] = [];

  for (const filePath of filePaths) {
    try {
      logger.debug(`Processing file: ${filePath}`);
      const content = await fs.readFile(filePath, 'utf-8');
      const formattedContent = formatContent(filePath, content, options.format);
      processedContents.push(formattedContent);
      totalCharacters += formattedContent.length;
      logger.debug(`Successfully processed: ${filePath}`);
    } catch (error) {
      logger.error(`Error processing ${filePath}: ${error}`);
    }
  }

  const outputPath = path.resolve(process.cwd(), options.output || 'codebase-context.md');
  try {
    await fs.writeFile(outputPath, processedContents.join('\n\n'));
    logger.info(`Output written to: ${outputPath}`);
  } catch (error) {
    logger.error(`Failed to write output file: ${error}`);
  }

  return { totalCharacters };
}


// // 3.5 Output Generation
// logger.debug('3.5 Output Generation');
// const outputPath = path.resolve(process.cwd(), options.output || 'codebase-context.md');
// try {
//   await fs.writeFile(outputPath, processedContents.join('\n\n'));
//   logger.info(`Output written to: ${outputPath}`);
// } catch (error) {
//   throw new OutputWriteError(`Failed to write output file: ${error}`);
// }

// // 3.6 Logging and Summary
// logger.debug('3.6 Logging and Summary');
// logger.info(`Total files processed: ${processedContents.length}`);
// logger.info(`Total output size: ${processedContents.join('\n\n').length} characters`);
// }

function formatContent(filePath: string, content: string, format = 'txt'): string {
  try {
    const relativeFilePath = path.relative(process.cwd(), filePath);
    const fileExtension = path.extname(filePath).slice(1) || format;

    return createCodeBlock(relativeFilePath, fileExtension, content)
  } catch (error) {
    throw new FormattingError(`Failed to format content for ${filePath}: ${error}`);
  }
}

function createCodeBlock(relativePath: string, format: string, content: string) {
  const wrap = "````"
  const codeBlock = {
    codeBlockHeader: `# ${relativePath}`,
    codeStart: `${wrap}${format}`,
    filePath: `// ${relativePath}`,
    content: content,
    codeEnd: `${wrap}`,
  };

  // return [
  //   `# ${relativePath}`,
  //   `\`\`\`\`${format}`,
  //   `// ${relativePath}`,
  //   content,
  //   '````\n'
  // ].join('\n');

  return Object.values(codeBlock).join('\n');
}

