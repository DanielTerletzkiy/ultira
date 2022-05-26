import { createStore } from "vuex";
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
        currentJiraConfig(state) {
            return state.selectedJiraConfig;
        },
        jiraConfigs(state) {
            return state.jiraConfigs;
        },
        credentialsDialogOpen(state) {
            return state.credentialsDialogOpen;
        },
    },
    mutations: {
        setCurrentJiraConfig(state, payload) {
            state.selectedJiraConfig = payload;
        },
        setJiraConfigs(state, payload) {
            state.jiraConfigs = payload;
        },
        setCredentialsDialogOpen(state, payload) {
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
        setCredentialsDialogOpen(context, payload) {
            context.commit('setCredentialsDialogOpen', payload);
        },
    },
});
//# sourceMappingURL=jira.store.js.map