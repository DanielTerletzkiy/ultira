<template>
  <d-row gap block align="stretch" elevation="2">
    <d-column gap block>
      <d-textfield
        full-width
        v-model="modelValue.project"
        color="primary"
        filled
        label="Project Name"
        type="name"
      />
      <d-card-subtitle class="py-0"> Use repository name </d-card-subtitle>
      <d-textfield
        full-width
        v-model="modelValue.path"
        color="primary"
        filled
        label="Path"
        type="path"
      />
      <d-card-subtitle class="py-0">
        Valid Path to Project Folder
      </d-card-subtitle>
    </d-column>
    <d-icon-button height="initial" type="button" color="error" @click="remove">
      <d-icon name="times" />
    </d-icon-button>
  </d-row>
</template>

<script setup lang="ts">
import { PropType, watch } from "vue";
import { Project } from "../../types/Jira";

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: Object as PropType<Project>,
});

function remove() {
  emit("remove");
}

watch(
  () => props.modelValue,
  (data) => emit("update:modelValue", data)
);
</script>

<style scoped lang="scss"></style>
