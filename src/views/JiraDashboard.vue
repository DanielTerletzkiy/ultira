<template>
  <d-column gap block>
    <d-card v-if="selectedJiraConfig" block style="max-height: calc(100vh - 86px); overflow: hidden">
      <d-column gap :wrap="false">
        <d-row gap :wrap="false" style="flex: 1; max-height: 500px; min-height: 500px;">
          <d-column block :wrap="false" v-if="currentIssue" style="flex: 1; min-height: inherit; max-height: inherit">
            <JiraInfoView :item="currentIssue"/>
          </d-column>
          <d-column block :wrap="false" v-if="currentIssue"
                    style="flex: 1; max-height: 500px; min-height: 500px;">
            <JiraBranchView :item="currentIssue"/>
          </d-column>
        </d-row>
        <d-row gap :wrap="false" style="flex: 1;" align="stretch">
          <d-column class="bottom-card" :wrap="false" elevation="n1" v-if="selectedJiraConfig && jiraController"
                    style="flex: 3;">
            <JiraList v-model="selectedIssue"/>
          </d-column>
          <d-column class="bottom-card" :wrap="false" style="flex: 1;">
            <JiraCommentsView :item="currentIssue"/>
          </d-column>
          <d-column class="bottom-card" :wrap="false" style="flex: 3;">
            <JiraPullRequestView :item="currentIssue"/>
          </d-column>
        </d-row>
      </d-column>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, provide, ref, watch} from "vue";
import {credentialsOpen, selectedJiraConfig, jiraConfigs, selectedIssue} from "../store/jira.store";
import JiraBaseController from "../controller/JiraBaseController";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
import JiraList from "../components/JiraList.vue";
import JiraInfoView from "../components/JiraInfoView.vue";
import JiraBranchView from "../components/JiraBranchView.vue";
import JiraPullRequestView from "../components/JiraPullRequestView.vue";
import JiraCommentsView from "../components/JiraCommentsView.vue";
import {JiraConfiguration} from "../../types/Jira";
import JiraConfig = JiraConfiguration.JiraConfig;

const currentIssue = computed<JiraTask | undefined>(() => jiraController.value && jiraController.value?.issues?.find((issue: JiraTask) => issue.task.key === selectedIssue.value) as JiraTask | undefined)
const currentJiraConfig = computed<JiraConfig>(() => jiraConfigs.value?.find((base: { name: string; }) => base.name === selectedJiraConfig.value) as JiraConfig);

const jiraController = ref<JiraController>();
provide('JiraController', jiraController);

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
    jiraController.value = new JiraController(new JiraBaseController({
      ...currentJiraConfig.value,
      credentials: cookieCredentials
    }))
    jiraController.value?.getAllIssues();
    jiraController.value?.getAllIssues(); //TODO try to figure out how to get branch/pr to be reactive, setting ref in JiraTask is not working as expected
  } else {
    credentialsOpen.value = true;
  }
}

onMounted(() => {
  setJiraBase(selectedJiraConfig.value)
})
</script>

<style scoped lang="scss">
.bottom-card {
  max-height: calc(100vh - 86px - 16px - 500px);
  overflow: overlay;
  overflow-x: hidden;
  //min-width: fit-content;
  min-width: 0;

  > * {
    word-break: break-word;
  }
}
</style>
