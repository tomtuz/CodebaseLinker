import readline from 'node:readline'
import picocolors from 'picocolors';

export enum LogLevel {
  Silent = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4
}
export type LoggerType = 'debug' | 'info' | 'warn' | 'error' | 'step' | 'header'
export interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}

export interface Logger {
  setLevel(level: LogLevel): void;
  debug(msg: string, options?: LogOptions): void;
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogOptions): void;
  step(msg: string, options?: LogOptions): void;
  header(msg: string, options?: LogOptions): void;
  clearScreen(): void;
}

class SingletonLogger implements Logger {
  private static instance: SingletonLogger;
  private level: LogLevel = LogLevel.Info;
  private allowClearScreen = true;
  private prefix = '';

  private constructor() { }

  public static getInstance(): SingletonLogger {
    if (!SingletonLogger.instance) {
      SingletonLogger.instance = new SingletonLogger();
    }
    return SingletonLogger.instance;
  }

  configure(options: { prefix?: string; allowClearScreen?: boolean; level?: LogLevel } = {}): void {
    if (options.prefix) this.prefix = options.prefix;
    if (options.allowClearScreen !== undefined) this.allowClearScreen = options.allowClearScreen;
    if (options.level !== undefined) this.level = options.level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private format(type: LoggerType, msg: string, options: LogOptions = {}): string {
    let formattedMsg = msg;
    if (options.timestamp) {
      const time = new Date().toLocaleTimeString();
      formattedMsg = `${picocolors.dim(time)} ${formattedMsg}`;
    }

    let colorizedPrefix: string;
    switch (type) {
      case 'debug':
        colorizedPrefix = picocolors.gray(this.prefix);
        break;
      case 'info':
        colorizedPrefix = picocolors.cyan(this.prefix);
        break;
      case 'warn':
        colorizedPrefix = picocolors.yellow(this.prefix);
        break;
      case 'error':
        colorizedPrefix = picocolors.red(this.prefix);
        break;
      case 'step':
        colorizedPrefix = picocolors.blue(this.prefix);
        break;
      case 'header':
        colorizedPrefix = picocolors.red(this.prefix);
        break;
    }

    return `${colorizedPrefix} ${formattedMsg}`;
  }

  private log(
    type: LoggerType,
    msg: string,
    options: LogOptions = {},
  ): void {
    if (this.level < LogLevel[type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof LogLevel]) {
      return;
    }

    const formattedMsg = this.format(type, msg, options);

    if (options.clear && this.allowClearScreen) {
      this.clearScreen();
    }

    switch (type) {
      case 'debug':
        console.log(formattedMsg);
        break;
      case 'info':
        console.log(formattedMsg);
        break;
      case 'warn':
        console.warn(picocolors.yellow(formattedMsg));
        break;
      case 'error':
        console.error(picocolors.red(formattedMsg));
        break;
      case 'step':
        console.log(picocolors.blue(formattedMsg));
        break;
      case 'header':
        console.log(picocolors.cyan(formattedMsg));
        break;
    }
  }

  debug(msg: string, options?: LogOptions): void {
    this.log('debug', msg, options);
  }

  // debug(msg: string, args: any, options) {
  //   this.log(msg, args, 'debug', options);
  // }

  info(msg: string, options?: LogOptions): void {
    this.log('info', msg, options);
  }

  warn(msg: string, options?: LogOptions): void {
    this.log('warn', msg, options);
  }

  error(msg: string, options?: LogOptions): void {
    this.log('error', msg, options);
  }

  step(msg: string, options?: LogOptions): void {
    this.log('step', msg, options);
  }

  header(msg: string, options?: LogOptions): void {
    this.log('header', msg, options);
  }

  clearScreen(): void {
    if (this.allowClearScreen && process.stdout.isTTY) {
      const blank = '\n'.repeat(process.stdout.rows);
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
    }
  }
}

// Export a single instance of the logger
export const logger = SingletonLogger.getInstance();

// Usage example:
// import { logger, LogLevel } from './path-to-logger-file';
// 
// // Optional: Configure the logger (typically done once in your main file)
// logger.configure({ prefix: '[myapp]', level: LogLevel.Debug });
// 
// // Use in any file:
// logger.debug('This is a debug message');
// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');
// logger.step('This is a main workflow step');
