<template>
  <d-card
    class="jira-view-wrapper"
    elevation="1"
    block
    :max-width="hidden ? '50px' : ''"
  >
    <d-column class="header pa-0" :height="hidden ? '100%' : ''">
      <d-row color="primary" :height="hidden ? '100%' : ''">
        <d-icon-button
          v-if="!!$slots.icon"
          :height="hidden ? '100%' : ''"
          :active="hidden"
          color="primary"
          @click="toggleHide"
        >
          <slot name="icon" :hidden="hidden"/>
        </d-icon-button>
        <d-column v-if="!hidden" class="pa-0" block>
          <d-card-title class="title font-size-medium" height="50px">
            <slot name="title" />
          </d-card-title>
        </d-column>
      </d-row>
      <d-divider
        v-if="!hideDivider && !hidden"
        elevation-dark="6"
        class="divider"
      />
    </d-column>
    <d-card v-if="!hidden" class="content" background-color="transparent" block>
      <slot name="default" />
    </d-card>
  </d-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps({
  hideDivider: Boolean,
});

const hidden = ref(false);

function toggleHide() {
  hidden.value = !hidden.value;
}
</script>

<style scoped lang="scss">
.jira-view-wrapper {
  overflow: hidden;

  .header {
    user-select: none;

    .divider {
      margin-top: -1px;
    }
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
