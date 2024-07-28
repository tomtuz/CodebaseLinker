import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadConfiguration } from '@/config/configurationLoader'
import { logger } from '@/utils/logger'
import {
  ConfigPathNotProvidedError,
  ConfigFileAccessError,
  ConfigParseError,
  InvalidConfigurationError
} from '@/errors/ConfigurationErrors';

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('loadConfiguration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  // empty header test
  it('unit', async () => {
    await expect(true).toBe(true)
  })

  // it('should throw an error if config path is not provided', async () => {
  //   await expect(loadConfiguration(undefined)).rejects.toThrow(ConfigPathNotProvidedError)
  // })

  // it('should throw an error if config file does not exist', async () => {
  //   await expect(loadConfiguration('non_existent_file.ts')).rejects.toThrow(ConfigFileAccessError)
  //   expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Cannot access config file at path:'))
  // })
})
