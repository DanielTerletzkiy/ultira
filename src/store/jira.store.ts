import {createStore} from "vuex";
import VuexPersistence from "vuex-persist";
import {computed} from "vue";

const store = createStore({
    plugins: [new VuexPersistence().plugin],
    state: {
        selectedIssue: '',
        selectedJiraConfig: '',
        jiraConfigs: [{
            name: "sample",
            url: "https://"
        }],
        credentialsDialogOpen: false,
        refreshTime: 30,
    },
    getters: {
        selectedIssue(state): string | undefined {
            return state.selectedIssue;
        },
        currentJiraConfig(state): string | undefined {
            return state.selectedJiraConfig;
        },
        jiraConfigs(state): Array<{ name: string, url: string }> {
            return state.jiraConfigs;
        },
        credentialsDialogOpen(state): boolean {
            return state.credentialsDialogOpen;
        },
        refreshTime(state): number {
            return state.refreshTime;
        }
    },
    mutations: {
        setSelectedIssue(state, payload: string) {
            state.selectedIssue = payload;
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
        }
    },
    actions: {
        setSelectedIssue(context, payload: string) {
            context.commit('setSelectedIssue', payload);
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

export const currentJiraConfig = computed({
    get() {
        return store.getters.currentJiraConfig
    },
    set(value) {
        store.dispatch('setCurrentJiraConfig', value)
    },
});

export const jiraConfigs = computed<Array<{ name: string, url: string }>>({
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
