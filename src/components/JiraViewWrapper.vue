<template>
  <d-card class="jira-view-wrapper" elevation="1" block height="100%">
    <d-tooltip position="bottom" filled color="primary">
      <d-column class="header pa-0">
        <d-row class="px-2" color="primary" glow>
          <slot v-if="!!$slots.icon" name="icon" />
          <d-column class="pa-0">
            <d-card-title class="title font-size-medium" height="50px">
              <slot name="title" />
            </d-card-title>
            <d-card-subtitle v-if="!!$slots.subtitle" class="subtitle">
              <slot name="subtitle" />
            </d-card-subtitle>
          </d-column>
        </d-row>
        <d-divider v-if="!hideDivider" elevation-dark="6" />
      </d-column>
      <template v-slot:tooltip>
        <slot name="tooltip" />
      </template>
    </d-tooltip>
    <d-card class="content" background-color="transparent" block>
      <slot name="default" />
    </d-card>
  </d-card>
</template>

<script setup lang="ts">
defineProps({
  hideDivider: Boolean,
});
</script>

<style scoped lang="scss">
.jira-view-wrapper {
  overflow: hidden;

  .header {
    user-select: none;
  }

  .content {
    max-height: calc(100% - 50px);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
