<template>
  <div class="action">
    <JiraCredentialsDialog class="dialog" v-model:open="credentialsOpen" :name="selectedJiraConfig"
                           @submit="onCredentialsSubmit"/>
    <d-tab-list color="primary" elevation="2" v-model="selectedJiraConfig">
      <d-list-item v-for="jira in jiraConfigs" :key="jira.name" v-use-longpress
                   @longpress="()=>jira.name === selectedJiraConfig ? openCredentials() : null">
        {{ jira.name }}
      </d-list-item>
    </d-tab-list>
  </div>
</template>

<script setup lang="ts">
import JiraCredentialsDialog from "./JiraCredentialsDialog.vue";
import {credentialsOpen, selectedJiraConfig, jiraConfigs} from "../store/jira.store";

function openCredentials() {
  credentialsOpen.value = true;
}

function onCredentialsSubmit(credentials: { username: string, password: string }) {
  credentialsOpen.value = false
  localStorage.setItem(`${selectedJiraConfig.value}Cred`, JSON.stringify(credentials))
}

</script>

<style scoped lang="scss">
.dialog ::v-deep(.d-dialog) {
  position: fixed;
}
</style>
