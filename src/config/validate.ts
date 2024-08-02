import { CodebaseStructSchema } from './schema.js';
import { logger } from '@/utils/logger';

export async function validateConfig(configObj: any): Promise<boolean> {
  const result = CodebaseStructSchema.safeParse(configObj);
  if (!result.success) {
    logger.error('Config validation failed:');
    for (const issue of result.error.issues) {
      logger.error(`- ${issue.path.join('.')}: ${issue.message}`);
    };
    logger.debug(`Full error details: ${JSON.stringify(result.error, null, 2)}`);
    return false;
  }
  return true;
}
