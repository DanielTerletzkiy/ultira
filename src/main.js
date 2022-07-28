import { createApp } from "vue";
import vuelize from "vuelize/src/index";
// @ts-ignore
import { vLongpress } from "@nanogiants/vue3-longpress";
import jiraStore from "./store/jira.store";
import App from "./App.vue";
import SocketClient from "./service/SocketIOClient";
import DomListener from "./dom/DomListener";
SocketClient.instance;
DomListener.init();
createApp(App)
    .use(jiraStore)
    .use(vuelize)
    .directive("use-longpress", vLongpress)
    .mount("#app");
//# sourceMappingURL=main.js.map