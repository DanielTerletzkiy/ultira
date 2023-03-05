<template>
  <d-row gap width="max-content">
    <d-tooltip v-if="project.changes.behind > 0" position="left" color="warning">
      <JiraButtonConfirm
        class="pa-0"
        color="warning"
        askColor="warning"
        :disabled="isLoading"
        @confirm="onPull"
      >
        <template v-slot:prefix>
          <d-icon name="left-arrow-from-left" />
        </template>
        {{ project.changes.behind }}
      </JiraButtonConfirm>
      <template v-slot:tooltip>Commits behind</template>
    </d-tooltip>
    <d-tooltip v-if="project.changes.ahead > 0" position="right" color="success">
      <JiraButtonConfirm
        class="pa-0"
        color="success"
        askColor="success"
        :disabled="isLoading"
        @confirm="onPush"
      >
        {{ project.changes.ahead }}
        <template v-slot:suffix>
          <d-icon name="arrow-from-right" />
        </template>
      </JiraButtonConfirm>
      <template v-slot:tooltip>Commits ahead</template>
    </d-tooltip>
  </d-row>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import { Project } from "../../types/Jira";
import ProjectController from "../controller/ProjectController";
import JiraButtonConfirm from "./JiraButtonConfirm.vue";
import { loading } from "../store/jira.store";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true }
});

function onPull() {
  ProjectController.pullCurrent(props.project);
}

function onPush() {
  ProjectController.pushCurrent(props.project);
}

const isLoading = computed(() => {
  return loading.value.project?.includes(props.project.path);
});
</script>
<style scoped lang="scss">

</style>
