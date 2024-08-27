// TODO: rename to 'boolean'
export enum OPTIONS {
  VERBOSE = 0,
  DEBUG = 1,
  PATTERN_MATCH = 2,
  BOOLEAN_COUNT = 3,
}

export enum STRING_OPTIONS {
  CONFIG = 0,
  BASE_URL = 1,
  OUTPUT = 2,
  FORMAT = 3,
  SELECTION_MODE = 4,
  NAME = 5,
  COUNT = 6,
}

export enum ARRAY_OPTIONS {
  PATTERNS = 0,
  COUNT = 1,
}

export type VectorizedOptions = {
  booleans: Uint8Array;
  strings: (string | null)[];
  arrays: (string[] | null)[];
  changedFlags: Uint32Array;
};

export function createVectorizedOptions(): VectorizedOptions {
  return {
    booleans: new Uint8Array(OPTIONS.BOOLEAN_COUNT),
    strings: new Array(STRING_OPTIONS.COUNT).fill(null),
    arrays: new Array(ARRAY_OPTIONS.COUNT).fill(null),
    changedFlags: new Uint32Array(3), // One for each type: boolean, string, array
  };
}
