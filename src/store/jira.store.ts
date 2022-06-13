import {createStore} from "vuex";
import VuexPersistence from "vuex-persist";
import {computed} from "vue";
import {JiraConfiguration, SortNames} from "../../types/Jira";
import ApplicationType = JiraConfiguration.ApplicationType;
import JiraConfig = JiraConfiguration.JiraConfig;

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
        credentialsDialogOpen: false,
        refreshTime: 60,
        zoomFactor: 1,
    },
    getters: {
        selectedIssue(state): string | undefined {
            return state.selectedIssue;
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
        setSelectedIssue(state, payload: string) {
            state.selectedIssue = payload;
        },
        setCurrentSort(state, payload: SortNames) {
            state.currentSort = payload;
        },
        setCurrentJiraConfig(state, payload: string) {
            state.selectedJiraConfig = payload;
        },
        setJiraConfigs(state, payload) {
            state.jiraConfigs = payload;
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
        setSelectedIssue(context, payload: string) {
            context.commit('setSelectedIssue', payload);
        },
        setCurrentSort(context, payload: SortNames) {
            context.commit('setCurrentSort', payload);
        },
        setCurrentJiraConfig(context, payload: string) {
            context.commit('setCurrentJiraConfig', payload);
        },
        setJiraConfigs(context, payload) {
            context.commit('setJiraConfigs', payload);
        },
        setCredentialsDialogOpen(context, payload: boolean) {
            context.commit('setCredentialsDialogOpen', payload);
        },
        setRefreshTime(context, payload: number) {
            context.commit('setRefreshTime', payload);
        },
        setZoomFactor(context, payload: number) {
            context.commit('setZoomFactor', payload);
        }
    },
})

export default store;

export const selectedIssue = computed({
    get() {
        return store.getters.selectedIssue
    },
    set(value: string) {
        store.dispatch('setSelectedIssue', value)
    },
});

export const currentSort = computed({
    get() {
        return store.getters.currentSort
    },
    set(value: SortNames) {
        store.dispatch('setCurrentSort', value)
    },
});

export const selectedJiraConfig = computed({
    get() {
        return store.getters.currentJiraConfig
    },
    set(value) {
        store.dispatch('setCurrentJiraConfig', value)
    },
});

export const jiraConfigs = computed<Array<JiraConfig>>({
    get() {
        return store.getters.jiraConfigs
    },
    set(value) {
        store.dispatch('setJiraConfigs', value)
    }
})

export const credentialsOpen = computed({
    get() {
        return store.getters.credentialsDialogOpen
    },
    set(value: boolean) {
        store.dispatch('setCredentialsDialogOpen', value)
    }
});

export const refreshTime = computed<number>({
    get() {
        return store.getters.refreshTime
    },
    set(value: number) {
        store.dispatch('setRefreshTime', value)
    }
})

export const zoomFactor = computed<number>({
    get() {
        return store.getters.zoomFactor
    },
    set(value: number) {
        store.dispatch('setZoomFactor', value)
    }
})
