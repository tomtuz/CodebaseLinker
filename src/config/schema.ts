import { z } from 'zod';

const CodebaseStructOptionsSchema = z.object({
  name: z.string().optional(),
  baseUrl: z.string().optional(),
  outUrl: z.string().optional(),
  output: z.string().optional(),
  format: z.string().optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
}).strict();

const CodebaseStructPathSchema = z.object({
  path: z.string(),
  exclude: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  output: z.string().optional(),
  format: z.string().optional(),
  explicit: z.boolean().optional(),
}).strict();

type CodeBaseOptions = z.infer<typeof CodebaseStructOptionsSchema>;

export const CodebaseStructSchema = z.object({
  options: CodebaseStructOptionsSchema,
  paths: z.array(CodebaseStructPathSchema),
}).strict();

export type CodebaseStruct = z.infer<typeof CodebaseStructSchema>;

export function isValidCodebaseStruct(obj: unknown): obj is CodebaseStruct {
  const result = CodebaseStructSchema.safeParse(obj);
  return result.success;
}
