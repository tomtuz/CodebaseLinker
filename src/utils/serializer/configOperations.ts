import { ConfigIndex } from "./configTypes";

export function setBooleanOption(
  options: ConfigIndex,
  index: number,
  value: boolean,
): void {
  options.booleans[index] = value ? 1 : 0;
  options.changedFlags[0] |= 1 << index;
}

export function getBooleanOption(
  options: ConfigIndex,
  index: number,
): boolean | undefined {
  return options.changedFlags[0] & (1 << index)
    ? options.booleans[index] === 1
    : undefined;
}

export function setStringOption(
  options: ConfigIndex,
  index: number,
  value: string | undefined,
): void {
  if (value !== undefined) {
    options.strings[index] = value;
    options.changedFlags[1] |= 1 << index;
  }
}

export function getStringOption(
  options: ConfigIndex,
  index: number,
): string | undefined {
  return options.changedFlags[1] & (1 << index)
    ? options.strings[index] ?? undefined
    : undefined;
}

export function setArrayOption(
  options: ConfigIndex,
  index: number,
  value: string[] | undefined,
): void {
  if (value !== undefined) {
    options.arrays[index] = value;
    options.changedFlags[2] |= 1 << index;
  }
}

export function getArrayOption(
  options: ConfigIndex,
  index: number,
): string[] | undefined {
  return options.changedFlags[2] & (1 << index)
    ? options.arrays[index] ?? undefined
    : undefined;
}

export function serializeOptions(options: ConfigIndex): string {
  return JSON.stringify({
    b: Array.from(options.booleans),
    s: options.strings,
    a: options.arrays,
    f: Array.from(options.changedFlags),
  });
}

export function deserializeOptions(serialized: string): ConfigIndex {
  const data = JSON.parse(serialized);
  return {
    booleans: new Uint8Array(data.b),
    strings: data.s,
    arrays: data.a,
    changedFlags: new Uint32Array(data.f),
  };
}
