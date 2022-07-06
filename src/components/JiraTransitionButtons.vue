<template>
  <d-row
    v-if="currentIssue.transitionData"
    width="max-content"
    :key="currentIssue.task.key"
    :wrap="false"
    gap
    elevation="2"
  >
    <d-tooltip v-for="transition in currentIssue.transitionData.transitions">
      <d-button color="secondary">
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

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;
</script>

<style scoped></style>
