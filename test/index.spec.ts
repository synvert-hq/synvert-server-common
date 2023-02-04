import { formatCommandResult, runShellCommand } from "../src/index";

describe("runShellCommand", () => {
  it("runs shell command correctly", async () => {
    const result = await runShellCommand("echo", ["hello world"]);
    expect(result.stdout).toEqual("hello world\n");
    expect(result.stderr).toEqual("");
  });

  it("runs shell command incorrectly", async () => {
    const result = await runShellCommand("ohce", ["hello world"]);
    expect(result.stdout).toEqual("");
    expect(result.stderr).toContain("command not found: ohce");
  });
});

describe("formatCommandResult", () => {
  it("formats with empty stderr", () => {
    expect(formatCommandResult({ stdout: "hello world", stderr: "" })).toEqual({ output: "hello world", error: undefined });
  });

  it("formats with stderr", () => {
    expect(formatCommandResult({ stdout: "", stderr: "hello world" })).toEqual({ output: "", error: "hello world" });
  });

  it("formats with warning", () => {
    expect(formatCommandResult({ stdout: "hello world", stderr: "warning: hello world" })).toEqual({ output: "hello world", error: undefined });
  });
});