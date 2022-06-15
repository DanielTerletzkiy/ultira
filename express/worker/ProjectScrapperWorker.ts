let {parentPort, workerData} = require('worker_threads');
const path = require("path");

const shell = require("shelljs");
const homedir = require('os').homedir();

const cdPath = path.join(homedir, workerData);
console.log(cdPath)
/*shell.cd(cdPath);
shell.ls().forEach((file: string) => {
    console.log(file)
});*/
console.info('starting search')
const files = shell.find(cdPath).filter((file: string, index: number) => {
    if (!file.includes('node_modules')) {
        //console.log(index, file)
        return file.match(/\.git$/);
    }
}).map((file: string) => file.split('/.')[0]);
console.info('done')

parentPort.postMessage(files);
process.exit(0)
