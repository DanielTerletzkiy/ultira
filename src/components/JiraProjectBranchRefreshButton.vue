<template>
  <d-button color="primary" outlined @click="onClick" :disabled="loading.projects">
    <template v-slot:prefix>
      <d-icon name="sync" :size="20" :class="{loading: loading.projects}" />
    </template>
    Refresh Projects
  </d-button>
</template>

<script setup lang="ts">
import { loading, projects } from "../store/jira.store";
import ProjectController from "../controller/ProjectController";
import { onMounted, ref } from "vue";

function onClick() {
  ProjectController.scrapeBranches(
    projects.value.map((project) => project.path)
  );
}
</script>

<style scoped lang="scss">
.loading {
  animation: spin 3s infinite linear reverse;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
