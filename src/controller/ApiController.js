export default class ApiController {
    static async generic(url, method, headers, body) {
        if (!headers && body) {
            headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
        }
        const options = {
            method,
            headers,
            body: JSON.stringify(body ?? {})
        };
        if (!body) {
            delete options.body;
        }
        return await fetch(url, options);
    }
    static async fetchJira(jiraHost, path, method, basicCredentials, type = FetchContentType.JSON, body) {
        const headers = new Headers();
        switch (type) {
            case FetchContentType.JSON: {
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');
                break;
            }
            case FetchContentType.FILES: {
                break;
            }
        }
        headers.append('Authorization', 'Basic ' + btoa(basicCredentials.username + ':' + basicCredentials.password));
        headers.append('X-Atlassian-Token', 'no-check');
        headers.append('Jira-Host', jiraHost);
        headers.append('User-Agent', 'XXX');
        const response = await this.generic('http://localhost:2343/' + path, method, headers, body);
        if (type === FetchContentType.JSON) {
            return response.json();
        }
        else {
            return response;
        }
    }
}
export var FetchContentType;
(function (FetchContentType) {
    FetchContentType[FetchContentType["JSON"] = 0] = "JSON";
    FetchContentType[FetchContentType["FILES"] = 1] = "FILES";
})(FetchContentType || (FetchContentType = {}));
//# sourceMappingURL=ApiController.js.map