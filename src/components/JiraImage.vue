<template>
  <slot :base64="base64">

  </slot>
</template>

<script setup lang="ts">
import {inject, onMounted, Ref, ref} from "vue";
import JiraController from "../controller/JiraController";

const jiraController = inject('JiraController') as Ref<JiraController>;

const props = defineProps({
  url: {type: String, required: true},
})

const base64 = ref<string | null>(null);

onMounted(async () => {
  if (props.url) {
    base64.value = await jiraController.value.getImageBase64(props.url);
  }
})
</script>

<style scoped>

</style>
