<template>
  <d-row block align="stretch" elevation="2" outlined>
    <d-column gap block v-if="ide">
      <d-textfield
        full-width
        v-model="ide.name"
        color="primary"
        filled
        label="Name"
        type="name"
      />
      <d-textfield
        full-width
        v-model="ide.path"
        :color="!validation.path ? 'error' : 'primary'"
        filled
        label="Path"
        type="path"
      />
      <d-card-subtitle>
        ID: <strong>{{ ide.id }}</strong>
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
import { IDE, JiraConfig } from "../../types/Jira";
import { credentialsOpen, selectedJiraConfig } from "../store/jira.store";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { clone } from "lodash";
import { ApplicationType } from "../../types/ApplicationType";

const emit = defineEmits(["remove", "update:modelValue"]);
const props = defineProps({
  modelValue: { type: Object as PropType<IDE>, required: true },
});

const ide = ref(clone(toRefs(props).modelValue?.value));

function remove() {
  emit("remove");
}

function save() {
  emit("update:modelValue", ide.value);
  ide.value = clone(ide.value);
}

const validation = computed(() => {
  return {
    path:
      ide.value.path &&
      /^(?!.*[\\\/]\s+)(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:[^<>:"|?*\n]+(?:\/\/|\/|\\\\|\\)?)+$/.test(ide.value.path),
  };
});
</script>

<style scoped lang="scss">

</style>
