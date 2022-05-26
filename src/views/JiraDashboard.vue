<template>
  <d-column gap block>
    <d-card block style="max-height: calc(100vh - 86px); overflow: hidden" v-if="currentJiraConfig">
      <d-column gap>
        <d-row gap style="flex: 1; min-height: 450px">
          <d-column block v-if="currentIssue" style="min-height: inherit;">
            <JiraInfoView :item="currentIssue"/>
          </d-column>
          <d-column style="flex: 1">

          </d-column>
        </d-row>
        <d-row gap style="flex: 1;">
          <d-column elevation="n1" v-if="currentJiraConfig && jiraController"
                    style="flex: 1;
                     max-height: calc(100vh - 86px - 16px - 450px);
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
import {useStore} from "vuex";
import JiraBaseController from "../controller/JiraBaseController";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
import JiraList from "../components/JiraList.vue";
import JiraInfoView from "../components/JiraInfoView.vue";

const store = useStore()
const jiraConfigs = computed(() => store.getters.jiraConfigs)
const currentJiraConfig = computed(
    {
      get() {
        return store.getters.currentJiraConfig
      },
      set(value) {
        store.dispatch('setCurrentJiraConfig', value)
      },
    }
);

const selectedIssue = ref<string>();

const currentIssue = computed<JiraTask | undefined>(() => jiraController.value && jiraController.value?.issues?.find((issue: JiraTask) => issue.task.id === selectedIssue.value) as JiraTask | undefined)

const jiraController = ref<JiraController>();
provide('JiraController', jiraController);

const credentialsOpen = computed({
  get() {
    return store.getters.credentialsDialogOpen
  },
  set(value) {
    store.dispatch('setCredentialsDialogOpen', value)
  }
});

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
    jiraController.value = new JiraController(new JiraBaseController(selectedJiraBase.url, selectedJiraBase.name, cookieCredentials))
    jiraController.value?.getAllIssues();
    await store.dispatch('setCurrentJiraConfig', name);
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
