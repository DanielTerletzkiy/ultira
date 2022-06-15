const {parentPort, workerData} = require('worker_threads');
const chalk = require("chalk")
const path = require("path");

const shell = require("shelljs");
const homedir = require('os').homedir();

const cdPath = path.join(homedir, workerData);
console.log(`${chalk.bgRedBright.black('Scraper')}: ${chalk.blue('Starting...')}`);
const files = shell.find(cdPath).filter((file: string, index: number) => {
    if (!file.includes('node_modules') && !file.includes('vendor')) {
        return file.match(/\.git$/);
    }
}).map((file: string) => file.split('/.')[0]);

parentPort.postMessage(files);
process.exit(0);
