import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { computed } from "vue";
import {
  JiraConfiguration,
  JiraIssue,
  SortNames
} from "../../types/Jira";
import ApplicationType = JiraConfiguration.ApplicationType;
import JiraConfig = JiraConfiguration.JiraConfig;
import Task = JiraIssue.Task;
import JiraTask from "../model/JiraTask";
import JiraController from "../controller/JiraController";
import Project from "../model/Project";

const store = createStore({
  plugins: [new VuexPersistence().plugin],
  state: {
    currentIssueKey: "",
    currentSort: SortNames.Latest,
    selectedJiraConfig: "",
    jiraConfigs: [
      {
        name: "sample",
        url: "https://",
        applicationType: ApplicationType.Bitbucket
      }
    ],
    projects: [
      {
        path: "",
        project: "",
        branch: "",
        changes: [""]
      }
    ],
    searchDialogOpen: false,
    credentialsDialogOpen: false,
    refreshTime: 60,
    zoomFactor: 1
  },
  getters: {
    currentIssueKey(state): Task["key"] | undefined {
      return state.currentIssueKey;
    },
    currentSort(state): SortNames {
      return state.currentSort;
    },
    currentJiraConfig(state): string | undefined {
      return state.selectedJiraConfig;
    },
    jiraConfigs(state): Array<JiraConfig> {
      return state.jiraConfigs;
    },
    projects(state): Array<Project> {
      //@ts-ignore
      return state.projects;
    },
    searchDialogOpen(state): boolean {
      return state.searchDialogOpen;
    },
    credentialsDialogOpen(state): boolean {
      return state.credentialsDialogOpen;
    },
    refreshTime(state): number {
      return state.refreshTime;
    },
    zoomFactor(state): number {
      return state.zoomFactor;
    }
  },
  mutations: {
    setCurrentIssueKey(state, payload: Task["key"]) {
      state.currentIssueKey = payload;
    },
    setCurrentSort(state, payload: SortNames) {
      state.currentSort = payload;
    },
    setCurrentJiraConfig(state, payload: string) {
      state.selectedJiraConfig = payload;
    },
    setJiraConfigs(state, payload: Array<JiraConfig>) {
      state.jiraConfigs = payload;
    },
    setProjects(state, payload: Array<Project>) {
      // @ts-ignore
      state.projects.push(...payload);
    },
    setSearchDialogOpen(state, payload: boolean) {
      state.searchDialogOpen = payload;
    },
    setCredentialsDialogOpen(state, payload: boolean) {
      state.credentialsDialogOpen = payload;
    },
    setRefreshTime(state, payload: number) {
      state.refreshTime = payload;
    },
    setZoomFactor(state, payload: number) {
      state.zoomFactor = payload;
    }
  },
  actions: {
    setCurrentIssueKey(context, payload: Task["key"]) {
      context.commit("setCurrentIssueKey", payload);
    },
    setCurrentSort(context, payload: SortNames) {
      context.commit("setCurrentSort", payload);
    },
    setCurrentJiraConfig(context, payload: string) {
      context.commit("setCurrentJiraConfig", payload);
    },
    setJiraConfigs(context, payload: Array<JiraConfig>) {
      context.commit("setJiraConfigs", payload);
    },
    setProjects(context, payload: Array<Project>) {
      const projects: Array<Project> = [];
      for (const project of payload) {
        const index = context.state.projects.findIndex(
          (x) => x.path === project.path
        );
        if (index === -1) {
          console.log(project);
          projects.push(project);
        }
        if (index > -1) {
          context.state.projects[index].branch = project.branch;
          // @ts-ignore
          context.state.projects[index].changes = project.changes;
        }
      }
      context.commit("setProjects", projects);
    },
    setSearchDialogOpen(context, payload: boolean) {
      context.commit("setSearchDialogOpen", payload);
    },
    setCredentialsDialogOpen(context, payload: boolean) {
      context.commit("setCredentialsDialogOpen", payload);
    },
    setRefreshTime(context, payload: number) {
      context.commit("setRefreshTime", payload);
    },
    setZoomFactor(context, payload: number) {
      context.commit("setZoomFactor", payload);
    }
  }
});

export default store;

export const currentIssue = computed<JiraTask | undefined>(
  () =>
    JiraController &&
    (JiraController.issues.value?.find(
      (issue: JiraTask) => issue.task.key === currentIssueKey.value
    ) as JiraTask | undefined)
);

export const currentIssueKey = computed<Task["key"]>({
  get() {
    return store.getters.currentIssueKey;
  },
  set(value: Task["key"]) {
    store.dispatch("setCurrentIssueKey", value);
  }
});

export const currentSort = computed({
  get() {
    return store.getters.currentSort;
  },
  set(value: SortNames) {
    store.dispatch("setCurrentSort", value);
  }
});

export const selectedJiraConfig = computed({
  get() {
    return store.getters.currentJiraConfig;
  },
  set(value) {
    store.dispatch("setCurrentJiraConfig", value);
  }
});

export const jiraConfigs = computed<Array<JiraConfig>>({
  get() {
    return store.getters.jiraConfigs;
  },
  set(value) {
    store.dispatch("setJiraConfigs", value);
  }
});

export const projects = computed<Array<Project>>({
  get() {
    return store.getters.projects;
  },
  set(value) {
    store.dispatch("setProjects", value);
  }
});

export const searchOpen = computed<boolean>({
  get() {
    return store.getters.searchDialogOpen;
  },
  set(value: boolean) {
    store.dispatch("setSearchDialogOpen", value);
  }
});

export const credentialsOpen = computed<boolean>({
  get() {
    return store.getters.credentialsDialogOpen;
  },
  set(value: boolean) {
    store.dispatch("setCredentialsDialogOpen", value);
  }
});

export const refreshTime = computed<number>({
  get() {
    return store.getters.refreshTime;
  },
  set(value: number) {
    store.dispatch("setRefreshTime", value);
  }
});

export const zoomFactor = computed<number>({
  get() {
    return store.getters.zoomFactor;
  },
  set(value: number) {
    store.dispatch("setZoomFactor", value);
  }
});
