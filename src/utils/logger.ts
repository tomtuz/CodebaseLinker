export enum LogLevel {
  Normal = 0,
  Verbose = 1,
  Debug = 2
}

class Logger {
  private static instance: Logger;
  private level: LogLevel = LogLevel.Normal;

  private constructor() { }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  isDebugEnabled(): boolean {
    return this.level >= LogLevel.Debug;
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  info(message: string) {
    console.log(message);
  }

  warn(message: string) {
    console.warn(message);
  }

  error(message: string) {
    console.error(message);
  }

  verbose(message: string) {
    if (this.level >= LogLevel.Verbose) {
      console.log(message);
    }
  }

  debug(message: string) {
    if (this.level >= LogLevel.Debug) {
      console.log(message);
    }
  }
}

export const logger = Logger.getInstance();
