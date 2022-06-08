export default class ApiController {
    static async generic(url, method, headers, body) {
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
    static async fetchJira(jiraHost, path, method, basicCredentials, type = 0 /* JSON */, body) {
        const headers = new Headers();
        switch (type) {
            case 0 /* JSON */: {
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');
                break;
            }
            case 1 /* FILES */: {
                break;
            }
        }
        headers.append('Authorization', 'Basic ' + btoa(basicCredentials.username + ':' + basicCredentials.password));
        headers.append('X-Atlassian-Token', 'no-check');
        headers.append('Jira-Host', jiraHost);
        headers.append('User-Agent', 'XXX');
        const response = await this.generic('http://localhost:2343/' + path, method, headers, body);
        if (type === 0 /* JSON */) {
            return response.json();
        }
        else {
            return response;
        }
    }
}
//# sourceMappingURL=ApiController.js.map