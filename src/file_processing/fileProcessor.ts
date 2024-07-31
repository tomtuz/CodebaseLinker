import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '@/utils/logger';
import { CodebaseStructOptions } from '@/types/codebaseStruct';

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

