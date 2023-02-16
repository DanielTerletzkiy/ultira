<template>
  <d-row block align="stretch" elevation="2">
    <d-column gap block>
      <d-textfield
        full-width
        v-model="project.project"
        color="primary"
        filled
        label="Project Name"
        placeholder="Repository name"
        type="name"
      />
      <d-textfield
        full-width
        v-model="project.path"
        color="primary"
        filled
        label="Path"
        placeholder="Valid Path to Project Folder"
        type="path"
      />
      <d-textfield
        full-width
        select
        v-model="selectedIDE"
        color="primary"
        filled
        label="IDE"
        :items="ides"
      >
        <template v-slot:label="{item}">
          {{ item && item.name }}
        </template>
        <template v-slot:item="{item}">
          {{ item && item.name }}
        </template>
      </d-textfield>
      <d-card-subtitle>
        Current Branch: <strong>{{ project.branch }}</strong>
      </d-card-subtitle>
    </d-column>
    <d-column elevation="n1">
      <d-tooltip position="left">
        <JiraButtonConfirm color="error" icon="times" @confirm="remove" />
        <template v-slot:tooltip>Delete</template>
      </d-tooltip>
      <d-spacer />
      <d-tooltip position="left">
        <JiraButtonConfirm color="success" icon="save" @confirm="save" />
        <template v-slot:tooltip>Save</template>
      </d-tooltip>
    </d-column>
  </d-row>
</template>

<script setup lang="ts">
import { computed, PropType, ref, toRefs } from "vue";
import { Project } from "../../types/Jira";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { ides } from "../store/jira.store";
import { clone } from "lodash";

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: Object as PropType<Project>
});

const project = ref(clone(toRefs(props).modelValue?.value));

function remove() {
  emit("remove");
}

function save() {
  emit("update:modelValue", project.value);
  project.value = clone(project.value);
}

const selectedIDE = computed({
  get() {
    return ides.value.findIndex(ide => ide.id === project.value?.ideId);
  },
  set(index) {
    if (project.value && ides.value[index]) {
      project.value.ideId = ides.value[index].id;
    }
  }
});
</script>

<style scoped lang="scss"></style>
