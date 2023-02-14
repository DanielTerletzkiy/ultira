const { parentPort, workerData } = require("worker_threads");
const chalk = require("chalk");
const path = require("path");

const shell = require("shelljs");
const homedir = require("os").homedir();

//const cdPath = path.join(homedir, workerData);
const cdPath = workerData;
console.log(
  `${chalk.bgRedBright.black("Scraper")}: ${chalk.blue("Starting...")}`, cdPath);
const files: Array<{ path: string; project: string }> = shell
  .find(cdPath)
  .filter((file: string, index: number) => {
    console.log(file)
    if (!file.includes("node_modules") && !file.includes("vendor")) {
      return file.match(/\.git$/);
    }
  })
  .map((file: string) => {
    const projectPath = file.split("/.")[0];
    const projectName = projectPath.match(new RegExp("/.*/(.*)"));
    if (projectName) {
      return {
        path: projectPath,
        project: projectName[1]
      };
    }
  });

console.log(
  `${chalk.bgRedBright.black("Scraper")}: ${chalk.greenBright("Finished!")}`
);

parentPort.postMessage(files);
process.exit(0);

export {};
