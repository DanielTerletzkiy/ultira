import ApiController from "./ApiController";
export default class JiraBaseController extends ApiController {
    _url = "";
    _name = "";
    _credentials;
    constructor(url, name, credentials) {
        super();
        this._url = url;
        this._name = name;
        this._credentials = credentials;
        ApiController.fetchJira(url, 'url', 'POST', credentials);
    }
    get url() {
        return this._url;
    }
    get name() {
        return this._name;
    }
    get credentials() {
        return this._credentials;
    }
}
//# sourceMappingURL=JiraBaseController.js.map