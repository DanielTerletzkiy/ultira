<template>
  <d-column gap block style="position: relative">
    <d-card v-if="selectedJiraConfig" background-color="transparent" block>
      <d-column :wrap="false" gap style="height: calc(100vh - 2.6rem);">
        <d-row
          :wrap="false"
          class="top"
          align="stretch"
        >
          <JiraInfoView
            v-if="currentIssue"
            class="card"
            style="flex: 1;"
          />
          <JiraBranchView
            v-if="currentIssue"
            class="card"
            style="flex: 1;"
            canHide
          />
        </d-row>
        <d-row
          :wrap="false"
          class="bottom"
          align="stretch"
        >
          <JiraList
            class="card"
            style="flex: 3"
            v-if="selectedJiraConfig && JiraController.issues.value"
            v-model="currentIssueKey"
            :issue-list="JiraController.issues.value"
          />
          <JiraCommentsView
            class="card"
            style="flex: 1"
            v-if="currentIssue"
            canHide
          />
          <JiraPullRequestView
            class="card"
            style="flex: 3"
            v-if="currentIssue"
            canHide
          />
        </d-row>
      </d-column>
    </d-card>
  </d-column>
  <d-dialog
    :model-value="!!currentDialogComponent"
    @update:model-value="() => setDialog(null)"
  >
    <d-row
      :wrap="false"
      class="dialog-component"
      align="stretch"
    >
      <Component :is="currentDialogComponent" />
    </d-row>
  </d-dialog>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import jiraStore, {
  credentialsOpen,
  jiraConfigs,
  projects,
  currentIssueKey,
  selectedJiraConfig,
  currentIssue,
  changeSteps,
  scrapeTime, loading, currentDialogComponent
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

function setDialog(component: unknown) {
  console.log({ component });
  currentDialogComponent.value = component;
}

onMounted(() => {
  setJiraBase(selectedJiraConfig.value);

  ProjectController.subscribe((resProjects) => {
    console.log("projects: ", resProjects);
    jiraStore.dispatch("setProjects", resProjects);
    vuelize.notify(
      "Scraper",
      `Found ${resProjects.length} Projects`,
      State.Success
    );
    location.reload();
  });

  ProjectController.subscribeBranches((resProjects) => {
    console.log("projects branches: ", resProjects);
    jiraStore.dispatch("setProjects", resProjects);
  });

  ProjectController.subscribeChangeStep((resChangeSteps) => {
    console.log("changeSteps: ", resChangeSteps);
    changeSteps.value = resChangeSteps;
  });

  ProjectController.subscribeLoading((load) => {
    console.log( load );
    //@ts-ignore
    loading.value = load;
  });

  setInterval(() => {
    ProjectController.scrapeBranches(
      projects.value.map((project) => project.path)
    );
  }, scrapeTime.value * 1000);
});
</script>

<style scoped lang="scss">
.top {
  min-height: 50vh;
}

.bottom {
  min-height: calc(100vh - 60px - 50vh);
}

.card {
  margin: 0 4px;

  > * {
    word-break: break-word;
  }
}

.dialog-component {
  min-height: 80vh;
  min-width: 80vw;
  max-height: 80vh;
  max-width: 80vw;
}
</style>
