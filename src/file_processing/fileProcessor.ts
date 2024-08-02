import fs from 'node:fs/promises';
import path from 'node:path';
import { logger, OutputLevel } from '@/utils/logger';
import { CodebaseStructOptions } from '@/types/codebaseStruct';

export async function processFiles(relativePaths: string[], filePaths: string[], options: CodebaseStructOptions): Promise<{ totalCharacters: number }> {
  let totalCharacters = 0;
  const processedContents: string[] = [];

  // set codebase map
  processedContents.push(
    createCodeBlock("Project Directory Structure", "", relativePaths.join('\n'))
  )

  const baseDir = process.cwd();
  for (const filePath of filePaths) {
    try {
      logger.verbose(path.relative(baseDir, filePath));
      const content = await fs.readFile(filePath, 'utf-8');
      const formattedContent = formatContent(filePath, content, options.format);
      processedContents.push(formattedContent);
      totalCharacters += formattedContent.length;
    } catch (error) {
      logger.error(`Error processing ${filePath}: ${error}`);
    }
  }

  const outputPath = path.resolve(process.cwd(), options.output || 'codebase-context.md');
  if (logger.getLevels().Verbose) {
    logger.info('\n');
  }

  logger.info(`- Files linked: ${filePaths.length}`);
  logger.info(`- Total output characters: ${totalCharacters}`);
  logger.info(`Output written to: ${outputPath}`);

  try {
    await fs.writeFile(outputPath, processedContents.join('\n\n'));
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

