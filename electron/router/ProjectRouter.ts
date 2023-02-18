import { Project } from "../types/Jira";
import { JiraIssue as Task } from "../types/JiraIssue";

const { ipcMain } = require("electron");

const ProjectScraper = require("../controller/ProjectScraper");

ipcMain.on(
  "open/project",
  async (event: any, arg: { project: string; issue: Task["key"] }) => {
    const project: Project = JSON.parse(arg.project);
    const res = await ProjectScraper.open(project, arg.issue, event);

    event.sender.send("result/open/project", res);
  }
);

ipcMain.on(
  "open/file",
  async (event: any, arg: { project: string; file: string }) => {
    const project: Project = JSON.parse(arg.project);
    const res = await ProjectScraper.openFile(project, arg.file);

    event.sender.send("result/open/file", res);
  }
);

ipcMain.on("scrape/directory", async (event: any, arg: { path: string }) => {
  const result = await ProjectScraper.scrape(arg.path);
  event.sender.send("result/scrape/directory", result);
});

ipcMain.on(
  "scrape/branches",
  async (event: any, arg: { projectPaths: Array<Project["path"]> }) => {
    let result = await ProjectScraper.scrapeBranches(arg.projectPaths);
    result = result.map((result: Partial<Project>) => {
      // @ts-ignore
      delete result.changes?.isClean;
      return result;
    });
    console.log(result);
    event.sender.send("result/scrape/branches", result);
  }
);
