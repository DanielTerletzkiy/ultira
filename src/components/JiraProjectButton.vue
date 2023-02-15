<template>
  <d-tooltip :position="tooltipPosition" color="primary" filled :key="hasChangeSteps" :popover="hasChangeSteps">
    <d-icon-button
      name="folder-open"
      color="primary"
      :outlined="hasChanges"
      :disabled="!project"
      @click="onClick"
    />
    <template v-slot:tooltip>
      <d-column gap>
        <d-row gap>
          <d-icon
            name="corner-down-right"
            :size="20"
            style="transform: rotate(45deg)"
          />
          <d-row gap style="max-width: max-content">
            <d-column>
          <span>
            <strong v-if="project">{{ project.branch.toUpperCase() }}</strong>
            <span v-else>Project not installed</span>
          </span>
              <d-divider color="primary" :tint="-40" />
              <strong>{{ currentIssueKey }}</strong>
            </d-column>
            <d-column v-if="hasChanges">
          <span>
            <strong>{{ project.changes.length }}</strong> Files
          </span>
              <d-divider color="primary" :tint="-40" />
              <d-card-subtitle color="inherit" class="pa-0 font-weight-bold">
                <d-icon name="file-edit-alt" :size="18" />
                Changes
              </d-card-subtitle>
            </d-column>
          </d-row>
        </d-row>
        <d-card v-if="hasChangeSteps" class="pa-2">
          <JiraChangeStep />
        </d-card>
      </d-column>
    </template>
  </d-tooltip>
</template>

<script setup lang="ts">
import { projects, currentIssueKey, changeSteps } from "../store/jira.store";
import { computed, PropType } from "vue";
import ProjectController from "../controller/ProjectController";
import { Position } from "vuelize/src/types/Vuelize";
import { Project } from "../../types/Jira";
import JiraChangeStep from "./JiraChangeStep.vue";

const props = defineProps({
  repository: { type: String, required: true },
  tooltipPosition: { type: String as PropType<Position>, default: "left" }
});

const project = computed<Project>(
  () =>
    projects.value.find(
      (project) => {
        try {
          return project.project.toLowerCase() === props.repository.toLowerCase();
        } catch (e) {
          return "error";
        }
      }
    ) as Project);

const hasChanges = computed<boolean>(() => project.value && project.value?.changes?.length > 0);

const hasChangeSteps = computed<boolean>(() => project.value && changeSteps.value.findIndex((step) => step.path === project.value.path) >= 0);

function onClick() {
  ProjectController.clearChangeSteps();
  ProjectController.open(project.value, currentIssueKey.value);
}
</script>

<style scoped lang="scss"></style>
