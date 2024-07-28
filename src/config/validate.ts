import { CodebaseStructSchema } from './schema.js';
import { logger } from '@/utils/logger';

/** Turn raw config values into normalized values */
export async function validateConfig(configObj: any): Promise<boolean> {
  const result = CodebaseStructSchema.safeParse(configObj);

  if (!result.success) {
    logger.error('Config validation failed:');
    for (const issue of result.error.issues) {
      logger.error(`- ${issue.path.join('.')}: ${issue.message}`);
    };

    return false;
  }

  logger.debug('Config validation successful');
  return true;
}
