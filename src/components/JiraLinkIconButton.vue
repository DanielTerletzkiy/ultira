<template>
  <d-icon-button
      root-tag="a"
      target="_blank"
      :href="url"
      color="primary"
      style="margin: -6px 0"
      :size="25"
  >
    <d-icon name="external-link-alt" :size="18"/>
  </d-icon-button>
</template>
<script setup lang="ts">
  defineProps({
    url: String
  })
</script>
<style scoped lang="scss">

::v-deep(.d-accordion) {

}
</style>
