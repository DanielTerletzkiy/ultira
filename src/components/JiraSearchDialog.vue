<template>
  <d-dialog
    :modelValue="open"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <JiraViewWrapper>
      <template v-slot:icon>
        <d-icon name="search-alt" color="primary" :size="30" />
      </template>
      <template v-slot:title>
        Search
        <d-spacer />
        <d-textfield
          v-model="searchKey"
          class="font-size-medium"
          color="primary"
          filled
          solo
          label="Key"
          placeholder="KEY-1..."
          ref="searchField"
          elevation="n1"
        >
          <template v-slot:prefix>
            <d-icon name="search-alt" />
          </template>
          <template v-slot:suffix>
            <d-icon-button name="times" :size="30" @click="clearSearchKey" />
          </template>
        </d-textfield>
      </template>
      <d-column
        style="max-height: 100%; overflow: overlay"
        height="60vh" width="40vw"
        :wrap="false"
        no-padding
      >
        <d-card elevation="n2" block class="pa-2">
          <d-column
            outlined
            gap
            class="pa-0 my-2"
          >
            <JiraList
              v-if="searchResults.length > 0"
              v-model="currentIssueKey"
              hide-sorter
              :issue-list="searchResults"
            />
            <d-column v-else style="user-select: none" elevation="1">
              <d-card-title color="primary" class="mx-3">
                <d-icon name="file-question-alt" :size="30" />
                Empty
              </d-card-title>
            </d-column>
          </d-column>
        </d-card>
      </d-column>
    </JiraViewWrapper>
  </d-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import JiraController from "../controller/JiraController";
import JiraList from "./JiraList.vue";
import { currentIssueKey } from "../store/jira.store";
import JiraTask from "../model/JiraTask";
import { watchDebounced } from "@vueuse/core";
import { useFocus } from "@vueuse/core";
import JiraViewWrapper from "./JiraViewWrapper.vue";

const props = defineProps({
  open: Boolean
});

const searchField = ref();

const searchKey = ref<string>();

const searchResults = ref<Array<JiraTask>>([]);

function search() {
  if (!props.open || !searchKey.value) {
    searchResults.value = [];
    return;
  }
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

function init() {
  search();
  try {
    nextTick().then(() => {
      useFocus(searchField.value.input, { initialValue: true });
    });
  } catch (e) {
    console.log(e);
  }
}

watch(() => props.open, init);

watchDebounced([searchKey], search, {
  debounce: 200,
  maxWait: 1000
});

onMounted(init);
</script>

<style scoped lang="scss"></style>
