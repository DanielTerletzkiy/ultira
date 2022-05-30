<template>
  <d-column gap block>
    <d-card v-if="currentJiraConfig" block style="max-height: calc(100vh - 86px); overflow: hidden">
      <d-column gap>
        <d-row gap style="flex: 1; max-height: 500px; min-height: 500px;">
          <d-column block v-if="currentIssue" style="min-height: inherit; max-height: inherit">
            <JiraInfoView :item="currentIssue"/>
          </d-column>
          <d-column block v-if="currentIssue"
                    style="flex: 1; max-height: 500px; min-height: 500px;">
            <JiraBranchView :item="currentIssue"/>
          </d-column>
        </d-row>
        <d-row gap style="flex: 1;" align="stretch">
          <d-column elevation="n1" v-if="currentJiraConfig && jiraController"
                    style="flex: 1;
                     max-height: calc(100vh - 86px - 16px - 500px);
                     overflow: overlay;
                     overflow-x: hidden;
                     min-width: fit-content;">
            <JiraList v-model="selectedIssue"/>
          </d-column>
          <d-column block style="flex: 2;">
            <JiraCommentsView/>
          </d-column>
          <d-column block style="flex: 3;">
            <JiraPullRequestView/>
          </d-column>
        </d-row>
      </d-column>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, provide, ref, watch} from "vue";
import {useStore} from "vuex";
import JiraBaseController from "../controller/JiraBaseController";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
import JiraList from "../components/JiraList.vue";
import JiraInfoView from "../components/JiraInfoView.vue";
import {credentialsOpen, currentJiraConfig, selectedIssue} from "../store/jira.store";
import JiraBranchView from "../components/JiraBranchView.vue";
import JiraPullRequestView from "../components/JiraPullRequestView.vue";
import JiraCommentsView from "../components/JiraCommentsView.vue";

const store = useStore()
const jiraConfigs = computed(() => store.getters.jiraConfigs)

const currentIssue = computed<JiraTask | undefined>(() => jiraController.value && jiraController.value?.issues?.find((issue: JiraTask) => issue.task.key === selectedIssue.value) as JiraTask | undefined)

const jiraController = ref<JiraController>();
provide('JiraController', jiraController);

watch(() => currentJiraConfig.value, setJiraBase);

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
    const selectedJiraBase = jiraConfigs.value?.find((base: { name: string; }) => base.name === currentJiraConfig.value);
    if (!selectedJiraBase) {
      credentialsOpen.value = true;
      return;
    }
    await store.dispatch('setCurrentJiraConfig', name);
    jiraController.value = new JiraController(new JiraBaseController(selectedJiraBase.url, selectedJiraBase.name, cookieCredentials))
    jiraController.value?.getAllIssues();
    jiraController.value?.getAllIssues(); //TODO try to figure out how to get branch/pr to be reactive, setting ref in JiraTask is not working as expected
  } else {
    credentialsOpen.value = true;
  }
}

onBeforeMount(() => {
  setJiraBase(currentJiraConfig.value)
})
</script>

<style scoped lang="scss">

</style>
