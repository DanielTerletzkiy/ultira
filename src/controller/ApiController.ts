export default class ApiController {
  static async generic(
    url: string,
    method: string,
    headers?: Headers,
    body?: any
  ): Promise<any> {
    if (!headers && body) {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
    }
    const options: { method: string; headers?: Headers; body?: string } = {
      method,
      headers,
      body: JSON.stringify(body ?? {}),
    };
    if (!body) {
      delete options.body;
    }
    return await fetch(url, options);
  }

  static async fetchJira(
    jiraHost: string,
    path: string,
    method: string,
    basicCredentials: { username: string; password: string },
    type: FetchContentType = FetchContentType.JSON,
    body?: any
  ): Promise<any> {
    const headers = new Headers();
    switch (type) {
      case FetchContentType.JSON: {
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        break;
      }
      case FetchContentType.FILES: {
        break;
      }
    }
    headers.append(
      "Authorization",
      "Basic " +
        btoa(basicCredentials.username + ":" + basicCredentials.password)
    );
    headers.append("X-Atlassian-Token", "no-check");
    headers.append("Jira-Host", jiraHost);
    headers.append("User-Agent", "XXX");
    const response = await this.generic(
      "http://localhost:2343/" + path,
      method,
      headers,
      body
    );
    if (type === FetchContentType.JSON) {
      return response.json();
    } else if(type === FetchContentType.FILES){
      return response.blob();
    }
  }
}

export const enum FetchContentType {
  JSON,
  FILES,
}
