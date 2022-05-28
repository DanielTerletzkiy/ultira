<template>
  <div class="action">
    <JiraCredentialsDialog class="dialog" v-model:open="credentialsOpen" :name="currentJiraConfig"
                           @submit="onCredentialsSubmit"/>
    <d-tab-list color="primary" elevation="2" v-model="currentJiraConfig">
      <d-list-item v-for="jira in jiraConfigs" :key="jira.name" v-use-longpress
                   @longpress="()=>jira.name === currentJiraConfig ? openCredentials() : null">
        {{ jira.name }}
      </d-list-item>
    </d-tab-list>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useStore} from "vuex";
import JiraCredentialsDialog from "./JiraCredentialsDialog.vue";
import {credentialsOpen, currentJiraConfig} from "../store/jira.store";

const store = useStore()
const jiraConfigs = computed(() => store.getters.jiraConfigs)

function openCredentials() {
  credentialsOpen.value = true;
}

function onCredentialsSubmit(credentials: { username: string, password: string }) {
  credentialsOpen.value = false
  localStorage.setItem(`${currentJiraConfig.value}Cred`, JSON.stringify(credentials))
}

</script>

<style scoped lang="scss">
.dialog ::v-deep(.d-dialog) {
  position: fixed;
}
</style>
