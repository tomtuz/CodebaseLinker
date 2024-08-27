import { VectorizedOptions } from "./configTypes";

export function setBooleanOption(
  options: VectorizedOptions,
  index: number,
  value: boolean,
): void {
  options.booleans[index] = value ? 1 : 0;
  options.changedFlags[0] |= 1 << index;
}

export function getBooleanOption(
  options: VectorizedOptions,
  index: number,
): boolean | undefined {
  return options.changedFlags[0] & (1 << index)
    ? options.booleans[index] === 1
    : undefined;
}

export function setStringOption(
  options: VectorizedOptions,
  index: number,
  value: string | undefined,
): void {
  if (value !== undefined) {
    options.strings[index] = value;
    options.changedFlags[1] |= 1 << index;
  }
}

export function getStringOption(
  options: VectorizedOptions,
  index: number,
): string | undefined {
  return options.changedFlags[1] & (1 << index)
    ? options.strings[index] ?? undefined
    : undefined;
}

export function setArrayOption(
  options: VectorizedOptions,
  index: number,
  value: string[] | undefined,
): void {
  if (value !== undefined) {
    options.arrays[index] = value;
    options.changedFlags[2] |= 1 << index;
  }
}

export function getArrayOption(
  options: VectorizedOptions,
  index: number,
): string[] | undefined {
  return options.changedFlags[2] & (1 << index)
    ? options.arrays[index] ?? undefined
    : undefined;
}

export function serializeOptions(options: VectorizedOptions): string {
  return JSON.stringify({
    b: Array.from(options.booleans),
    s: options.strings,
    a: options.arrays,
    f: Array.from(options.changedFlags),
  });
}

export function deserializeOptions(serialized: string): VectorizedOptions {
  const data = JSON.parse(serialized);
  return {
    booleans: new Uint8Array(data.b),
    strings: data.s,
    arrays: data.a,
    changedFlags: new Uint32Array(data.f),
  };
}
