<template>
  <component :is="parentComponent" width="max-content">
    <d-tooltip :position="tooltipPosition">
      <JiraButtonConfirm :disabled="disabled" color="primary" icon="import" :size="buttonSize" @confirm="onUpdate" />
      <template v-slot:tooltip>Update from <b>{{ project.defaultBranch }}</b></template>
    </d-tooltip>
    <d-tooltip :position="tooltipPosition" :disabled="!hasIDE">
      <JiraButtonConfirm :disabled="disabled" color="primary" icon="folder-open" :size="buttonSize" @confirm="onOpen" />
      <template v-slot:tooltip>Open in <b>{{ hasIDE ? project.ide.name : "" }}</b></template>
    </d-tooltip>
    <d-tooltip :position="tooltipPosition" :disabled="!hasDefaultBranch">
      <JiraButtonConfirm :disabled="disabled" color="primary" icon="cloud-database-tree" :size="buttonSize"
                         @confirm="onChangeDefault" />
      <template v-slot:tooltip>Change to <b>{{ project.defaultBranch }}</b></template>
    </d-tooltip>
  </component>
</template>

<script setup lang="ts">
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { computed, PropType } from "vue";
import { Project } from "../../types/Jira";
import ProjectController from "../controller/ProjectController";
import { Position } from "vuelize/src/types/Vuelize";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true },
  horizontal: { type: Boolean },
  disabled: { type: Boolean }
});

const parentComponent = computed(() => props.horizontal ? "d-row" : "d-column");
const buttonSize = computed(() => props.horizontal ? 50 : 30);
const tooltipPosition = computed<Position>(() => props.horizontal ? Position.Bottom : Position.Left);


function onUpdate() {
  ProjectController.update(props.project);
}

function onOpen() {
  if (hasIDE.value) {
    ProjectController.open(props.project);
  }
}

function onChangeDefault() {
  if (hasDefaultBranch.value) {
    ProjectController.changeDefault(props.project);
  }
}

const hasDefaultBranch = computed(() => !!props.project.defaultBranch);
const hasIDE = computed(() => !!props.project?.ideId);

</script>

<style scoped lang="scss"></style>
