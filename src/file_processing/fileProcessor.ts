import fs from 'node:fs/promises';
import path from 'node:path';
import { logger, LogLevel } from '../../docs/output/logger_testing/logging_syntax';
import { CodebaseStructOptions } from '@/types/codebaseStruct';

export async function processFiles(filePaths: string[], options: CodebaseStructOptions): Promise<{ totalCharacters: number }> {
  let totalCharacters = 0;
  const processedContents: string[] = [];

  for (const filePath of filePaths) {
    try {
      logger.verbose(filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      const formattedContent = formatContent(filePath, content, options.format);
      processedContents.push(formattedContent);
      totalCharacters += formattedContent.length;
    } catch (error) {
      logger.error(`Error processing ${filePath}: ${error}`);
    }
  }

  const outputPath = path.resolve(process.cwd(), options.output || 'codebase-context.md');
  try {
    await fs.writeFile(outputPath, processedContents.join('\n\n'));
    logger.info(`\nOutput written to: ${outputPath}`);
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

  return Object.values(codeBlock).join('\n');
}

