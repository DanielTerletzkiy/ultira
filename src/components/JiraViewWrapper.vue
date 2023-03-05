<template>
  <d-card
    class="jira-view-wrapper"
    block
    :max-width="hidden ? '50px' : ''"
  >
    <d-column no-padding class="header pa-0" :height="hidden ? '100%' : ''">
      <d-row color="primary" :height="hidden ? '100%' : ''">
        <span v-on-long-press.prevent="onLongClick" class="button">
          <slot name="button">
            <d-icon-button
              v-if="!!$slots.icon"
              :height="hidden ? '100%' : ''"
              color="primary"
              @click="toggleHide"
              :disabled="!canHide"
            >
              <slot name="icon" :hidden="hidden" />
            </d-icon-button>
          </slot>
        </span>
        <d-column v-if="!hidden" no-padding class="pa-0" block>
          <d-card-title class="title font-size-medium pr-0" :height="headerHeight">
            <slot name="title" :hidden="hidden" />
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
      <slot name="default" :hidden="hidden" />
    </d-card>
  </d-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { vOnLongPress } from "@vueuse/components";

const emit = defineEmits(["long"]);

defineProps({
  hideDivider: { type: Boolean },
  canHide: { type: Boolean },
  headerHeight: { type: String, default: "50px" }
});

const hidden = ref(false);

function toggleHide() {
  hidden.value = !hidden.value;
}

function onLongClick() {
  emit("long");
}
</script>

<style scoped lang="scss">
$height: v-bind(headerHeight);
.jira-view-wrapper {
  overflow: hidden;

  .header {
    user-select: none;

    .button {
      height: 100%;
    }

    .divider {
      margin-top: -1px;
    }
  }

  .content {
    max-height: calc(100% - $height);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
