import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { computed } from "vue";
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
        selectedIssue(state) {
            return state.selectedIssue;
        },
        currentJiraConfig(state) {
            return state.selectedJiraConfig;
        },
        jiraConfigs(state) {
            return state.jiraConfigs;
        },
        credentialsDialogOpen(state) {
            return state.credentialsDialogOpen;
        },
        refreshTime(state) {
            return state.refreshTime;
        }
    },
    mutations: {
        setSelectedIssue(state, payload) {
            state.selectedIssue = payload;
        },
        setCurrentJiraConfig(state, payload) {
            state.selectedJiraConfig = payload;
        },
        setJiraConfigs(state, payload) {
            state.jiraConfigs = payload;
        },
        setCredentialsDialogOpen(state, payload) {
            state.credentialsDialogOpen = payload;
        },
        setRefreshTime(state, payload) {
            state.refreshTime = payload;
        }
    },
    actions: {
        setSelectedIssue(context, payload) {
            context.commit('setSelectedIssue', payload);
        },
        setCurrentJiraConfig(context, payload) {
            context.commit('setCurrentJiraConfig', payload);
        },
        setJiraConfigs(context, payload) {
            context.commit('setJiraConfigs', payload);
        },
        setCredentialsDialogOpen(context, payload) {
            context.commit('setCredentialsDialogOpen', payload);
        },
        setRefreshTime(context, payload) {
            context.commit('setRefreshTime', payload);
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
export const currentJiraConfig = computed({
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
//# sourceMappingURL=jira.store.js.map