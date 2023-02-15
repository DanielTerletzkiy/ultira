<template>
  <d-row gap>
    <d-tooltip v-for="step in steps" :key="step.description">
      <d-column glow :color="step.color">
        <d-icon :name="step.icon" :size="40" />
      </d-column>
      <template v-slot:tooltip>
        {{ step.description }}
      </template>
    </d-tooltip>
    <d-icon-button name="times" @click="onClear" :size="30" color="inherit"/>
  </d-row>
</template>

<script setup lang="ts">
import { changeSteps } from "../store/jira.store";
import { changeStepsInfo } from "../constants/ChangeSteps";
import { computed } from "vue";
import { cloneDeep, groupBy } from "lodash";
import ProjectController from "../controller/ProjectController";
import { ChangeState } from "../../types/ChangeState";

const steps = computed(() => {

  const stepGroup = groupBy(changeSteps.value, (n) => n.step);
  console.log(stepGroup, typeof stepGroup);
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
    console.log("cr:", currentGroup);
    const currentStep = currentGroup.at(-1);
    if (!currentStep) {
      continue;
    }
    stepInfo.color =
      currentStep.state === ChangeState.Started ? "warning" :
        currentStep.state === ChangeState.Finished ? "success" :
          currentStep.state === ChangeState.Failed ? "error" : "";
  }
  return clone;
});

function onClear() {
  ProjectController.clearChangeSteps();
}
</script>

<style scoped>

</style>
