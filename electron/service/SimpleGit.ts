import { SimpleGit, simpleGit, SimpleGitOptions } from "simple-git";

export default function(path?: string): SimpleGit {
  const options: Partial<SimpleGitOptions> = {
    baseDir: path || process.cwd(),
    maxConcurrentProcesses: 6
  };
  return simpleGit(options);
}
