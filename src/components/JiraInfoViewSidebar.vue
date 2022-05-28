<template>
  <d-column class="jira-info-side-bar" gap elevation="2" height="100%" style="min-width: 200px">
    <d-row>
      <d-card-subtitle class="pa-0 font-weight-bold">
        Sidebar
      </d-card-subtitle>
      <d-divider class="mx-3" block elevation="8"/>
    </d-row>
    <JiraUserItem :user="item.task.fields.reporter" type="Reporter"/>
    <JiraUserItem :user="item.task.fields.assignee" type="Assignee"/>
    <d-card-subtitle>
      <d-icon name="plus" :size="20"/>
      {{ new Date(item.task.fields.created).toLocaleString('DE-de') }}
    </d-card-subtitle>
    <d-card-subtitle>
      <d-icon name="edit-alt" :size="20"/>
      {{ new Date(item.task.fields.updated).toLocaleString('DE-de') }}
    </d-card-subtitle>
    <d-divider class="mx-3" elevation="6"/>
    <d-card-subtitle class="pb-0">
      <d-icon name="clock" :size="20"/>
      {{ secondsToTime(item.task.fields.timespent) }}
    </d-card-subtitle>
    <d-row :wrap="false" gap justify="space-between" :disabled="loadingWorkLog">
      <d-icon-button v-for="i in [0.5, 1, 4, 8]" color="secondary" :size="40" :disabled="loadingWorkLog"
                     @click="addWorkLog(i)">
        +{{ i }}
      </d-icon-button>
    </d-row>
    <d-divider class="mx-3" elevation="6"/>
  </d-column>
</template>

<script setup lang="ts">
import JiraUserItem from "./JiraUserItem.vue";
import {PropType, ref} from "vue";
import JiraTask from "../controller/JiraTask";

const props = defineProps({
  item: Object as PropType<JiraTask>
})

function secondsToTime(seconds: number) {
  return new Date(seconds * 1000).toISOString().substr(8, 8);
}

const loadingWorkLog = ref(false);

async function addWorkLog(hours: number) {
  loadingWorkLog.value = true;
  await props.item?.addWorkLog(hours * 3600);
  loadingWorkLog.value = false;
}
</script>

<style scoped lang="scss">
</style>
