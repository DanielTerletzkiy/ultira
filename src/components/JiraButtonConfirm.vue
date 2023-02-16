<template>
  <OnClickOutside @trigger="onReset">
    <d-icon-button
      v-if="icon"
      :color="currentColor"
      :active="state"
      @click="onClick"
      :disabled="disabled"
      :name="icon"
      :outlined="state"
      :outline-color="color"
      outline-offset="2px"
      outline-width="4px"
    />
    <d-button
      v-else
      :color="currentColor"
      :filled="state"
      @click="onClick"
      :disabled="disabled"
    >
      <template v-slot:prefix>
        <slot name="prefix" />
      </template>
      <slot />
      <template v-slot:suffix>
        <slot name="suffix" />
      </template>
    </d-button>
  </OnClickOutside>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { OnClickOutside } from "@vueuse/components";

const emit = defineEmits(["click", "confirm", "cancel"]);
const props = defineProps({
  color: { type: String, default: "primary" },
  askColor: { type: String, default: "primary" },
  icon: { type: String },
  disabled: { type: Boolean },
});

const state = ref(false);

const currentColor = computed(() =>
  state.value ? props.askColor : props.color
);

function onClick() {
  emit("click");
  if (!state.value) {
    state.value = true;
    return;
  }
  emit("confirm");
  onReset();
}

function onReset() {
  emit("cancel");
  state.value = false;
}
</script>

<style scoped></style>
