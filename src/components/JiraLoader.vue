<template>
  <ve-progress
      :color="$vuelize.getColor('primary', 0)"
      :empty-color="$vuelize.getColor('primary', 20)+'10'"
      :thickness="thickness"
      empty-thickness="2px"
      :size="size"
      loading
  />
</template>

<script setup lang="ts">
//@ts-ignore
import {VeProgress} from "vue-ellipse-progress";

defineProps({
  size: {type: Number, default: 400},
  thickness: {type: Number, default: 10}
})
</script>

<style scoped>

</style>
