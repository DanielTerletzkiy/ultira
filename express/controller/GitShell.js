"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = class GitShell {
    static async exec(path, command) {
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
                child.stdout.once("data", function (data) {
                    resolve(data);
                });
                child.stdout.once("close", function (data) {
                    reject();
                });
            });
        }
        catch (e) {
            console.error(e);
        }
        return output;
    }
    static async getCurrentBranch(path) {
        return (await GitShell.exec(path, "git branch --show-current")).replace(/(\r\n|\n|\r)/gm, "");
    }
    static async getCurrentChanges(path) {
        const changes = await GitShell.exec(path, "git status -s");
        if (changes) {
            const output = changes
                .split(/\r\n|\n|\r/)
                .map((change) => change.split(/(D|M|A|\?\?) /));
            output.pop();
            return output;
        }
        return [];
    }
};
exports.default = {};
