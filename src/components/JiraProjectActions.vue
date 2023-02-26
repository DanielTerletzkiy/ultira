<template>
  <d-column>
    <d-tooltip position="left">
      <JiraButtonConfirm :disabled="disabled" color="primary" icon="import" :size="30" @confirm="onUpdate" />
      <template v-slot:tooltip>Update from <b>{{ project.defaultBranch }}</b></template>
    </d-tooltip>
    <d-tooltip position="left">
      <JiraButtonConfirm :disabled="disabled" color="primary" icon="folder-open" :size="30" @confirm="onOpen" />
      <template v-slot:tooltip>Open</template>
    </d-tooltip>
    <d-tooltip position="left" :disabled="!hasDefaultBranch">
      <JiraButtonConfirm :disabled="disabled" color="primary" icon="cloud-database-tree" :size="30" @confirm="onChangeDefault" />
      <template v-slot:tooltip>Change to <b>{{ project.defaultBranch }}</b></template>
    </d-tooltip>
  </d-column>
</template>

<script setup lang="ts">
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { computed, PropType } from "vue";
import { Project } from "../../types/Jira";
import ProjectController from "../controller/ProjectController";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true },
  disabled: { type: Boolean }
});

function onUpdate() {
  ProjectController.update(props.project);
}

function onOpen() {
  ProjectController.open(props.project);
}

function onChangeDefault() {
  if (hasDefaultBranch.value) {
    ProjectController.changeDefault(props.project);
  }
}

const hasDefaultBranch = computed(() => !!props.project.defaultBranch);

</script>

<style scoped lang="scss"></style>
