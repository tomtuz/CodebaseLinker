// @ts-nocheck
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(source).forEach((key) => {
      if (key in target) {
        // Only merge if the key exists in the target
        if (isObject(source[key])) {
          output[key] = deepMerge(target[key], source[key]);
        } else if (source[key] !== undefined) {
          output[key] = source[key];
        }
      }
    });
  }
  return output as T;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return (item && typeof item === "object" && !Array.isArray(item)) as boolean;
}

// import deepmerge from 'deepmerge';

// export type DeepPartial<T> = T extends object ? {
//   [P in keyof T]?: DeepPartial<T[P]>;
// } : T;

// export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
//   return deepmerge(target, source as any, {
//     arrayMerge: (_, sourceArray) => sourceArray,
//   });
// }
