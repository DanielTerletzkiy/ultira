<template>
  <d-button color="primary" outlined @click="onClick">
    <template v-slot:prefix>
      <d-icon name="sync" :size="20" />
    </template>
    Refresh local
  </d-button>
</template>

<script setup lang="ts">
import { projects } from "../store/jira.store";
import ProjectController from "../controller/ProjectController";

function onClick() {
  ProjectController.scrapeBranches(
    projects.value.map((project) => project.path)
  );
}
</script>

<style scoped lang="scss"></style>
