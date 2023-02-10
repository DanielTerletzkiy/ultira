import ApiController, { FetchContentType } from "../controller/ApiController";
import JiraBaseController from "../controller/JiraBaseController";
import { JiraChangelog } from "../../types/JiraChangelog";
import { JiraTransitions } from "../../types/JiraTransitions";
import { JiraComments } from "../../types/JiraComments";
import { JiraPullRequests } from "../../types/JiraPullRequests";
import { JiraCommits } from "../../types/JiraCommits";
import { JiraIssue as Task } from "../../types/JiraIssue";

export default class JiraTask extends ApiController {
  private readonly _controller: JiraBaseController;
  task: Task;

  commitData: JiraCommits | undefined;
  pullRequestData: JiraPullRequests | undefined;
  commentsData: JiraComments | undefined;
  transitionData: JiraTransitions | undefined;
  changelogData: JiraChangelog | undefined;

  loading: boolean = false;

  constructor(task: Task, controller: JiraBaseController) {
    super();
    this.task = task;
    this._controller = controller;
    this.getConnectedData();
  }

  async updateSelf(updateConnected: boolean) {
    const url = new URL(this.task.self);
    let task: Task;
    [task] = await Promise.all([
      ApiController.fetchJira(
        this._controller.url,
        `${url.pathname.replace(/\//, "")}`,
        "GET",
        this._controller.credentials
      ),
      updateConnected ? this.getConnectedData() : null
    ]);
    this.task = Object.assign({}, task) as Task;
    if (this.task.fields.status.name !== task.fields.status.name) {
      this.getConnectedData();
    }
    return this;
  }

  async getConnectedData() {
    console.log("get connected data", this.task.key);
    this.loading = true;
    const applicationUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=${this._controller.applicationType}&dataType`;
    const issueBaseUrl = `rest/api/latest/issue/${this.task.key}`;
    let commitData: JiraCommits | undefined = undefined,
      pullRequestData: JiraPullRequests | undefined = undefined,
      commentsData: JiraComments | undefined = undefined,
      transitionData: JiraTransitions | undefined = undefined,
      changelogData: JiraChangelog | undefined = undefined;
    [commitData, pullRequestData, commentsData, transitionData, changelogData] =
      await Promise.all([
        ApiController.fetchJira(
          this._controller.url,
          `${applicationUrl}=repository`,
          "GET",
          this._controller.credentials
        ),
        ApiController.fetchJira(
          this._controller.url,
          `${applicationUrl}=pullrequest`,
          "GET",
          this._controller.credentials
        ),
        ApiController.fetchJira(
          this._controller.url,
          `${issueBaseUrl}/comment`,
          "GET",
          this._controller.credentials
        ),
        ApiController.fetchJira(
          this._controller.url,
          `${issueBaseUrl}/transitions`,
          "GET",
          this._controller.credentials
        ),
        ApiController.fetchJira(
          this._controller.url,
          `${issueBaseUrl}?expand=changelog`,
          "GET",
          this._controller.credentials
        )
      ]);

    if (
      (commitData &&
        commitData?.detail.length > 0 &&
        commitData?.detail[0].repositories.length > 0 &&
        this.hasCommits) ||
      this.commitsEmpty ||
      !this.commitData
    ) {
      this.commitData = Object.assign({}, commitData);
    }

    if (
      (pullRequestData &&
        pullRequestData?.detail.length > 0 &&
        pullRequestData?.detail[0].pullRequests.length > 0 &&
        this.hasPullRequests) ||
      this.pullRequestsEmpty ||
      !this.pullRequestData
    ) {
      this.pullRequestData = Object.assign({}, pullRequestData);
    }

    if (commentsData) {
      this.commentsData = Object.assign(commentsData);
    }
    if (transitionData) {
      this.transitionData = Object.assign(transitionData);
    }
    if (changelogData) {
      this.changelogData = Object.assign(changelogData);
    }
    this.loading = false;
  }

  async addWorkLog(seconds: number) {
    const result = await ApiController.fetchJira(
      this._controller.url,
      `rest/api/latest/issue/${this.task.key}/worklog`,
      "POST",
      this._controller.credentials,
      FetchContentType.JSON,
      {
        timeSpentSeconds: seconds
      }
    );
    await this.updateSelf(true);
    return result;
  }

  async addComment(body: string) {
    const result = await ApiController.fetchJira(
      this._controller.url,
      `rest/api/latest/issue/${this.task.key}/comment`,
      "POST",
      this._controller.credentials,
      FetchContentType.JSON,
      {
        body
      }
    );
    await this.updateSelf(true);
    return result;
  }

  async updateTransition(id: string) {
    try {
      await ApiController.fetchJira(
        this._controller.url,
        `rest/api/latest/issue/${this.task.key}/transitions`,
        "POST",
        this._controller.credentials,
        FetchContentType.JSON,
        {
          transition: { id }
        }
      );
    } catch (e) {
      console.warn(e);
    }
    await this.updateSelf(true);
    return true;
  }

  get hasCommits() {
    return (
      this.commitData &&
      this.commitData?.detail.length > 0 &&
      this.commitData?.detail[0].repositories.length > 0
    );
  }

  get commitsEmpty() {
    return (
      this.commitData &&
      (
        this.commitData?.detail.length > 0 &&
        this.commitData?.detail[0].repositories.length === 0
      ) ||
      (
        this.commitData?.errors &&
        this.commitData?.errors.length > 0
      )
    );
  }

  get hasPullRequests() {
    return (
      this.pullRequestData &&
      this.pullRequestData?.detail.length > 0 &&
      this.pullRequestData?.detail[0].pullRequests.length > 0
    );
  }

  get pullRequestsEmpty() {
    return (
      this.pullRequestData &&
      (
        this.pullRequestData?.detail.length > 0 &&
        this.pullRequestData?.detail[0].pullRequests.length === 0
      ) ||
      (
        this.pullRequestData?.errors &&
        this.pullRequestData?.errors.length > 0
      )
    );
  }
}
