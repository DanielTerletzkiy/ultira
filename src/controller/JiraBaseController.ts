import ApiController from "./ApiController";
import { ApplicationType } from "../../types/Jira";

export default class JiraBaseController extends ApiController {
  url: string = "";
  name: string = "";
  credentials: { username: string; password: string };
  applicationType: ApplicationType;

  constructor(data: JiraBaseController) {
    super();
    this.url = data.url;
    this.name = data.name;
    this.credentials = data.credentials;
    this.applicationType = data.applicationType;

    //set proxy server address in express backend
    ApiController.fetchJira(data.url, "url", "POST", data.credentials);
  }
}
