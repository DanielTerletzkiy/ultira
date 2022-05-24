<template>
  <JiraCredentialsDialog v-model:open="credentialsOpen" :name="selectedBase" @submit="onCredentialsSubmit"/>
  <d-column gap block>
    <d-row>
      <d-spacer/>
      <d-tab-list color="primary" showIndicator filled outlined v-model="selectedBase">
        <d-list-item v-for="jira in jiraBases" :key="jira.name" v-use-longpress
                     @longpress="()=>jira.name === selectedBase ? openCredentials() : null">
          {{ jira.name }}
        </d-list-item>
      </d-tab-list>
    </d-row>
    <d-card block style="max-height: calc(100vh - 63px - 84px); overflow: hidden">
      <d-column gap>
        <d-row gap style="flex: 1; min-height: 450px">
          <d-column block v-if="currentIssue" style="min-height: inherit;">
            <JiraInfoView :item="currentIssue"/>
          </d-column>
          <d-column style="flex: 1">

          </d-column>
        </d-row>
        <d-row gap style="flex: 1;">
          <d-column elevation="n1" v-if="selectedBase && jiraController?.issues.length"
                    style="flex: 1;
                     max-height: calc(100vh - 63px - 84px - 16px - 450px);
                     overflow: overlay;
                     overflow-x: hidden;
                     min-width: fit-content;">
            <JiraList v-model="selectedIssue"/>
          </d-column>
          <d-column style="flex: 2">

          </d-column>
        </d-row>
      </d-column>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, provide, ref, watch} from "vue";
import JiraBaseController from "../controller/JiraBaseController";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
import JiraCredentialsDialog from "../components/JiraCredentialsDialog.vue";
import JiraList from "../components/JiraList.vue";
import JiraInfoView from "../components/JiraInfoView.vue";

const jiraBases = ref<Array<{ name: string, url: string }>>(
    [
      {
        "name": "CHECK24",
        "url": "https://jira.check24.de"
      },
      {
        "name": "Personal",
        "url": "https://d-terletzkiy.atlassian.net"
      }
    ]
);
const selectedBase = ref<string>();
const selectedIssue = ref<string>();

const currentIssue = computed<JiraTask | undefined>(() => jiraController.value && jiraController.value?.issues?.find((issue: JiraTask) => issue.task.id === selectedIssue.value) as JiraTask | undefined)

const jiraController = ref<JiraController>();
provide('JiraController', jiraController);

const credentialsOpen = ref<boolean>(false);

function onCredentialsSubmit(credentials: { username: string, password: string }) {
  console.log(credentials);
  credentialsOpen.value = false
  localStorage.setItem(`${selectedBase.value}Cred`, JSON.stringify(credentials))
}

function openCredentials() {
  credentialsOpen.value = true;
}

watch(() => selectedBase.value, setJiraBase);

async function setJiraBase(name: any) {
  if (localStorage.getItem(`${name}Cred`)) {
    let cookieCredentials;
    try {
      cookieCredentials = JSON.parse(localStorage.getItem(`${name}Cred`) || '{}');
    } catch (e) {
      credentialsOpen.value = true;
      return;
    }
    const selectedJiraBase = jiraBases.value?.find((base) => base.name === selectedBase.value);
    if (!selectedJiraBase) {
      credentialsOpen.value = true;
      return;
    }
    jiraController.value = new JiraController(new JiraBaseController(selectedJiraBase.url, selectedJiraBase.name, cookieCredentials))
    jiraController.value?.getAllIssues();
    localStorage.setItem('jiraBases', name)
  } else {
    credentialsOpen.value = true;
  }
}

onBeforeMount(async () => {
  console.log(jiraBases.value)
  const baseKey = localStorage.getItem('jiraBases');
  selectedBase.value = baseKey || undefined
})
</script>

<style scoped lang="scss">

</style>
