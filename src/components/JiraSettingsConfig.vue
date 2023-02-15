<template>
  <d-row block align="stretch" elevation="2" outlined>
    <d-column gap block v-if="config">
      <d-textfield
        full-width
        v-model="config.name"
        color="primary"
        filled
        label="Name"
        type="name"
      />
      <d-textfield
        full-width
        v-model="config.url"
        :color="!validation.url?'error':'primary'"
        filled
        label="Url"
        type="url"
      />
      <d-card-subtitle>
        ID: <strong>{{ config.id }}</strong>
      </d-card-subtitle>
      <d-tab-list
        v-model="config.applicationType"
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
      <JiraButtonConfirm color="error" icon="times" @confirm="remove" />
      <JiraButtonConfirm color="primary" icon="key-skeleton" @confirm="edit" />
      <d-spacer />
      <JiraButtonConfirm color="success" icon="save" @confirm="save" />
    </d-column>
  </d-row>
</template>

<script setup lang="ts">
import { computed, PropType, reactive, ref, toRefs, watch } from "vue";
import { JiraConfig } from "../../types/Jira";
import { credentialsOpen, selectedJiraConfig } from "../store/jira.store";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { clone } from "lodash";
import { ApplicationType } from "../../types/ApplicationType";

//@ts-ignore
const AppTypes = Object.keys(ApplicationType).map(
  //@ts-ignore
  (type) => ApplicationType[type]
);

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: { type: Object as PropType<JiraConfig>, required: true }
});

const config = ref(clone(toRefs(props).modelValue?.value));

function remove() {
  emit("remove");
}

function edit() {
  selectedJiraConfig.value = props.modelValue?.id;
  credentialsOpen.value = true;
}

function save() {
  console.log(config);
  emit("update:modelValue", config.value);
  config.value = clone(config.value);
}


const validation = computed(() => {
  return {
    url: config.value.url && /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+?)$/.test(config.value.url)
  };
});
</script>

<style scoped lang="scss">
.center-item {
  text-transform: capitalize;
}
</style>
