import { searchOpen, historyOpen } from "../store/jira.store";

export default class DomListener {
  static init() {
    window.addEventListener("keydown", (event) => {
      if (event.code == "KeyS" && event.ctrlKey && event.shiftKey) {
        console.log("toggle search");
        searchOpen.value = !searchOpen.value;
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.code == "KeyH" && event.ctrlKey && event.shiftKey) {
        console.log("toggle history");
        historyOpen.value = !historyOpen.value;
      }
    });
  }
}
