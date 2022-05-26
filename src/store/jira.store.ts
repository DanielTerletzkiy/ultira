import {createStore} from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
    plugins: [new VuexPersistence().plugin],
    state: {
        selectedJiraConfig: '',
        jiraConfigs: [{
            name: "sample",
            url: "https://"
        }],
        credentialsDialogOpen: false,
    },
    getters: {
        currentJiraConfig(state): string | undefined {
            return state.selectedJiraConfig;
        },
        jiraConfigs(state): Array<{ name: string, url: string }> {
            return state.jiraConfigs;
        },
        credentialsDialogOpen(state): boolean {
            return state.credentialsDialogOpen
        },
    },
    mutations: {
        setCurrentJiraConfig(state, payload: string) {
            state.selectedJiraConfig = payload;
        },
        setJiraConfigs(state, payload) {
            state.jiraConfigs = payload;
        },
        setCredentialsDialogOpen(state, payload: boolean) {
            state.credentialsDialogOpen = payload;
        },
    },
    actions: {
        setCurrentJiraConfig(context, payload) {
            context.commit('setCurrentJiraConfig', payload);
        },
        setJiraConfigs(context, payload) {
            context.commit('setJiraConfigs', payload);
        },
        setCredentialsDialogOpen(context, payload: boolean) {
            context.commit('setCredentialsDialogOpen', payload);
        },
    },
})
