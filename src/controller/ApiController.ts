export default class ApiController {

    static async generic(url: string, method: string, headers: Headers, body?: any): Promise<any> {
        const options: { method: string, headers: Headers, body?: string } = {
            method,
            headers,
            body: JSON.stringify(body ?? {})
        };
        if (!body) {
            delete options.body;
        }
        return await fetch(url, options)
    }

    static async fetchJira(jiraHost: string, path: string, method: string, basicCredentials: { username: string, password: string }, body?: any): Promise<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Basic ' + btoa(basicCredentials.username + ':' + basicCredentials.password))
        headers.append('Jira-Host', jiraHost);
        const response = await this.generic('http://localhost:2343/' + path, method, headers, body);
        return response.json();
    }
}
