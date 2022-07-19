export default class Project {
  public path: string = "";
  public project: string = "";
  public branch: string = "";
  public changes: Array<string> = [];

  constructor(project: Partial<Project> = {}) {
    Object.assign(this, project);
  }
}
