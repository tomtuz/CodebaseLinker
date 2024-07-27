import { Command } from 'commander';
import { processCodebase } from './processCodebase';
import { loadStructFile } from './config/configLoader';
import { logger, LogLevel } from './utils/logger';
import { initializeProject } from './init/projectInitializer';
import packageJson from '../package.json';
import path from 'node:path';

const program = new Command();

program
  .name('cotext')
  .version(packageJson.version)
  .description('A CLI tool to aggregate codebase files for context generation');

program
  .command('init')
  .description('Initialize a new cotext project')
  .option('-p, --path <directory>', 'Project directory')
  .option('--js', 'Use JavaScript instead of TypeScript for configuration')
  .action(async (options) => {
    try {
      await initializeProject(options.path, !!options.js);
      logger.info('Cotext project initialized successfully!');
    } catch (error: any) {
      logger.error(`Failed to initialize project: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('generate', { isDefault: true })
  .description('Generate codebase context')
  .option('-c, --config <file>', 'Path to the configuration file')
  .option('-i, --input <directory>', 'Input directory')
  .option('-o, --output <file>', 'Output file name', 'cotext_output.md')
  .option('-f, --format <format>', 'Output format (md, json, yaml)', 'md')
  .option('--no-default-ignores', 'Disable default ignore patterns')
  .option('-v, --verbose', 'Enable verbose output')
  .option('-d, --debug', 'Enable debug output')
  .action(async (options) => {
    if (options.verbose) {
      logger.setLevel(LogLevel.Verbose);
    }
    if (options.debug) {
      logger.setLevel(LogLevel.Debug);
    }

    try {
      const configPath = options.config ? path.resolve(process.cwd(), options.config) : undefined;
      const codebaseStruct = await loadStructFile(configPath);
      await processCodebase(options, codebaseStruct);
    } catch (error: any) {
      logger.error(`An error occurred: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
