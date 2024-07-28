import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadConfiguration } from '@/config/configurationLoaderVite'
import { logger } from '@/utils/logger'
import {
  ConfigPathNotProvidedError,
  ConfigFileAccessError,
  ConfigParseError,
  InvalidConfigurationError,
  ConfigResolutionError
} from '@/errors/ConfigurationErrors'
import * as loaderUtils from '@/config/loaderUtils'
import path from 'node:path'
import { default_config, invalid_config, valid_config } from "@test/fixtures/configs"

vi.mock('@/utils/logger')
vi.mock('@/config/loaderUtils')

describe('loadConfiguration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // 1. Config Path Validation
  it('should throw [ConfigPathNotProvidedError] if config path is not provided', async () => {
    await expect(loadConfiguration(undefined)).rejects.toThrow(ConfigPathNotProvidedError)
  })

  // 2. Config File Access
  it('should throw [ConfigResolutionError] if config path cannot be resolved', async () => {
    const resolveSpy = vi.spyOn(path, 'resolve').mockImplementation(() => '');
    await expect(loadConfiguration('invalid/path')).rejects.toThrow(ConfigResolutionError);
    resolveSpy.mockRestore();
  })

  it('should throw [ConfigFileAccessError] if file cannot be accessed', async () => {
    vi.mocked(loaderUtils.isFileReadable).mockRejectedValue(new Error('Cannot access file'))
    await expect(loadConfiguration('inaccessible.config.js')).rejects.toThrow(ConfigFileAccessError)
  })

  // 3. Config Parsing
  it('should throw [ConfigParseError] if file cannot be parsed', async () => {
    vi.mock('path/to/config.js', () => {
      throw new SyntaxError('Unexpected token')
    })
    await expect(loadConfiguration('path/to/config.js')).rejects.toThrow(ConfigParseError)
  })

  // Step 4-5: Config Merging and Validation
  it('should [merge] and [validate] configuration correctly', async () => {
    const testConfigPath = 'tests/fixtures/configs/valid.config.ts'

    // Capture logs
    // const logs: string[] = []
    // vi.spyOn(logger, 'debug').mockImplementation((message) => logs.push(`DEBUG: ${message}`))
    // vi.spyOn(logger, 'error').mockImplementation((message) => logs.push(`ERROR: ${message}`))

    try {
      const result = await loadConfiguration(testConfigPath)
      expect(result.options.name).toBe('Codebase')
    } catch (error) {
      console.error('Test failed with error:', error)
      console.log('Captured logs:')
      // logs.forEach(log => console.log(log))
      throw error
    }

    // If the test passes, still log captured messages for debugging
    console.log('Captured logs:')
    // logs.forEach(log => console.log(log))
  })

  it('should throw [InvalidConfigurationError] if merged config is invalid', async () => {
    // Use the path to an actual test configuration file
    await expect(loadConfiguration('tests/fixtures/configs/invalid.config.ts')).rejects.toThrow(InvalidConfigurationError)
  })

  // 6. Logging
  it('should log the final configuration', async () => {
    const testConfigPath = 'tests/fixtures/configs/valid.config.ts'
    await loadConfiguration(testConfigPath)
    expect(logger.debug).toHaveBeenCalledWith('Final configuration:', expect.any(String))
  })
})
