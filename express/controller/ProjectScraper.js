"use strict";
// @ts-ignore
let Worker = require('worker_threads').Worker;
const path = require("path");
module.exports = class ProjectScraper {
    static async scrape(startDirectory = 'PhpstormProjects') {
        console.log('starting worker on: ', __filename);
        const worker = new Worker(path.join(__dirname, "..", "worker/ProjectScrapperWorker.js"), {
            // @ts-ignore
            workerData: startDirectory
        });
        const projects = await new Promise((resolve, reject) => {
            // @ts-ignore
            worker.once('message', (message) => {
                //console.info(message, ' received from the worker thread!');
                resolve(message);
            });
        });
        return projects;
    }
};
//# sourceMappingURL=ProjectScraper.js.map