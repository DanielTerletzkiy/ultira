<template>
  <slot :base64="base64" :height="height" :width="width"></slot>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref, ref } from "vue";
import JiraController from "../controller/JiraController";
const props = defineProps({
  url: { type: String, required: true }
});

const base64 = ref<string | null>(null);
const width = ref<number | null>(null);
const height = ref<number | null>(null);

onMounted(async () => {
  if (props.url) {
    JiraController.getImageBase64(props.url).then((result) => {
      base64.value = `"${result}"`;
      let image = new Image();

      image.onload = function(){
        width.value = image.width;
        height.value = image.height;
      };

      image.src = result;
    });
  }
});
</script>

<style scoped></style>
