<template>
  <d-list v-model="selectedIssue" @update:modelValue="onChange" color="primary" filled>
    <d-list-item class="item" :key="issue.task.id" v-for="issue in jiraController.issues">
      <JiraListItem :item="issue"/>
    </d-list-item>
  </d-list>
</template>

<script setup lang="ts">
import JiraListItem from "./JiraListItem.vue";
import JiraController from "../controller/JiraController";
import {inject} from "vue";

const jiraController = inject('JiraController') as JiraController;

const props = defineProps({
  selectedIssue: String,
})

const emit = defineEmits(['update:selectedIssue'])

function onChange(selectedIssue: string) {
  emit('update:selectedIssue', selectedIssue)
}

</script>

<style scoped lang="scss">
.item {
  padding: 0 !important;

  ::v-deep(.d-list__item__content) {
    padding: 6px 8px !important;
  }
}
</style>
