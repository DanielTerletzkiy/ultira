<template>
  <d-column no-padding v-ripple @click="onClear">
    <d-row gap>
      <d-tooltip v-for="step in steps" :key="step.description">
        <d-column glow :color="step.color">
          <d-icon :name="step.icon" :size="40" />
        </d-column>
        <template v-slot:tooltip>
          {{ step.description }}
        </template>
      </d-tooltip>
    </d-row>
  </d-column>
</template>

<script setup lang="ts">
import { changeSteps } from "../store/jira.store";
import { changeStepsInfo } from "../constants/ChangeSteps";
import { computed, PropType } from "vue";
import { cloneDeep, groupBy } from "lodash";
import ProjectController from "../controller/ProjectController";
import { ChangeState } from "../../types/ChangeState";
import { Project } from "../../types/Jira";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true }
});

const steps = computed(() => {
  const stepGroup = getGroup();
  if (!Object.keys(stepGroup)) {
    return changeStepsInfo;
  }
  const clone = cloneDeep(changeStepsInfo);

  for (const [i, stepInfo] of clone.entries()) {
    if (Object.keys(stepGroup).length < i) {
      continue;
    }
    const currentGroup = stepGroup[i];
    if (!currentGroup) {
      continue;
    }
    const currentStep = currentGroup.at(-1);
    if (!currentStep) {
      continue;
    }
    stepInfo.color =
      currentStep.state === ChangeState.Started
        ? "warning"
        : currentStep.state === ChangeState.Finished
          ? "success"
          : currentStep.state === ChangeState.Failed
            ? "error"
            : "inherit";
  }
  return clone;
});

function getGroup() {
  return groupBy(changeSteps.value.filter((step) => step.path === props.project.path), (n) => n.step);
}

function onClear() {
  ProjectController.clearChangeSteps();
}
</script>

<style scoped></style>
