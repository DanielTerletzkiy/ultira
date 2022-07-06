<template>
  <d-tooltip :position="tooltipPosition" color="primary" filled>
    <d-icon-button
      name="folder-open"
      color="primary"
      :disabled="!project"
      @click="onClick"
    />
    <template v-slot:tooltip>
      <d-icon name="share" :size="20" />
      <span v-if="project">{{ project.project.toUpperCase() }}</span>
      <span v-else>Project not installed</span>
    </template>
  </d-tooltip>
</template>

<script setup lang="ts">
import { projects, currentIssueKey } from "../store/jira.store";
import { computed } from "vue";
import ProjectController from "../controller/ProjectController";
import { Project } from "../../types/Jira";

const props = defineProps({
  repository: { type: String, required: true },
  tooltipPosition: { type: String, default: "bottom" },
});

const project = computed<Project>(
  () =>
    projects.value.find(
      (project) =>
        project.project.toLowerCase() === props.repository.toLowerCase()
    ) as Project
);

function onClick() {
  ProjectController.open(project.value, currentIssueKey.value);
}
</script>

<style scoped lang="scss"></style>
