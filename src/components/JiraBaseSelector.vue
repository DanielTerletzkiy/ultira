<template>
  <d-card class="action">
    <JiraCredentialsDialog
      class="dialog"
      v-model:open="credentialsOpen"
      :name="jiraConfigs.find((config)=>config.id === selectedJiraConfig).name"
      @submit="onCredentialsSubmit"
    />
    <d-tab-list
      class="action"
      color="primary"
      elevation="2"
      v-model="selectedJiraConfig"
    >
      <d-list-item
        v-for="jira in jiraConfigs"
        :key="jira.id"
        style="min-height: 0"
        v-use-longpress
        @longpress="
          () => (jira.id === selectedJiraConfig ? openCredentials() : null)
        "
      >
        {{ jira.name }}
      </d-list-item>
    </d-tab-list>
  </d-card>
</template>

<script setup lang="ts">
import JiraCredentialsDialog from "./JiraCredentialsDialog.vue";
import {
  credentialsOpen,
  jiraConfigs,
  selectedJiraConfig,
} from "../store/jira.store";
import { onMounted } from "vue";

function openCredentials() {
  credentialsOpen.value = true;
}

function onCredentialsSubmit(credentials: {
  username: string;
  password: string;
}) {
  credentialsOpen.value = false;
  localStorage.setItem(
    `${selectedJiraConfig.value}Cred`,
    JSON.stringify(credentials)
  );
}

onMounted(() => {
  if (
    jiraConfigs.value.findIndex(
      (config) => selectedJiraConfig.value === config.id
    ) < 0
  ) {
    selectedJiraConfig.value = jiraConfigs.value[0].id;
  }
});
</script>

<style scoped lang="scss">
.dialog ::v-deep(.d-dialog) {
  position: fixed;
}
.action {
  max-height: 20px;
}
</style>
