<template>
  <d-column v-if="projects.length>0" gap elevation="4" class="ma-3">
    <d-row v-for="project in projects" glow width="auto" class="px-3">
      <d-column class="project">
        <d-card-title class="title">
          {{ project.project }}
        </d-card-title>
        <d-card-subtitle class="path">
          {{ project.path }}
        </d-card-subtitle>
      </d-column>
      <d-spacer/>
      <JiraProjectButton :repository="project.project"/>
    </d-row>
  </d-column>
</template>

<script setup lang="ts">
import {projects} from "../store/jira.store";
import JiraProjectButton from "./JiraProjectButton.vue";
</script>

<style scoped lang="scss">
.project {
  .title{
    font-size: 1.2rem;
    font-weight: 600;
  }
}
</style>
