<template>
  <d-dialog
    :modelValue="open"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <d-card class="pa-2 pt-1 pb-0" width="700px" height="600px">
      <d-column style="height: 90px">
        <d-card-title> Search...</d-card-title>
        <d-card-subtitle> Issue Keys</d-card-subtitle>
        <d-divider />
      </d-column>
      <d-textfield
        v-model="searchKey"
        class="font-size-medium"
        color="primary"
        full-width
        filled
        solo
        label="Key"
        placeholder="KEY-1..."
        autofocus
        outlined
      >
        <template v-slot:prefix>
          <d-icon name="search-alt" />
        </template>
        <template v-slot:suffix>
          <d-icon-button name="times" :size="30" @click="clearSearchKey" />
        </template>
      </d-textfield>
      <d-column
        outlined
        gap
        class="pa-0 my-2"
        style="max-height: calc(100% - 90px - 64px); overflow: hidden auto"
      >
        <JiraList
          v-if="searchResults.length > 0"
          v-model="currentIssueKey"
          hide-sorter
          :issue-list="searchResults"
        />
        <d-column v-else style="user-select: none">
          <d-card-title color="primary" class="mx-3">
            <d-icon name="file-question-alt" :size="30" />
            Empty
          </d-card-title>
        </d-column>
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import JiraController from "../controller/JiraController";
import JiraList from "./JiraList.vue";
import { currentIssueKey } from "../store/jira.store";
import JiraTask from "../model/JiraTask";

const props = defineProps({
  open: Boolean,
});
const searchKey = ref<string>();

const searchResults = ref<Array<JiraTask>>([]);

function search() {
  if (!props.open || !searchKey.value) {
    searchResults.value = [];
    return;
  }
  searchKey.value = searchKey.value?.toUpperCase();
  console.log(searchKey.value);
  const result = JiraController.issues.value.filter((issue: JiraTask) => {
    for (const key of Object.keys(issue.task)) {
      //@ts-ignore
      if (
        //@ts-ignore
        typeof issue.task[key] !== "object" &&
        //@ts-ignore
        issue.task[key].toLowerCase().includes(searchKey.value.toLowerCase())
      ) {
        return true;
        //@ts-ignore
      } else if (typeof issue.task[key] === "object") {
        //@ts-ignore
        for (const subKey of Object.keys(issue.task[key])) {
          if (
            //@ts-ignore
            typeof issue.task[key][subKey] !== "object" &&
            //@ts-ignore
            issue.task[key][subKey]
              .toString()
              .toLowerCase()
              //@ts-ignore
              .includes(searchKey.value.toLowerCase())
          ) {
            return true;
          }
        }
      }
    }
  });
  console.log(result);
  searchResults.value = result;
}

function clearSearchKey() {
  searchKey.value = "";
}

watch([searchKey, () => props.open], search);

onMounted(search);
</script>

<style scoped lang="scss"></style>
