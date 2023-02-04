import { rubySpawn } from 'ruby-spawn';

/**
 * It runs a shell command.
 * @async
 * @param {string} command
 * @param {string[]} args
 * @param {string | undefined} input
 * @returns {Promise<{ stdout: string, stderr: string }> stdout and stderr
 */
export function runShellCommand(command: string, args: string[], input?: string): Promise<{ stdout: string, stderr: string }> {
  return new Promise<{ stdout: string, stderr: string }>((resolve) => {
    const child = rubySpawn(command, args, { encoding: 'utf8', env: { PATH: process.env.PATH } }, true);
    if (child.stdin && input) {
      child.stdin.write(input);
      child.stdin.end();
    }
    let output = '';
    if (child.stdout) {
      child.stdout.on('data', data => {
        output += data;
      });
    }
    let error = "";
    if (child.stderr) {
      child.stderr.on('data', data => {
        error += data;
      });
    }
    child.on('error', (e) => {
      return resolve({ stdout: "", stderr: e.message });
    });
    child.on('exit', () => {
      return resolve({ stdout: output, stderr: error });
    });
  });
};