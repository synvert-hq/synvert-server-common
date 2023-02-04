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

function isRealError(stderr: string): boolean {
  return (
    Boolean(stderr) &&
    !stderr.startsWith('warning:') &&
    !stderr.startsWith('Cloning into ') &&
    !stderr.startsWith("error: pathspec '.' did not match any file(s) known to git")
  );
}

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function outputContainsError(stdout: string): boolean {
  return (
    Boolean(stdout) &&
    isJsonString(stdout) &&
    JSON.parse(stdout).error
  );
}

/**
 * Format shell command result, convert stdout and stderr to a json object { output, error }.
 * @param {string} stdout
 * @param {string} stderr
 * @returns {{ output: string, error: string }
 */
export function formatCommandResult({ stdout, stderr }: { stdout: string, stderr: string }): { output: string, error?: string } {
  let error;
  if (isRealError(stderr)) {
    error = stderr;
  }
  if (outputContainsError(stdout)) {
    error = JSON.parse(stdout).error;
  }
  return { output: stdout, error };
}