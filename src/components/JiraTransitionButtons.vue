<template>
  <d-row
    v-if="currentIssue.transitionData"
    width="max-content"
    :key="currentIssue.task.key"
    :wrap="false"
    gap
    elevation="2"
  >
    <d-tooltip
      v-for="transition in currentIssue.transitionData.transitions"
      :key="transition.id" position="bottom"
    >
      <d-button color="secondary" @click="onClick(transition.id)">
        {{ transition.name }}
      </d-button>
      <template v-slot:tooltip>
        Status
        <d-icon name="arrow-right" :size="20" />
        <strong>{{ transition.to.name }}</strong>
      </template>
    </d-tooltip>
  </d-row>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { currentIssue } from "../store/jira.store";

// eslint-disable-next-line no-undef,no-unused-vars
const vuelize: Vuelize = inject("vuelize") as Vuelize;

function onClick(id: string) {
  currentIssue.value?.updateTransition(id);
}
</script>

<style scoped></style>
