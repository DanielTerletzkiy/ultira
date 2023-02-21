<template>
  <d-tooltip
    :position="tooltipPosition"
    color="primary"
    filled
    :key="hasChangeSteps"
    popover
    v-if="hasIDE"
    :inactive="!hasIDE"
  >
    <d-card
      :outlined="hasChanges"
      background-color="transparent"
      outline-width="2px"
    >
      <JiraButtonConfirm
        icon="code-branch"
        color="primary"
        askColor="primary"
        :disabled="!project || !hasIDE"
        @confirm="onClick"
      />
    </d-card>
    <template v-slot:tooltip-wrapper>
      <d-card>
        <d-row>
          <d-column no-padding>
            <d-row gap>
              <d-icon
                class="ml-4"
                name="corner-down-right"
                :size="20"
                style="transform: rotate(45deg)"
              />
              <d-row gap style="max-width: max-content">
                <d-column>
                  <d-card-subtitle>
                    <strong v-if="project">{{
                      project.branch.toUpperCase()
                    }}</strong>
                    <span v-else>Project not installed</span>
                  </d-card-subtitle>
                  <d-divider />
                  <d-card-subtitle>
                    <strong>{{ currentIssueKey }}</strong>
                  </d-card-subtitle>
                </d-column>
                <d-divider
                  vertical
                  block
                  class="my-3"
                  size="4px"
                  v-if="hasChanges"
                />
                <d-column v-if="hasChanges">
                  <d-card-subtitle>
                    <strong>{{ project.changes.files.length }}</strong> Files
                  </d-card-subtitle>
                  <d-divider />
                  <d-card-subtitle>
                    <d-icon name="file-edit-alt" :size="18" />
                    Changes
                  </d-card-subtitle>
                </d-column>
              </d-row>
            </d-row>
            <d-row v-if="hasIDE && false"> <!--TODO: looks too clunky, an icon would be nice-->
              <d-spacer />
              <d-card-subtitle class="pt-1">
                {{ project.ide.name }}
              </d-card-subtitle>
            </d-row>
            <d-row
              v-if="hasChangeSteps"
              class="pa-2"
              elevation="3"
              justify="center"
            >
              <JiraChangeStep :project="project"/>
            </d-row>
          </d-column>
          <d-divider vertical block/>
          <JiraProjectActions :project="project" />
        </d-row>
      </d-card>
    </template>
  </d-tooltip>
</template>

<script setup lang="ts">
import {
  currentIssueKey,
  changeSteps,
  fullProjects,
} from "../store/jira.store";
import { computed, PropType } from "vue";
import ProjectController from "../controller/ProjectController";
import { Position } from "vuelize/src/types/Vuelize";
import { Project } from "../../types/Jira";
import JiraChangeStep from "./JiraChangeStep.vue";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import JiraProjectActions from "./JiraProjectActions.vue";

const props = defineProps({
  repository: { type: String, required: true },
  tooltipPosition: { type: String as PropType<Position>, default: "left" },
});

const project = computed<Project>(
  () =>
    fullProjects.value.find((project) => {
      try {
        return project.project.toLowerCase() === props.repository.toLowerCase();
      } catch (e) {
        return "error";
      }
    }) as Project
);

const hasChanges = computed<boolean>(
  () => project.value && project.value?.changes.files.length > 0
);

const hasChangeSteps = computed<boolean>(
  () =>
    project.value &&
    changeSteps.value.findIndex((step) => step.path === project.value.path) >= 0
);

const hasIDE = computed(()=>!!project.value.ideId)

function onClick() {
  ProjectController.clearChangeSteps();
  ProjectController.changeBranch(project.value, currentIssueKey.value);
}
</script>

<style scoped lang="scss"></style>
