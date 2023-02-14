<template>
  <d-row block align="stretch" elevation="2" outlined>
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
      <d-card-subtitle>
        ID: <strong>{{ modelValue.id }}</strong>
      </d-card-subtitle>
      <d-tab-list
        v-model="modelValue.applicationType"
        color="primary"
        elevation="1"
        class="ma-1"
      >
        <d-list-item
          v-for="app in AppTypes"
          :key="app"
          class="center-item"
          center
        >
          {{ app }}
        </d-list-item>
      </d-tab-list>
    </d-column>
    <d-column elevation="n1">
      <JiraButtonConfirm color="error" icon="times" @confirm="remove"/>
      <JiraButtonConfirm color="primary" icon="edit" @confirm="edit"/>
    </d-column>
  </d-row>
</template>

<script setup lang="ts">
import { PropType, watch } from "vue";
import { JiraConfig, ApplicationType } from "../../types/Jira";
import { credentialsOpen, selectedJiraConfig } from "../store/jira.store";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";

//@ts-ignore
const AppTypes = Object.keys(ApplicationType).map(
  //@ts-ignore
  (type) => ApplicationType[type]
);

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: Object as PropType<JiraConfig>
});

function remove() {
  emit("remove");
}

function edit(){
  selectedJiraConfig.value = props.modelValue?.id;
  credentialsOpen.value = true;
}

watch(
  () => props.modelValue,
  (data) => emit("update:modelValue", data)
);
</script>

<style scoped lang="scss">
.center-item {
  text-transform: capitalize;
}
</style>
