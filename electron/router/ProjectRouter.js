"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ipcMain } = require("electron");
const ProjectScraper = require("../controller/ProjectScraper");
ipcMain.on("open/project", (event, arg) => {
    event.sender.send("result/open/project", ProjectScraper.open(arg.project, arg.issue));
});
ipcMain.on("open/file", (event, arg) => {
    event.sender.send("result/open/file", ProjectScraper.open(arg.project, arg.issue));
});
ipcMain.on("scrape/directory", async (event, arg) => {
    const result = await ProjectScraper.scrape(arg.path);
    event.sender.send("result/scrape/directory", result);
});
ipcMain.on("scrape/branches", async (event, arg) => {
    const result = await ProjectScraper.scrapeBranches(arg.projectPaths);
    event.sender.send("result/scrape/branches", result);
});
