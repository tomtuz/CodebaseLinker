import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadConfiguration } from '@/config/configLoader'
import { logger } from '@/utils/logger'
import {
  ConfigPathNotProvidedError,
  ConfigFileAccessError,
  ConfigParseError,
  InvalidConfigurationError,
} from '@/errors/ConfigurationErrors'
import * as loaderUtils from '@/config/loaderUtils'
import path from 'node:path'

vi.mock('@/utils/logger')
vi.mock('@/config/loaderUtils')

const fixturesPath = path.resolve(__dirname, '..', '..', 'fixtures', 'configs')

describe('loadConfiguration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(loaderUtils.isFileReadable).mockResolvedValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // 1. Config Path Validation
  it('should throw [ConfigPathNotProvidedError] if config path is not provided', async () => {
    await expect(loadConfiguration(undefined)).rejects.toThrow(ConfigPathNotProvidedError)
    expect(logger.error).toHaveBeenCalledWith('Config path not provided')
  })

  // 2. Config File Access
  it('should throw [ConfigFileAccessError] if file cannot be accessed', async () => {
    vi.mocked(loaderUtils.isFileReadable).mockRejectedValue(new Error('Cannot access file'))
    await expect(loadConfiguration('non_existent_config.js')).rejects.toThrow(ConfigFileAccessError)
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('File access error:'))
  })

  // 3. Config Parsing
  it('should throw [ConfigParseError] if file cannot be parsed', async () => {
    const invalidSyntaxPath = path.join(fixturesPath, 'non_existant.config.ts')
    await expect(loadConfiguration(invalidSyntaxPath)).rejects.toThrow(ConfigParseError)
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('File read error:'))
  })

  // 4. User Config Validation
  it('should throw [InvalidConfigurationError] if user config is invalid', async () => {
    const invalidConfigPath = path.join(fixturesPath, 'invalid.config.ts')
    await expect(loadConfiguration(invalidConfigPath)).rejects.toThrow(InvalidConfigurationError)
    expect(logger.error).toHaveBeenCalledWith('Invalid user configuration structure.')
  })

  // 5. Config Merging
  it('should merge user config with default config correctly', async () => {
    const validMergedConfigPath = path.join(fixturesPath, 'valid.config.ts')
    const result = await loadConfiguration(validMergedConfigPath)
    expect(result).toEqual(expect.objectContaining({
      options: expect.objectContaining({
        name: 'Codebase',
        format: 'tsx',
        baseUrl: '.',
        exclude: ['example']
      }),
      paths: expect.arrayContaining([
        expect.objectContaining({ path: './src' }),
        expect.objectContaining({ path: './tsconfig.json' }),
        expect.objectContaining({ path: './package.json' })
      ])
    }))
  })

  // 6. Final Config Validation
  it('should throw [InvalidConfigurationError] if merged config is invalid', async () => {
    const invalidMergedConfigPath = path.join(fixturesPath, 'invalid.config.ts')
    await expect(loadConfiguration(invalidMergedConfigPath)).rejects.toThrow(InvalidConfigurationError)
    expect(logger.error).toHaveBeenCalledWith('Invalid merged configuration structure')
  })

  // 7. Logging
  it('should log the final configuration', async () => {
    const invalidMergedConfigPath = path.join(fixturesPath, 'valid.config.ts')
    await loadConfiguration(invalidMergedConfigPath)
    expect(logger.debug).toHaveBeenCalledWith('Final configuration:', expect.any(String))
  })
})
