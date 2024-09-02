import fs from "node:fs";
import path from "node:path";

export class LogWriter {
  public filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.initializeLogFile();
  }

  private initializeLogFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, "", { flag: "w" });
  }

  public writeLog(message: string): void {
    fs.appendFileSync(this.filePath, `${message}\n`);
  }

  public getFilePath = (): string => {
    return this.filePath || "";
  };
}

export const createLogWriter = (filePath: string): LogWriter => {
  return new LogWriter(filePath);
};
