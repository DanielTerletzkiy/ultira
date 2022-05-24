import ApiController from "./ApiController";

export default class JiraBaseController extends ApiController{
    private readonly _url: string = "";
    private readonly _name: string = "";
    private readonly _credentials: { username: string, password: string };

    constructor(url: string, name: string, credentials: { username: string, password: string }) {
        super();
        this._url = url;
        this._name = name;
        this._credentials = credentials
        ApiController.fetchJira(url, 'url', 'POST', credentials)
    }

    get url(): string {
        return this._url;
    }

    get name(): string {
        return this._name;
    }

    get credentials(): { username: string; password: string } {
        return this._credentials;
    }
}
