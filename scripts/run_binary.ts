import { execFile } from 'node:child_process';
import * as path from 'node:path';
import * as os from 'node:os';

const platform = os.platform();
let binary: string;
const current_dir = process.cwd()
if (platform === 'linux') {
  binary = path.join(current_dir, 'bin', 'mybinary-linux');
} else if (platform === 'darwin') {
  binary = path.join(current_dir, 'bin', 'mybinary-darwin');
} else if (platform.startsWith('win')) {
  binary = path.join(current_dir, 'bin', 'mybinary.exe');
} else {
  throw new Error(`Unsupported platform: ${platform}`);
}

const directory = process.argv[2] || '.';

execFile(binary, [directory], (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing binary: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Binary stderr: ${stderr}`);
    return;
  }

  try {
    const fileInfos = JSON.parse(stdout);
    console.log('File Infos:', fileInfos);
  } catch (parseError) {
    console.error(`Error parsing JSON: ${parseError}`);
  }
});

