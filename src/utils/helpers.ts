import packageJson from '@/../package.json';
import { logger } from '@/utils/logger';
import { join } from 'node:path';

export function isFilePathESM(
  filePath: string,
): boolean {
  if (/\.m[jt]s$/.test(filePath)) {
    logger.info("ESM(1): true")
    return true
  }

  if (/\.c[jt]s$/.test(filePath)) {
    logger.info("ESM(2): true")
    return false
  }

  // check package.json for type: "module"
  try {
    logger.info(`ESM: module === ${packageJson?.type}`)
    return packageJson?.type === 'module'
  } catch {
    logger.info("ESM: false")
    return false
  }
}

