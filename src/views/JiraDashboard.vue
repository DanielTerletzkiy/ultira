<template>
  <d-column gap block style="position:relative;">
    <d-card v-if="selectedJiraConfig" background-color="transparent" block
            style="max-height: calc(100vh - 52px); overflow: hidden">
      <d-column gap :wrap="false">
        <d-row gap :wrap="false" style="flex: 1; max-height: 500px; min-height: 500px;">
          <d-column block :wrap="false" v-if="currentIssue" style="flex: 1; min-height: inherit; max-height: inherit">
            <JiraInfoView/>
          </d-column>
          <d-column block :wrap="false" v-if="currentIssue"
                    style="flex: 1; max-height: 500px; min-height: 500px;">
            <JiraBranchView/>
          </d-column>
        </d-row>
        <d-row gap :wrap="false" style="flex: 1;" align="stretch">
          <d-column class="bottom-card" :wrap="false" style="flex: 3;" v-if="selectedJiraConfig && JiraController.issues.value">
            <JiraList v-model="currentIssueKey" :issue-list="JiraController.issues.value"/>
          </d-column>
          <d-column class="bottom-card" :wrap="false" style="flex: 1;" v-if="currentIssue">
            <JiraCommentsView/>
          </d-column>
          <d-column class="bottom-card" :wrap="false" style="flex: 3;" v-if="currentIssue">
            <JiraPullRequestView/>
          </d-column>
        </d-row>
      </d-column>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, provide, ref, watch} from "vue";
import {
  credentialsOpen,
  jiraConfigs,
  projects,
  currentIssueKey,
  selectedJiraConfig,
  currentIssue
} from "../store/jira.store";
import JiraBaseController from "../controller/JiraBaseController";
import JiraController from "../controller/JiraController";
import JiraList from "../components/JiraList.vue";
import JiraInfoView from "../components/JiraInfoView.vue";
import JiraBranchView from "../components/JiraBranchView.vue";
import JiraPullRequestView from "../components/JiraPullRequestView.vue";
import JiraCommentsView from "../components/JiraCommentsView.vue";
import {JiraConfiguration} from "../../types/Jira";
import ProjectController from "../controller/ProjectController";
import {State} from "vuelize/src/types/Vuelize";
import JiraConfig = JiraConfiguration.JiraConfig;

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const currentJiraConfig = computed<JiraConfig>(() => jiraConfigs.value?.find((base: { name: string; }) => base.name === selectedJiraConfig.value) as JiraConfig);

watch(() => currentIssueKey.value, connectCurrentData);
watch(() => selectedJiraConfig.value, setJiraBase);
watch(() => currentJiraConfig.value, () => setJiraBase(selectedJiraConfig.value), {deep: true});

async function setJiraBase(name: any) {
  console.log('baseName', name)
  if (localStorage.getItem(`${name}Cred`)) {
    let cookieCredentials;
    try {
      cookieCredentials = JSON.parse(localStorage.getItem(`${name}Cred`) || '{}');
    } catch (e) {
      credentialsOpen.value = true;
      return;
    }
    if (!currentJiraConfig.value) {
      credentialsOpen.value = true;
      return;
    }
    selectedJiraConfig.value = name;
    JiraController.setBase(new JiraBaseController({
      ...currentJiraConfig.value,
      credentials: cookieCredentials
    }))
    await JiraController.getAllIssues();
    console.log(JiraController.issues.value)
    connectCurrentData();

  } else {
    credentialsOpen.value = true;
  }
}

function connectCurrentData() {
  if (currentIssue.value) {
    currentIssue.value.getConnectedData()
  }
}

onMounted(() => {
  setJiraBase(selectedJiraConfig.value);
  ProjectController.subscribe((resProjects) => {
    console.log('projects: ', resProjects)
    projects.value = resProjects;
    vuelize.notify('Scraper', `Found ${resProjects.length} Projects`, State.Success);
  });

  ProjectController.subscribeBranches((resProjects) => {
    console.log('projects branches: ', resProjects)
    projects.value = resProjects;
    vuelize.notify('Scraper', `Updated ${resProjects.length} Branches`, State.Success);
  });
})
</script>

<style scoped lang="scss">
.bottom-card {
  max-height: calc(100vh - 52px - 16px - 500px);
  overflow: auto;
  overflow-x: hidden;
  //min-width: fit-content;
  min-width: 0;

  > * {
    word-break: break-word;
  }
}
</style>
