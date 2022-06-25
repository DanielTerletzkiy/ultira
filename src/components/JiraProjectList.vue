<template>
  <d-column v-if="projects.length>0" gap elevation="4" class="ma-3">
    <d-row v-for="project in projects" glow width="auto" class="px-3">
      <d-column class="project">
        <d-card-title class="title">
          {{ project.project }}
        </d-card-title>
        <d-card-subtitle class="path">
          {{ project.path }}
        </d-card-subtitle>
      </d-column>
      <d-spacer/>
      <d-button v-if="project.branch" color="secondary" :disabled="!issueExists(project.branch)"
                @click="setIssue(project.branch)">
        {{ project.branch }}
      </d-button>
      <JiraProjectButton :repository="project.project"/>
    </d-row>
  </d-column>
</template>

<script setup lang="ts">
import {projects, selectedIssue} from "../store/jira.store";
import JiraProjectButton from "./JiraProjectButton.vue";
import {inject} from "vue";
import JiraController from "../controller/JiraController";

const jiraController = inject('JiraController') as { value: JiraController };

function setIssue(branch: string) {
  selectedIssue.value = branch;
}

function issueExists(branch: string): boolean {
 return jiraController.value.issues.findIndex((issue)=>issue.task.key === branch) > -1
}
</script>

<style scoped lang="scss">
.project {
  .title {
    font-size: 1.2rem;
    font-weight: 600;
  }
}
</style>
