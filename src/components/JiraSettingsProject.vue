<template>
  <d-row block align="stretch" elevation="2">
    <d-column gap block>
      <d-textfield
        full-width
        v-model="modelValue.project"
        color="primary"
        filled
        label="Project Name"
        placeholder="Repository name"
        type="name"
      />
      <d-textfield
        full-width
        v-model="modelValue.path"
        color="primary"
        filled
        label="Path"
        placeholder="Valid Path to Project Folder"
        type="path"
      />
      <d-card-subtitle>
        Current Branch: <strong>{{ modelValue.branch }}</strong>
      </d-card-subtitle>
    </d-column>
    <d-column elevation="n1">
      <JiraButtonConfirm color="error" icon="times" @confirm="remove"/>
    </d-column>
  </d-row>
</template>

<script setup lang="ts">
import { PropType, watch } from "vue";
import { Project } from "../../types/Jira";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: Object as PropType<Project>
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
