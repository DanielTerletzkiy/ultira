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
    static async fetchJira(jiraHost, path, method, basicCredentials, body) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Basic ' + btoa(basicCredentials.username + ':' + basicCredentials.password));
        headers.append('Jira-Host', jiraHost);
        const response = await this.generic('http://localhost:2343/' + path, method, headers, body);
        return response.json();
    }
}
//# sourceMappingURL=ApiController.js.map