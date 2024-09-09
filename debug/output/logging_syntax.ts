import picocolors from 'picocolors';

export enum LogLevel {
  // native levels
  Silent = 0,
  Error = 1,
  Warn = 2,
  // custom levels
  Info = 3, // info
  Debug = 4, // info + debug
  Verbose = 5, // info + debug + verbose
}

export type OutputLevel = {
  Info?: boolean,
  Debug?: boolean,
  Verbose?: boolean
}

class Logger {
  private static instance: Logger;
  private level: OutputLevel = {
    Info: true,
    Debug: false,
    Verbose: false
  }

  private status_prefix = {
    success: {
      emoji: '✅',
      unicode: '✓',
      ascii: '[OK]'
    },
    error: {
      emoji: '❌',
      unicode: '✗',
      ascii: '[X]'
    },
    info: {
      emoji: 'i',
      unicode: 'i',
      ascii: '[i]'
    },
  };


  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevels(levelObj: OutputLevel): void {
    this.level.Info = levelObj.Info
    this.level.Debug = levelObj.Debug
    this.level.Verbose = levelObj.Verbose

    this.verbose("\nlog_level: ", this.level)
  }

  getLevels(): OutputLevel {
    return this.level
  }

  // native logs

  error(message?: any, ...optionalParams: any[]): void {
    console.warn(picocolors.red(message), ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    console.warn(picocolors.yellow(message), ...optionalParams);
  }

  // functional logs

  info(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  infoObj(message?: any, ...optionalParams: any[]): void {
    console.log(`${message}\n${JSON.stringify(optionalParams, null, 2)}`);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.level?.Debug || this.level?.Verbose) {
      console.warn(message, ...optionalParams);
    }
  }

  verbose(message?: any, ...optionalParams: any[]): void {
    if (this.level?.Verbose) {
      console.log(message, ...optionalParams);
    }
  }

  // format logs

  header(message?: any, ...optionalParams: any[]): void {
    const divider = "=".repeat(message.length);
    const header_line = `\n${message}\n${divider}`
    console.log(header_line);
  }

  step(message?: any, ...optionalParams: any[]): void {
    const divider = "-".repeat(message.length);
    // const header_line = `\n${message}\n${divider}`
    const header_line = `\n${picocolors.blue(message)}\n${divider}`
    console.log(header_line);
  }

  struct(message: any, obj: any, optionalParams: any): void {
    if (optionalParams.verbose === false) {
      return
    }

    console.log(
      `${message}\n${JSON.stringify(obj, null, 2)}`
    );
  }

  status(message?: any, status_type?: "success" | "error" | "info" | "custom"): void {
    // console.log("\n")
    switch (status_type) {
      case "success":
        console.log(`${picocolors.green(this.status_prefix.success.ascii)} ${message}`);
        break;
      case "error":
        console.log(`${picocolors.red(this.status_prefix.error.ascii)} ${message}`);
        break;
      case "info":
        console.log(`${picocolors.blue(this.status_prefix.info.ascii)} ${message}`);
        break;
      case "custom":
        console.log(message);
        break;
      default:
        console.log(message);
    }
  }
}

export const logger = Logger.getInstance();

