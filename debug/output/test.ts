import { logger, OutputLevel } from './logging_syntax';
import {
  stringExample,
  numberExample,
  floatExample,
  booleanExample,
  undefinedExample,
  nullExample,
  symbolExample,
  bigIntExample,
  objectExample,
  arrayExample,
  functionExample,
  data_types
} from "./structures"

// logger.setLevel(LogLevel.Info)

// logger.debug("hello world: ", "foo", "bar");
// console.log("hello world: ", "foo", "bar");

// for (const data_type of data_types) {
//   logger.debug(data_type);
// }

// console.log("\n############\n");

// for (const data_type of data_types) {
//   console.log(data_type);
// }
function printNormal(isOk: boolean, log_settings?: OutputLevel) {
  if (log_settings) {
    logger.setLevels(log_settings)
  }

  logger.header("Running Code Linker");
  logger.info("Output: E:\\Tomo\\ccm\\tool_codebase_linker\\codebase-context.md");
  logger.info("Files processed: 36");
  logger.info("Total output size: 59,005 characters\n");

  if (isOk) {
    logger.status("Completed successfully.", "success");
    return
  }
  logger.status("Completion with errors.", "error");
}

const log_n = ({ Info: true })
const log_nv = ({ Info: true, Verbose: true })

const log_d = ({ Debug: true })
const log_dv = ({ Debug: true, Verbose: true })

const log_nd = ({ Info: true, Debug: true })
const log_ndv = ({ Info: true, Debug: true, Verbose: true })

// printNormal(true, log_nd)
// printNormal(false, log_ndv)

function printDebug(isOk: boolean, log_settings?: OutputLevel) {
  if (log_settings) {
    logger.setLevels(log_settings)
  }

  logger.header("Running Code Linker (Debug Mode)");

  // add divider
  logger.step("1. Configuration Loading");
  logger.info("Config path: E:\\Tomo\\ccm\\tool_codebase_linker\\.cotext\\test.config.ts");
  logger.info("[Details hidden, use --verbose to show]");

  logger.step("2. Global Pattern Resolution");
  logger.info("Files selected: 36");
  logger.info("[Details hidden, use --verbose to show]");

  logger.step("3. File Processing and Aggregation");
  logger.info("[36/36] Processing completed");
  logger.info("Output: E:\\Tomo\\ccm\\tool_codebase_linker\\codebase-context.md");

  if (isOk) {
    logger.status("Completed successfully.", "success");
    return
  }
  logger.status("Completion with errors.", "error");
}


printDebug(true, log_nd)
printDebug(false, log_ndv)

