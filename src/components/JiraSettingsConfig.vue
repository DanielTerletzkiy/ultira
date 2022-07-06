<template>
  <d-row gap block align="stretch" elevation="2">
    <d-column gap block>
      <d-textfield
        full-width
        v-model="modelValue.name"
        color="primary"
        filled
        label="Name"
        type="name"
      />
      <d-textfield
        full-width
        v-model="modelValue.url"
        color="primary"
        filled
        label="Url"
        type="url"
      />
      <d-tab-list
        v-model="modelValue.applicationType"
        color="primary"
        elevation="1"
        class="ma-1"
      >
        <d-list-item v-for="app in AppTypes" :key="app" class="center-item">
          {{ app }}
        </d-list-item>
      </d-tab-list>
    </d-column>
    <d-icon-button height="initial" type="button" color="error" @click="remove">
      <d-icon name="times" />
    </d-icon-button>
  </d-row>
</template>

<script setup lang="ts">
import { PropType, watch } from "vue";
import { JiraConfiguration } from "../../types/Jira";
import JiraConfig = JiraConfiguration.JiraConfig;
import ApplicationType = JiraConfiguration.ApplicationType;

const AppTypes = Object.keys(ApplicationType);

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: Object as PropType<JiraConfig>,
});

function remove() {
  emit("remove");
}

watch(
  () => props.modelValue,
  (data) => emit("update:modelValue", data)
);
</script>

<style scoped lang="scss">
.center-item {
  flex: 1;
  text-align: center;

  :deep(.d-list__item__content) {
    justify-content: center;
  }
}
</style>
