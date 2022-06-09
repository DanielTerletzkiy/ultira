<template>
  <d-row gap v-if="item.transitionData" width="max-content" :key="item.task.key" :wrap="false">
    <d-tooltip v-for="transition in item.transitionData.transitions">
      <d-button glow color="secondary">
        {{ transition.name }}
      </d-button>
      <template v-slot:tooltip>
        Status
        <d-icon name="arrow-right" :size="20"/>
        <strong>{{ transition.to.name }}</strong>
      </template>
    </d-tooltip>
  </d-row>
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
