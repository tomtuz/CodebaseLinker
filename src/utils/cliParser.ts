import {
  ArgumentError,
  ExtendedArgOption,
  ExtendedParseOptions,
  ParseResult,
} from "@/types/programOptions";

// ASCII code for '-' character
const DASH_CHAR_CODE = 45;

// TODO: investigate source of node native 'parseArgs'
// https://github.dev/nodejs/node
// lib/internal/util/parse_args/parse_args.js | parseArgs

/**
 * Main function to parse command-line arguments
 * @param options - Object defining the expected arguments and their properties
 * @param args - Array of command-line arguments to parse
 * @returns ParseResult object containing parsed values and positional arguments
 */
export function cliParser(
  options: ExtendedParseOptions,
  // args: string[],
): ParseResult {
  // args input from context
  const args = process.argv.slice(2);

  // Object to store parsed values
  const values: { [key: string]: any } = Object.create(null);
  // Array to store positional arguments
  const positionals: string[] = [];
  // Map to store short option aliases for quick lookup
  const shortOptions = new Map<string, string>();
  // Set to keep track of seen options (for detecting duplicates)
  const seenOptions = new Set<string>();
  // Set to keep track of set options (to know which are not defined to use fallback)
  const cliSetOptions = new Set<string>();

  // Set up short options
  for (const key in options) {
    const opt = options[key];
    // Add short option alias to the map if it exists
    if (opt.short) {
      if (shortOptions.has(opt.short)) {
        throw new ArgumentError(`Conflicting short option: -${opt.short}`);
      }
      shortOptions.set(opt.short, key);
    }
  }

  // Cache args length for performance in the loop
  const argsLength = args.length;
  for (let i = 0; i < argsLength; i++) {
    const arg = args[i];

    // Check if the argument starts with a dash (indicating an option)
    if (arg.charCodeAt(0) === DASH_CHAR_CODE) {
      let opt: ExtendedArgOption | undefined;
      let storeKey: string;
      let optionName: string;

      // Handle LONG options (starting with --)
      if (arg.charCodeAt(1) === DASH_CHAR_CODE) {
        optionName = arg.slice(2);
        opt = options[optionName];
        storeKey = opt?.store ?? "";
      }
      // Handle SHORT options (starting with single -)
      else {
        const shortKey = arg.slice(1);
        optionName = shortOptions.get(shortKey) ?? "";
        opt = optionName ? options[optionName] : undefined;
        storeKey = opt?.store ?? "";
      }

      // Throw error if option is not recognized
      if (!opt) {
        throw new ArgumentError(`Unknown option: ${arg}`);
      }

      // Check for duplicate non-multiple, non-variadic options
      if (seenOptions.has(storeKey) && !opt.multiple && !opt.variadic) {
        throw new ArgumentError(`Option '${optionName}' can only be used once`);
      }
      seenOptions.add(storeKey);
      cliSetOptions.add(storeKey);

      // Handle BOOLEAN options
      if (opt.type === "boolean") {
        values[storeKey] = true;
      }
      // Handle STRING options
      else {
        // Get the next argument as the value
        const value = args[++i];
        // Throw error if value is missing or starts with a dash
        if (value === undefined || value.charCodeAt(0) === DASH_CHAR_CODE) {
          throw new ArgumentError(`Option '${optionName}' requires a value`);
        }

        // Validate the value
        validateValue(opt, value, optionName);

        // Handle multiple/variadic options
        if (opt.variadic || opt.multiple) {
          if (!values[storeKey]) {
            values[storeKey] = [];
          }

          // Split the value on whitespace
          // TODO: remove calls regexes
          const multiValues = value.split(/\s+/);
          // const multiValues = splitOnWhitespace(value);
          (values[storeKey] as string[]).push(...multiValues);

          // For variadic options, continue parsing values until next option
          if (opt.variadic) {
            while (
              i + 1 < argsLength &&
              args[i + 1].charCodeAt(0) !== DASH_CHAR_CODE
            ) {
              const additionalValue = args[++i];
              // TODO: remove calls regexes
              const additionalValues = additionalValue.split(/\s+/);
              // const additionalValues = splitOnWhitespace(additionalValue);

              (values[storeKey] as string[]).push(...additionalValues);
            }
          }
        }
        // Handle single value options
        else {
          values[storeKey] = value;
        }
      }
    }
    // Handle positional arguments (those not starting with a dash)
    else {
      positionals.push(arg);
    }
  }

  // Apply defaults for options not set via CLI
  for (const key in options) {
    const opt = options[key];

    if (!cliSetOptions.has(opt.store) && opt.default !== undefined) {
      values[opt.store] =
        opt.multiple || opt.variadic ? [opt.default].flat() : opt.default;
    }
  }

  return { values, positionals };
}

/**
 * Validate the value of an option
 * @param opt - The option definition
 * @param value - The value to validate
 * @param optionName - The name of the option (for error messages)
 */
function validateValue(
  opt: ExtendedArgOption,
  value: string,
  optionName: string,
): void {
  // Check if the value is in the list of allowed choices (if specified)
  if (opt.choices && !opt.choices.includes(value)) {
    throw new ArgumentError(
      `Invalid choice for option '${optionName}'. Valid choices are: ${opt.choices.join(", ")}`,
    );
  }
}
