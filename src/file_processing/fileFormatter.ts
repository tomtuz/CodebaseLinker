import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../utils/logger';

export async function formatFile(filePath: string, format: string): Promise<string> {
  logger.debug('\n(F) formatFile');
  logger.debug('--------------');
  logger.debug(`(P) filePath: ${filePath}`);
  logger.debug(`(P) format: ${format}`);

  // use minimum of 4 backticks to prevent formatting issues
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    return [
      `# ${relativePath}`,
      `\`\`\`\`${format}`,
      `// ${relativePath}`,
      content,
      '````\n'
    ].join('\n');
  } catch (error: any) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}
