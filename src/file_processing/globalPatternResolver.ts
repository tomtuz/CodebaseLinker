import { DEFAULT_EXCLUSIONS } from "@/utils/defaultPatterns";
import { CodebaseStructOptions } from "@/types/codebaseStruct";
import { logger } from "@/utils/logger";
import fastGlob from "fast-glob";
import path from "node:path";
import { minimatch } from "minimatch";
import {
  SelectionModeError,
  PatternError,
  FileResolutionError,
} from "@/errors/GlobErrors";
// import { LogWriter } from "@/utils/logWriter";

// function logPatternMatch(
//   file: string,
//   pattern: string,
//   matched: boolean,
//   patternLogWriter: LogWriter | null,
// ) {
//   const logMessage = `File: ${file}\n  Pattern: ${pattern}\n  Matched: ${matched}\n`;
//   if (patternLogWriter) {
//     patternLogWriter.writeLog(logMessage);
//   } else {
//     logger.info(logMessage);
//   }
// }

export async function resolveGlobalPatterns(
  fileConfig: CodebaseStructOptions,
): Promise<string[]> {
  // 2. Global Pattern Resolution
  // 2.1 Determine Selection Mode
  logger.verbose("2.1 Determine Selection Mode");
  const { selectionMode, patterns, baseUrl, output } = fileConfig;

  // a) Retrieve the selectionMode from the configuration
  if (!selectionMode) {
    throw new SelectionModeError(
      "E2.1a: Selection mode is not provided in the configuration",
    );
  }

  // b) Validate that the mode is either 'include' or 'exclude'
  if (selectionMode !== "include" && selectionMode !== "exclude") {
    throw new SelectionModeError(
      'E2.1b: Invalid selection mode specified. Must be either "include" or "exclude"',
    );
  }

  // c) Set up the initial file selection based on the mode
  logger.verbose(`Selection mode: ${selectionMode}\n`);

  // 2.3 Process User-Defined Patterns
  logger.verbose("2.3 Process User-Defined Patterns");
  // a) Retrieve the patterns array from the configuration
  // b) Validate that the patterns array exists and is not empty
  if (!patterns || patterns.length === 0) {
    throw new PatternError("E2.3a/b: Patterns array is missing or empty");
  }

  // c) Process the patterns
  const processedPatterns = patterns.map((pattern) => {
    // If a pattern includes a wildcard or has a file extension, leave it as is
    if (
      // TODO: filter the output file manually
      pattern.includes("*") ||
      path.extname(pattern)
    ) {
      return pattern;
    }
    // For patterns without wildcards or extensions, add a wildcard to match both files and directories
    // {,/**/*} means:
    // - Match the pattern as-is (empty part before the comma)
    // - OR (,) match the pattern followed by any depth of subdirectories and any file (/***/)
    return `${pattern}{,/**/*}`;
  });

  logger.verbose(
    `Processed patterns:\n${JSON.stringify(processedPatterns, null, 2)}\n`,
  );

  // 2.4 Resolve File Paths
  logger.verbose("2.4 Resolve File Paths");
  // a) Use fast-glob to resolve the final list of file paths based on the processed patterns
  const cwd = baseUrl ? path.resolve(process.cwd(), baseUrl) : process.cwd();
  const globOptions = {
    cwd,
    dot: true,
    onlyFiles: true,
    absolute: true,
    ignore:
      selectionMode === "include"
        ? [output]
        : [...DEFAULT_EXCLUSIONS, ...processedPatterns, output],
  };

  logger.verbose(`Glob options: ${JSON.stringify(globOptions, null, 2)}\n`);

  try {
    let selectedFiles: string[];

    // b) For 'include' mode: Use fast-glob with the processed patterns directly
    if (selectionMode === "include") {
      selectedFiles = await fastGlob(processedPatterns, globOptions);
    } else {
      // c) For 'exclude' mode:
      //    - Get all files using fast-glob
      //    - Filter out files that match any of the exclude patterns using minimatch
      const allFiles = await fastGlob("**/*", globOptions);
      selectedFiles = allFiles.filter((file) => {
        const relativePath = path.relative(cwd, file);
        const shouldExclude = processedPatterns.some((pattern) =>
          minimatch(relativePath, pattern, { dot: true }),
        );
        return !shouldExclude;
      });
    }

    // TODO: re-enable
    // Debug logging for pattern matching
    // if (enablePatternMatch) {
    //   for (const file of selectedFiles) {
    //     const relativePath = path.relative(cwd, file);
    //     for (const pattern of processedPatterns) {
    //       const matched = minimatch(relativePath, pattern, { dot: true });
    //       logPatternMatch(relativePath, pattern, matched, patternLogWriter);
    //     }
    //   }
    // }

    // d) Validate that the final list is not empty
    if (selectedFiles.length === 0) {
      throw new FileResolutionError(
        "E2.4a: No files matched the resolved patterns",
      );
    }

    return selectedFiles;
  } catch (error) {
    throw new FileResolutionError(
      `E2.4b: Error during file path resolution: ${error}`,
    );
  }
}
