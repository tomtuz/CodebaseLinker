import { z } from 'zod';

const CodebaseStructOptionsSchema = z.object({
  name: z.string().optional(),
  baseUrl: z.string().optional(),
  outUrl: z.string().optional(),
  output: z.string().optional(),
  format: z.string().optional(),
  selectionMode: z.enum(['include', 'exclude']),
  patterns: z.array(z.string()).min(1),
}).strict();

export const CodebaseStructSchema = z.object({
  options: CodebaseStructOptionsSchema,
}).strict();

export type CodebaseStruct = z.infer<typeof CodebaseStructSchema>;

export function isValidCodebaseStruct(obj: unknown): obj is CodebaseStruct {
  const result = CodebaseStructSchema.safeParse(obj);
  return result.success;
}
