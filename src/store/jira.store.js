import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { computed } from "vue";
import { JiraConfiguration, SortNames } from "../../types/Jira";
var ApplicationType = JiraConfiguration.ApplicationType;
import JiraController from "../controller/JiraController";
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
        zoomFactor: 1,
        theme: {
            isDark: true,
            primary: {
                light: "#A8B2FF",
                dark: "#A8B2FF"
            }
        }
    },
    getters: {
        currentIssueKey(state) {
            return state.currentIssueKey;
        },
        currentSort(state) {
            return state.currentSort;
        },
        currentJiraConfig(state) {
            return state.selectedJiraConfig;
        },
        jiraConfigs(state) {
            return state.jiraConfigs;
        },
        projects(state) {
            //@ts-ignore
            return state.projects;
        },
        searchDialogOpen(state) {
            return state.searchDialogOpen;
        },
        credentialsDialogOpen(state) {
            return state.credentialsDialogOpen;
        },
        refreshTime(state) {
            return state.refreshTime;
        },
        zoomFactor(state) {
            return state.zoomFactor;
        },
        theme(state) {
            return state.theme;
        }
    },
    mutations: {
        setCurrentIssueKey(state, payload) {
            state.currentIssueKey = payload;
        },
        setCurrentSort(state, payload) {
            state.currentSort = payload;
        },
        setCurrentJiraConfig(state, payload) {
            state.selectedJiraConfig = payload;
        },
        setJiraConfigs(state, payload) {
            state.jiraConfigs = payload;
        },
        setProjects(state, payload) {
            // @ts-ignore
            state.projects.push(...payload);
        },
        setSearchDialogOpen(state, payload) {
            state.searchDialogOpen = payload;
        },
        setCredentialsDialogOpen(state, payload) {
            state.credentialsDialogOpen = payload;
        },
        setRefreshTime(state, payload) {
            state.refreshTime = payload;
        },
        setZoomFactor(state, payload) {
            state.zoomFactor = payload;
        },
        setTheme(state, payload) {
            Object.assign(state.theme, payload);
        }
    },
    actions: {
        setCurrentIssueKey(context, payload) {
            context.commit("setCurrentIssueKey", payload);
        },
        setCurrentSort(context, payload) {
            context.commit("setCurrentSort", payload);
        },
        setCurrentJiraConfig(context, payload) {
            context.commit("setCurrentJiraConfig", payload);
        },
        setJiraConfigs(context, payload) {
            context.commit("setJiraConfigs", payload);
        },
        setProjects(context, payload) {
            const projects = [];
            for (const project of payload) {
                const index = context.state.projects.findIndex((x) => x.path === project.path);
                if (index === -1) {
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
        setSearchDialogOpen(context, payload) {
            context.commit("setSearchDialogOpen", payload);
        },
        setCredentialsDialogOpen(context, payload) {
            context.commit("setCredentialsDialogOpen", payload);
        },
        setRefreshTime(context, payload) {
            context.commit("setRefreshTime", payload);
        },
        setZoomFactor(context, payload) {
            context.commit("setZoomFactor", payload);
        },
        setTheme(context, payload) {
            context.commit("setTheme", payload);
        }
    }
});
export default store;
export const currentIssue = computed(() => JiraController &&
    JiraController.issues.value?.find((issue) => issue.task.key === currentIssueKey.value));
export const currentIssueKey = computed({
    get() {
        return store.getters.currentIssueKey;
    },
    set(value) {
        store.dispatch("setCurrentIssueKey", value);
    }
});
export const currentSort = computed({
    get() {
        return store.getters.currentSort;
    },
    set(value) {
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
export const jiraConfigs = computed({
    get() {
        return store.getters.jiraConfigs;
    },
    set(value) {
        store.dispatch("setJiraConfigs", value);
    }
});
export const projects = computed({
    get() {
        return store.getters.projects;
    },
    set(value) {
        store.dispatch("setProjects", value);
    }
});
export const searchOpen = computed({
    get() {
        return store.getters.searchDialogOpen;
    },
    set(value) {
        store.dispatch("setSearchDialogOpen", value);
    }
});
export const credentialsOpen = computed({
    get() {
        return store.getters.credentialsDialogOpen;
    },
    set(value) {
        store.dispatch("setCredentialsDialogOpen", value);
    }
});
export const refreshTime = computed({
    get() {
        return store.getters.refreshTime;
    },
    set(value) {
        store.dispatch("setRefreshTime", value);
    }
});
export const zoomFactor = computed({
    get() {
        return store.getters.zoomFactor;
    },
    set(value) {
        store.dispatch("setZoomFactor", value);
    }
});
export const theme = computed({
    get() {
        return store.getters.theme;
    },
    set(value) {
        store.dispatch("setTheme", value);
    }
});
//# sourceMappingURL=jira.store.js.map