import ApiController, { FetchContentType } from "./ApiController";
import JiraBaseController from "./JiraBaseController";
import {
  JiraComments,
  JiraCommits,
  JiraIssue,
  JiraPullRequests,
  JiraTransitions,
} from "../../types/Jira";
import Commits = JiraCommits.Commits;
import Task = JiraIssue.Task;
import PullRequests = JiraPullRequests.PullRequests;
import CommentsRoot = JiraComments.CommentsRoot;
import TransitionsRoot = JiraTransitions.TransitionsRoot;

export default class JiraTask extends ApiController {
  private readonly _controller: JiraBaseController;
  task: Task;

  commitData: Commits | undefined;
  pullRequestData: PullRequests | undefined;
  commentsData: CommentsRoot | undefined;
  transitionData: TransitionsRoot | undefined;

  loading: boolean = false;

  constructor(task: Task, controller: JiraBaseController) {
    super();
    this.task = task;
    this._controller = controller;
  }

  async updateSelf(updateConnected: boolean) {
    const url = new URL(this.task.self);
    [this.task] = await Promise.all([
      ApiController.fetchJira(
        this._controller.url,
        `${url.pathname.replace(/\//, "")}`,
        "GET",
        this._controller.credentials
      ),
      updateConnected ? this.getConnectedData() : null,
    ]);
    return this;
  }

  async getConnectedData() {
    this.loading = true;
    const applicationUrl = `rest/dev-status/latest/issue/detail?issueId=${this.task.id}&applicationType=${this._controller.applicationType}&dataType`;
    const issueBaseUrl = `rest/api/latest/issue/${this.task.key}`;
    let commitData;
    let pullRequestData;
    [commitData, pullRequestData, this.commentsData, this.transitionData] =
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
        timeSpentSeconds: seconds,
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
        body,
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
          transition: { id },
        }
      );
    } catch (e) {
      console.warn(e)
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
      this.commitData?.detail.length > 0 &&
      this.commitData?.detail[0].repositories.length === 0
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
      this.pullRequestData?.detail.length > 0 &&
      this.pullRequestData?.detail[0].pullRequests.length === 0
    );
  }
}
