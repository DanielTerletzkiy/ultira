<template>
  <d-column
    class="jira-info-side-bar"
    gap
    elevation="2"
    height="100%"
    style="min-width: 250px"
  >
    <d-row>
      <d-card-subtitle class="pa-0 font-weight-bold"> Sidebar</d-card-subtitle>
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
      {{ new Date(currentIssue.task.fields.created).toLocaleString(undefined) }}
    </d-card-subtitle>
    <d-card-subtitle>
      <d-icon name="edit-alt" :size="20" color="primary" />
      {{ new Date(currentIssue.task.fields.updated).toLocaleString(undefined) }}
    </d-card-subtitle>
    <d-divider class="mx-3" elevation="10" />
    <d-card-subtitle class="pb-0">
      <d-icon name="clock" :size="20" color="primary" />
      {{ currentIssue?.task.renderedFields.timespent }}
    </d-card-subtitle>
    <d-row :wrap="false" gap justify="space-between" :disabled="loadingWorkLog">
      <d-icon-button
        v-for="i in [0.5, 1, 2, 4, 8]"
        color="secondary"
        :size="40"
        :disabled="loadingWorkLog"
        @click="addWorkLog(i)"
      >
        +{{ i }}
      </d-icon-button>
    </d-row>
    <d-tooltip :key="currentIssue.task.key" color="primary" position="bottom">
      <d-progressbar
        class="mx-2"
        v-model="currentIssue.task.fields.timespent"
        :max="currentIssue.task.fields.timeoriginalestimate"
        color="primary"
        show-label
      >
        <template v-slot:progress="{progress}">
          <d-row>
            {{ Math.round(progress) }}%
            /
            {{ currentIssue?.task.renderedFields.timeoriginalestimate }}
          </d-row>
        </template>
      </d-progressbar>
      <template v-slot:tooltip>
        {{ currentIssue?.task.renderedFields.timespent }} /
        {{ currentIssue?.task.renderedFields.timeoriginalestimate }}
      </template>
    </d-tooltip>
    <d-divider class="mx-3" elevation="10" />
    <JiraComponentLabels />
    <d-button @click="onDialogOpen">
      custom vars
    </d-button>
    <d-dialog v-model="customDialogOpen">
      <d-row
        :wrap="false"
        class="dialog-component"
        align="stretch"
      >
        <JiraInfoViewCustom />
      </d-row>
    </d-dialog>
  </d-column>
</template>

<script setup lang="ts">
import JiraUserItem from "./JiraUserItem.vue";
import { ref } from "vue";
import JiraComponentLabels from "./JiraComponentLabels.vue";
import { currentIssue } from "../store/jira.store";
import JiraInfoViewCustom from "./JiraInfoViewCustom.vue";

const customDialogOpen = ref(false);

function onDialogOpen() {
  customDialogOpen.value = true;
}

const loadingWorkLog = ref(false);

async function addWorkLog(hours: number) {
  loadingWorkLog.value = true;
  await currentIssue.value?.addWorkLog(hours * 3600);
  loadingWorkLog.value = false;
}
</script>

<style scoped lang="scss">
.dialog-component {
  min-height: 50vh;
  min-width: 50vw;
  max-height: 50vh;
  max-width: 50vw;
}
</style>
