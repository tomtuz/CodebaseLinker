import { CodebaseStructSchema } from './schema.js';
import { logger } from '@/utils/logger';

export async function validateConfig(configObj: any): Promise<boolean> {
  logger.debug('Starting config validation');
  logger.debug(`Config object: ${JSON.stringify(configObj, null, 2)}`);

  const result = CodebaseStructSchema.safeParse(configObj);

  if (!result.success) {
    logger.error('Config validation failed:');
    for (const issue of result.error.issues) {
      logger.error(`- ${issue.path.join('.')}: ${issue.message}`);
    };
    logger.debug(`Full error details: ${JSON.stringify(result.error, null, 2)}`);
    return false;
  }

  logger.debug('Config validation successful');
  logger.debug(`Validated config: ${JSON.stringify(result.data, null, 2)}`);
  return true;
}
