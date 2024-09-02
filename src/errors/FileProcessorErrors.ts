export class FileReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileReadError';
  }
}

export class FormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormattingError';
  }
}

export class OutputWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OutputWriteError';
  }
}

