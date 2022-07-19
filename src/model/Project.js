"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Project {
    path = "";
    project = "";
    branch = "";
    changes = [];
    constructor(project = {}) {
        Object.assign(this, project);
    }
}
exports.default = Project;
