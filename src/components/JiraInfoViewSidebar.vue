<template>
  <d-column
    class="jira-info-side-bar"
    gap
    elevation="2"
    height="100%"
    style="min-width: 200px"
  >
    <d-row>
      <d-card-subtitle class="pa-0 font-weight-bold"> Sidebar </d-card-subtitle>
      <d-divider class="mx-3" block elevation="8" />
    </d-row>
    <d-column gap class="px-2">
      <JiraUserItem :user="currentIssue.task.fields.reporter">
        Reporter
      </JiraUserItem>
      <JiraUserItem :user="currentIssue.task.fields.assignee">
        Assignee
      </JiraUserItem>
    </d-column>
    <d-card-subtitle>
      <d-icon name="plus" :size="20" color="primary" />
      {{ new Date(currentIssue.task.fields.created).toLocaleString("DE-de") }}
    </d-card-subtitle>
    <d-card-subtitle>
      <d-icon name="edit-alt" :size="20" color="primary" />
      {{ new Date(currentIssue.task.fields.updated).toLocaleString("DE-de") }}
    </d-card-subtitle>
    <d-divider class="mx-3" elevation="10" />
    <d-card-subtitle class="pb-0">
      <d-icon name="clock" :size="20" color="primary" />
      {{ secondsToTime(currentIssue.task.fields.timespent) }}
    </d-card-subtitle>
    <d-row :wrap="false" gap justify="space-between" :disabled="loadingWorkLog">
      <d-icon-button
        v-for="i in [0.5, 1, 4, 8]"
        color="secondary"
        :size="40"
        :disabled="loadingWorkLog"
        @click="addWorkLog(i)"
      >
        +{{ i }}
      </d-icon-button>
    </d-row>
    <d-tooltip :key="currentIssue.task.key" color="primary" position="bottom">
      <DProgressbar
        class="mx-2"
        v-model="currentIssue.task.fields.timespent"
        :max="currentIssue.task.fields.timeoriginalestimate"
        color="primary"
        :show-label="false"
      >
        <template v-slot:progress>
          <!--TODO fix progressbar in vuelize-->
          {{ currentIssue.task.fields.timespent / 3600 }}h /
          {{ currentIssue.task.fields.timeoriginalestimate / 3600 }}h
        </template>
      </DProgressbar>
      <template v-slot:tooltip>
        {{ secondsToTime(currentIssue.task.fields.timespent) }} /
        {{ secondsToTime(currentIssue.task.fields.timeoriginalestimate) }}
      </template>
    </d-tooltip>
    <d-divider class="mx-3" elevation="10" />
    <JiraComponentLabels />
  </d-column>
</template>

<script setup lang="ts">
import JiraUserItem from "./JiraUserItem.vue";
import { ref } from "vue";
import JiraTask from "../controller/JiraTask";
//TODO WTH? not registered with vite?
import DProgressbar from "vuelize/src/components/progress/DProgressbar.vue";
import JiraComponentLabels from "./JiraComponentLabels.vue";
import { currentIssue } from "../store/jira.store";

function secondsToTime(seconds: number) {
  return new Date(seconds * 1000).toISOString().substr(5, 11);
}

const loadingWorkLog = ref(false);

async function addWorkLog(hours: number) {
  loadingWorkLog.value = true;
  await currentIssue.value?.addWorkLog(hours * 3600);
  loadingWorkLog.value = false;
}
</script>

<style scoped lang="scss"></style>
