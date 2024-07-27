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

  info(message: string, ...args: any[]) {
    console.log(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(message, ...args);
  }

  verbose(message: string, ...args: any[]) {
    if (this.level >= LogLevel.Verbose) {
      console.log(message, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.level >= LogLevel.Debug) {
      console.log(message, ...args);
    }
  }
}

export const logger = Logger.getInstance();
