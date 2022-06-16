import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { computed } from "vue";
import { JiraConfiguration, SortNames } from "../../types/Jira";
var ApplicationType = JiraConfiguration.ApplicationType;
const store = createStore({
    plugins: [new VuexPersistence().plugin],
    state: {
        selectedIssue: '',
        currentSort: SortNames.Latest,
        selectedJiraConfig: '',
        jiraConfigs: [{
                name: "sample",
                url: "https://",
                applicationType: ApplicationType.Bitbucket
            }],
        projects: [{
                path: '',
                project: ''
            }],
        credentialsDialogOpen: false,
        refreshTime: 60,
        zoomFactor: 1,
    },
    getters: {
        selectedIssue(state) {
            return state.selectedIssue;
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
            return state.projects;
        },
        credentialsDialogOpen(state) {
            return state.credentialsDialogOpen;
        },
        refreshTime(state) {
            return state.refreshTime;
        },
        zoomFactor(state) {
            return state.zoomFactor;
        }
    },
    mutations: {
        setSelectedIssue(state, payload) {
            state.selectedIssue = payload;
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
            state.projects = payload;
        },
        setCredentialsDialogOpen(state, payload) {
            state.credentialsDialogOpen = payload;
        },
        setRefreshTime(state, payload) {
            state.refreshTime = payload;
        },
        setZoomFactor(state, payload) {
            state.zoomFactor = payload;
        }
    },
    actions: {
        setSelectedIssue(context, payload) {
            context.commit('setSelectedIssue', payload);
        },
        setCurrentSort(context, payload) {
            context.commit('setCurrentSort', payload);
        },
        setCurrentJiraConfig(context, payload) {
            context.commit('setCurrentJiraConfig', payload);
        },
        setJiraConfigs(context, payload) {
            context.commit('setJiraConfigs', payload);
        },
        setProjects(context, payload) {
            context.commit('setProjects', payload);
        },
        setCredentialsDialogOpen(context, payload) {
            context.commit('setCredentialsDialogOpen', payload);
        },
        setRefreshTime(context, payload) {
            context.commit('setRefreshTime', payload);
        },
        setZoomFactor(context, payload) {
            context.commit('setZoomFactor', payload);
        }
    },
});
export default store;
export const selectedIssue = computed({
    get() {
        return store.getters.selectedIssue;
    },
    set(value) {
        store.dispatch('setSelectedIssue', value);
    },
});
export const currentSort = computed({
    get() {
        return store.getters.currentSort;
    },
    set(value) {
        store.dispatch('setCurrentSort', value);
    },
});
export const selectedJiraConfig = computed({
    get() {
        return store.getters.currentJiraConfig;
    },
    set(value) {
        store.dispatch('setCurrentJiraConfig', value);
    },
});
export const jiraConfigs = computed({
    get() {
        return store.getters.jiraConfigs;
    },
    set(value) {
        store.dispatch('setJiraConfigs', value);
    }
});
export const projects = computed({
    get() {
        return store.getters.projects;
    },
    set(value) {
        store.dispatch('setProjects', value);
    }
});
export const credentialsOpen = computed({
    get() {
        return store.getters.credentialsDialogOpen;
    },
    set(value) {
        store.dispatch('setCredentialsDialogOpen', value);
    }
});
export const refreshTime = computed({
    get() {
        return store.getters.refreshTime;
    },
    set(value) {
        store.dispatch('setRefreshTime', value);
    }
});
export const zoomFactor = computed({
    get() {
        return store.getters.zoomFactor;
    },
    set(value) {
        store.dispatch('setZoomFactor', value);
    }
});
//# sourceMappingURL=jira.store.js.map