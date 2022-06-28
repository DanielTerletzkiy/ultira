<template>
  <d-dialog :modelValue="open" @update:modelValue="(e)=>$emit('update:open', e)">
    <d-card class="pa-2 pt-1">
      <d-card-title>
        Search...
      </d-card-title>
      <d-card-subtitle>
        Issue Keys
      </d-card-subtitle>
      <d-divider/>
      <d-column gap class="pa-0 pt-2">
        <d-textfield v-model="searchKey" color="primary" full-width filled solo label="Key" placeholder="KEY-1..."
                     autofocus outlined>
          <template v-slot:prefix>
            <d-icon name="search-alt"/>
          </template>
        </d-textfield>
        <JiraList />
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import JiraController from "../controller/JiraController";
import JiraListItem from "./JiraListItem.vue";
import JiraList from "./JiraList.vue";

const props = defineProps({
  open: Boolean,
});
const searchKey = ref<string>();

const searchResults = computed(() => {
  searchKey.value = searchKey.value?.toUpperCase();
  console.log(searchKey.value)
  const result = JiraController.issues.value.find((issue) => {
    for (const key of Object.keys(issue.task)) {
      //@ts-ignore
      if (typeof issue.task[key] !== 'object' && issue.task[key].includes(searchKey.value)) {
        return true
      }
    }
  });
  console.log(result)
  return result;
})

</script>

<style scoped lang="scss">

</style>
