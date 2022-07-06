<template>
  <d-column
    v-if="currentIssue.task.fields.components"
    :key="currentIssue.task.key"
    gap
  >
    <d-label
      v-for="component in currentIssue.task.fields.components"
      color="primary"
      width="auto"
    >
      {{ component.name }}
    </d-label>
  </d-column>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { currentIssue } from "../store/jira.store";

const vuelize: Vuelize = inject("vuelize") as Vuelize;
</script>

<style scoped></style>
