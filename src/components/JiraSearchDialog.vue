<template>
  <d-dialog :modelValue="open" @update:modelValue="(e)=>$emit('update:open', e)">
    <d-card class="pa-2 pt-1 pb-0" width="700px" height="600px">
      <d-column style="height: 90px">
        <d-card-title>
          Search...
        </d-card-title>
        <d-card-subtitle>
          Issue Keys
        </d-card-subtitle>
        <d-divider/>
      </d-column>
      <d-textfield v-model="searchKey" color="primary" full-width filled solo label="Key" placeholder="KEY-1..."
                   autofocus outlined>
        <template v-slot:prefix>
          <d-icon name="search-alt"/>
        </template>
      </d-textfield>
      <d-column gap class="pa-0 py-2" style="max-height: calc(100% - 90px - 50px);overflow:hidden auto;">
        <JiraList v-model="currentIssueKey" hide-sorter :issue-list="searchResults"/>
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import JiraController from "../controller/JiraController";
import JiraList from "./JiraList.vue";
import {currentIssueKey} from "../store/jira.store";
import JiraTask from "../controller/JiraTask";

const props = defineProps({
  open: Boolean,
});
const searchKey = ref<string>();

const searchResults = ref<Array<JiraTask>>([]);

const search = () => {
  searchKey.value = searchKey.value?.toUpperCase();
  console.log(searchKey.value)
  const result = JiraController.issues.value.filter((issue) => {
    for (const key of Object.keys(issue.task)) {
      //@ts-ignore
      if (typeof issue.task[key] !== 'object' && issue.task[key].includes(searchKey.value)) {
        return true
      }
    }
  });
  console.log(result)
  searchResults.value = result;
}

watch(searchKey, search)

</script>

<style scoped lang="scss">

</style>
