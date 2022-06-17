<template>
  <d-column v-if="projects.length>0" gap elevation="4" class="ma-3">
    <d-row v-for="project in projects" glow width="auto" class="px-3">
      <d-column>
        <d-card-title class="font-size-small">
          {{ project.project }}
        </d-card-title>
        <d-card-subtitle>
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

</style>
