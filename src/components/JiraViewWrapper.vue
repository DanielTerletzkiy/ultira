<template>
  <d-card class="jira-view-wrapper" elevation="1" block height="100%">
    <d-card-title class="title font-size-medium" height="50px">
      <slot name="title"/>
    </d-card-title>
    <d-divider v-if="!hideDivider" elevation="6"/>
    <d-card class="content" background-color="transparent" block>
      <slot name="default"/>
    </d-card>
  </d-card>
</template>

<script setup lang="ts">
defineProps({
  hideDivider: Boolean
})
</script>

<style scoped lang="scss">
.jira-view-wrapper {
  .title {
    user-select: none;
  }

  .content {
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column
  }
}
</style>
