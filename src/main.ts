import {createApp} from 'vue'
import vuelize from "vuelize/src/index"
// @ts-ignore
import {vLongpress} from "@nanogiants/vue3-longpress";
import jiraStore from "./store/jira.store";
import 'v3-transitions/dist/style.css'
import App from './App.vue'

createApp(App)
    .use(jiraStore)
    .use(vuelize)
    .directive('use-longpress', vLongpress)
    .mount('#app')
