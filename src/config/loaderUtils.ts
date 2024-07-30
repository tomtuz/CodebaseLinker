import path, { join } from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ConfigFileAccessError } from "@/errors/ConfigurationErrors";

export function resolveRoot(cwd?: string | URL): string {
  if (cwd instanceof URL) {
    return path.resolve(fileURLToPath(cwd));
  }
  return cwd ? path.resolve(cwd) : process.cwd();
}

export function isFileReadable(filename: string): boolean {
  try {
    // Check if current process has read permission to the file
    fs.accessSync(filename, fs.constants.R_OK)

    return true
  } catch (error) {
    throw new ConfigFileAccessError(filename, error as Error);
  }
}

function hasWorkspacePackageJSON(root: string): boolean {
  const path = join(root, 'package.json')
  if (!isFileReadable(path)) {
    return false
  }
  try {
    const content = JSON.parse(fs.readFileSync(path, 'utf-8')) || {}
    return !!content.workspaces
  } catch {
    return false
  }
}
