<template>
  <d-dialog :modelValue="open" @update:modelValue="(e)=>$emit('update:open', e)">
    <d-card class="pa-2 pt-1">
      <d-card-title>
        Search
      </d-card-title>
      <d-card-subtitle>
        Issue Keys
      </d-card-subtitle>
      <d-divider/>
      <d-column gap>
        <d-textfield v-model="searchKey" color="primary" full-width filled solo label="Key" placeholder="KEY-1...">
          <template v-slot:prefix>
            <d-icon name="search-alt"/>
          </template>
        </d-textfield>
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import JiraController from "../controller/JiraController";

const props = defineProps({
  open: Boolean,
});
const searchKey = ref<string>();

</script>

<style scoped lang="scss">

</style>
