
export class SelectionModeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SelectionModeError';
  }
}

export class PatternError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PatternError';
  }
}

export class FileResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileResolutionError';
  }
}
