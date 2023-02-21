<template>
  <d-column>
    <d-tooltip position="left">
      <JiraButtonConfirm color="primary" icon="import" :size="30"/>
      <template v-slot:tooltip>Update from <b>{{project.defaultBranch}}</b></template>
    </d-tooltip>
    <d-tooltip position="left">
      <JiraButtonConfirm color="primary" icon="folder-open" :size="30"/>
      <template v-slot:tooltip>Open</template>
    </d-tooltip>
  </d-column>
</template>

<script setup lang="ts">
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { PropType } from "vue";
import { Project } from "../../types/Jira";

defineProps({
  project: { type: Object as PropType<Project>, required: true },
});
</script>

<style scoped lang="scss"></style>
