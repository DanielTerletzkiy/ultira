<template>
  <d-dialog
    :modelValue="open"
    style="position:fixed;"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <JiraViewWrapper>
      <template v-slot:icon>
        <d-icon name="git-branch" />
      </template>
      <JiraProjectActions project="project" horizontal />
    </JiraViewWrapper>
  </d-dialog>
</template>

<script setup lang="ts">
import JiraViewWrapper from "./JiraViewWrapper.vue";
import JiraProjectActions from "./JiraProjectActions.vue";
import { PropType } from "vue";
import { Project } from "../../types/Jira";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true },
  open: { type: Boolean, required: true }
});
</script>

<style scoped lang="scss">

</style>
