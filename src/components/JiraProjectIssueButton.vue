<template>
  <d-button
    v-if="project.branch"
    :color="project.branch === currentIssueKey ? 'primary' : 'secondary'"
    :disabled="!issueExists(project.branch)"
    @click="setIssue(project.branch)"
  >
    <template v-slot:prefix>
      <d-icon
        v-if="project.defaultBranch === project.branch"
        name="cloud-data-connection"
      />
    </template>
    {{ project.branch }}
  </d-button>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { Project } from "../../types/Jira";
import { currentIssueKey } from "../store/jira.store";
import JiraController from "../controller/JiraController";

defineProps({
  project: {type: Object as PropType<Project>, required: true}
})

function setIssue(branch: string) {
  currentIssueKey.value = branch;
}

function issueExists(branch: string): boolean {
  return (
    JiraController.issues.value.findIndex(
      (issue) => issue.task.key === branch
    ) > -1
  );
}
</script>
<style scoped lang="scss">
</style>
