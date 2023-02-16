import { Project } from "../types/Jira";
import SimpleGit from "../service/SimpleGit";
import { StatusResult } from "simple-git";

module.exports = class GitShell {
  private static async exec(
    path: Project["path"],
    command: string
  ): Promise<any> {
    //console.log("command", command, "path", path);
    let output = null;
    try {
      const shell = require("shelljs");
      shell.config.execPath = shell.which("node").stdout;
      shell.cd(path);
      const child = shell.exec(command, {
        async: true,
        windowsHide: true,
      });
      output = await new Promise((resolve, reject) => {
        child.stdout.once("data", function (data: string) {
          resolve(data);
        });
        child.stdout.once("close", function (data: string) {
          reject();
        });
      });
    } catch (e) {
      console.error(e);
    }
    return output;
  }

  public static async getMasterBranch(
    path: Project["path"]
  ): Promise<Project["branch"]> {
    try {
      return (
        await GitShell.exec(
          path,
          "git symbolic-ref refs/remotes/origin/HEAD --short"
        )
      ).replace(/(\r\n|\n|\r)/gm, "");
    } catch (e) {
      return "none";
    }
  }

  public static async getCurrentBranch(
    path: Project["path"]
  ): Promise<Project["branch"]> {
    try {
      return (await GitShell.exec(path, "git branch --show-current")).replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
    } catch (e) {
      return "none";
    }
  }

  public static async getCurrentChanges(
    path: Project["path"]
  ): Promise<StatusResult> {
    const git = SimpleGit(path);
    //await git.fetch();
    return git.status();
  }
};

export default {};
