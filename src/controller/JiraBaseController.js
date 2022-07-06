import ApiController from "./ApiController";
export default class JiraBaseController extends ApiController {
    url = "";
    name = "";
    credentials;
    applicationType;
    constructor(data) {
        super();
        this.url = data.url;
        this.name = data.name;
        this.credentials = data.credentials;
        this.applicationType = data.applicationType;
        ApiController.fetchJira(data.url, "url", "POST", data.credentials);
    }
}
//# sourceMappingURL=JiraBaseController.js.map