<template>
  <d-column v-if="item.task.fields.components" :key="item.task.key" gap>
    <d-label v-for="component in item.task.fields.components" color="primary" width="auto">
      {{ component.name }}
    </d-label>
  </d-column>
</template>

<script setup lang="ts">

import {inject, PropType} from "vue";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})
</script>

<style scoped>

</style>
