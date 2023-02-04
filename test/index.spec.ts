import { runShellCommand } from "../src/index";

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