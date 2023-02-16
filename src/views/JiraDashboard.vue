<template>
  <d-column gap block style="position: relative">
    <d-card v-if="selectedJiraConfig" background-color="transparent" block>
      <d-column :wrap="false">
        <d-row
          :wrap="false"
          style="flex: 1; max-height: 500px; min-height: 500px"
        >
          <JiraInfoView
            v-if="currentIssue"
            class="card"
            style="flex: 1; min-height: inherit; max-height: inherit"
          />
          <JiraBranchView
            v-if="currentIssue"
            class="card"
            style="flex: 1; max-height: 500px; min-height: 500px"
          />
        </d-row>
        <d-row
          :wrap="false"
          style="flex: 1; max-width: calc(100vw - 16px)"
          align="stretch"
        >
          <JiraList
            class="card card--bottom"
            style="flex: 3"
            v-if="selectedJiraConfig && JiraController.issues.value"
            v-model="currentIssueKey"
            :issue-list="JiraController.issues.value"
          />
          <JiraCommentsView
            class="card card--bottom"
            style="flex: 1"
            v-if="currentIssue"
          />
          <JiraPullRequestView
            class="card card--bottom"
            style="flex: 3"
            v-if="currentIssue"
          />
        </d-row>
      </d-column>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, watch } from "vue";
import jiraStore, {
  credentialsOpen,
  jiraConfigs,
  projects,
  currentIssueKey,
  selectedJiraConfig,
  currentIssue,
  changeSteps
} from "../store/jira.store";
import JiraBaseController from "../controller/JiraBaseController";
import JiraController from "../controller/JiraController";
import JiraList from "../components/JiraList.vue";
import JiraInfoView from "../components/JiraInfoView.vue";
import JiraBranchView from "../components/JiraBranchView.vue";
import JiraPullRequestView from "../components/JiraPullRequestView.vue";
import JiraCommentsView from "../components/JiraCommentsView.vue";
import ProjectController from "../controller/ProjectController";
import { State } from "vuelize/src/types/Vuelize";
import { JiraConfig } from "../../types/Jira";

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;
const currentJiraConfig = computed<JiraConfig>(
  () =>
    jiraConfigs.value?.find(
      (base: { id: string }) => base.id === selectedJiraConfig.value
    ) as JiraConfig
);

watch(() => currentIssueKey.value, connectCurrentData);
watch(() => selectedJiraConfig.value, setJiraBase);
watch(
  () => jiraConfigs.value,
  () => setJiraBase(selectedJiraConfig.value),
  { deep: true }
);

async function setJiraBase(id: string) {
  console.log("baseName", id);
  if (localStorage.getItem(`${id}Cred`)) {
    let cookieCredentials;
    try {
      cookieCredentials = JSON.parse(localStorage.getItem(`${id}Cred`) || "{}");
    } catch (e) {
      credentialsOpen.value = true;
      return;
    }
    if (!currentJiraConfig.value) {
      credentialsOpen.value = true;
      return;
    }
    //selectedJiraConfig.value = name;
    JiraController.clearIssues();
    JiraController.setBase(
      new JiraBaseController({
        ...currentJiraConfig.value,
        credentials: cookieCredentials
      })
    );
    await JiraController.getAllIssues();
    await JiraController.getMyself();
    connectCurrentData();
  } else {
    vuelize.notify(
      "Credentials",
      `Submit your config credentials in the settings`,
      State.Info
    );
  }
}

function connectCurrentData() {
  if (currentIssue.value) {
    currentIssue.value.getConnectedData();
  }
}

onMounted(() => {
  setJiraBase(selectedJiraConfig.value);
  ProjectController.subscribe((resProjects) => {
    console.log("projects: ", resProjects);
    projects.value = resProjects;
    vuelize.notify(
      "Scraper",
      `Found ${resProjects.length} Projects`,
      State.Success
    );
  });

  ProjectController.subscribeBranches((resProjects) => {
    console.log("projects branches: ", resProjects);
    jiraStore.dispatch("setProjects", resProjects);
  });

  ProjectController.subscribeChangeStep((resChangeSteps) => {
    console.log("changeSteps: ", resChangeSteps);
    changeSteps.value = resChangeSteps;
  });

  setInterval(() => {
    ProjectController.scrapeBranches(
      projects.value.map((project) => project.path)
    );
  }, 300000);
});
</script>

<style scoped lang="scss">
.card {
  margin: 6px 3px;

  &--bottom {
    max-height: calc(100vh - 60px - 500px);
    overflow: auto;
    overflow-x: hidden;
    min-width: 0;
    flex: 1;
  }

  > * {
    word-break: break-word;
  }
}
</style>
