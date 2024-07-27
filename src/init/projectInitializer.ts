import path from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { logger } from '@/utils/logger';

function findPackageRoot(startDir: string): string {
  logger.debug('\n(F) findPackageRoot');
  logger.debug('--------------');
  logger.debug(`(P) startDir: ${startDir}`);

  let currentDir = startDir;
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error('Could not find package root');
}

export async function initializeProject(projectPath: string, useJs: boolean): Promise<void> {
  logger.debug('\n(F) initializeProject');
  logger.debug('--------------');
  logger.debug(`(P) projectPath: ${projectPath}`);
  logger.debug(`(P) useJs: ${projectPath}`);

  const resolvedPath = projectPath ? path.resolve(projectPath) : process.cwd();
  logger.info(`Resolved path: ${resolvedPath}`);
  logger.info(`Project path: ${projectPath}`);

  // Check if the path is a directory and has write permissions
  try {
    const stats = await fsPromises.stat(resolvedPath);
    if (!stats.isDirectory()) {
      throw new Error(`The specified path is not a directory: ${resolvedPath}`);
    }
    await fsPromises.access(resolvedPath, fs.constants.W_OK);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`The specified directory does not exist: ${resolvedPath}`);
    }

    if (error.code === 'EACCES') {
      throw new Error(`You don't have write permissions for the directory: ${resolvedPath}`);
    }

    throw error;
  }

  const cotextDir = path.join(resolvedPath, '.cotext');
  const gitExcludePath = path.join(resolvedPath, '.git', 'info', 'exclude');
  const configFileName = useJs ? 'cotext.config.js' : 'cotext.config.ts';
  const configPath = path.join(cotextDir, configFileName);



  // Check if .cotext folder already exists and is not empty
  try {
    const cotextContents = await fsPromises.readdir(cotextDir);
    if (cotextContents.length > 0) {
      throw new Error("The .cotext folder already exists and is not empty. Please remove its contents before initializing.");
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Create .cotext directory
  await fsPromises.mkdir(cotextDir, { recursive: true });


  // Update .git/info/exclude
  try {
    await fsPromises.appendFile(gitExcludePath, '\n.cotext\n');
    logger.info("Added .cotext to .git/info/exclude");
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      logger.warn("Could not find .git/info/exclude. The .cotext folder is not excluded from the repository. You may want to add it to your .gitignore manually.");
    } else {
      logger.error(`Failed to update .git/info/exclude: ${error.message}`);
    }
  }



  // Determine the package root directory
  const currentFilePath = fileURLToPath(import.meta.url);
  logger.info(`currentFilePath: ${currentFilePath}`);
  const packageRoot = findPackageRoot(path.dirname(currentFilePath));
  logger.info(`packageRoot: ${packageRoot}`);

  // Copy the appropriate config file
  // const defaultConfigPath = path.join(packageRoot, 'dist', 'defaults', configFileName);

  // Copy the appropriate config file
  const defaultConfigPath = path.join(packageRoot, 'src', 'defaults', configFileName);
  const defaultStructPath = path.join(packageRoot, 'src', 'defaults', 'codebaseStruct.ts');
  logger.info(`Copying from: ${defaultConfigPath}`);
  logger.info(`Copying to: ${configPath}`);


  try {
    await fsPromises.copyFile(defaultConfigPath, configPath);
    await fsPromises.copyFile(defaultStructPath, path.join(cotextDir, 'codebaseStruct.ts'));
  } catch (error: any) {
    logger.error(`Failed to copy config files: ${error.message}`);
    throw error;
  }

  // Copy type definitions if using TypeScript
  if (!useJs) {
    const typesPath = path.join(cotextDir, 'codebaseStruct.d.ts');
    const typesSourcePath = path.join(packageRoot, 'dist', 'codebaseStruct.d.ts');
    try {
      await fsPromises.copyFile(typesSourcePath, typesPath);
    } catch (error: any) {
      logger.error(`Failed to copy type definitions: ${error.message}`);
      throw error;
    }
  }

  logger.info(`Initialized Cotext project in ${resolvedPath}`);
}
