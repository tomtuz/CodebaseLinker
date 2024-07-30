class FileReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileReadError';
  }
}

class FormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormattingError';
  }
}

class OutputWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OutputWriteError';
  }
}

