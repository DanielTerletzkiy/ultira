<template>
  <d-dialog
    :modelValue="open"
    style="position:fixed;"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <JiraViewWrapper v-if="!!project">
      <template v-slot:icon>
        <d-icon name="code-branch" color="primary" :size="30" />
      </template>
      <template v-slot:title>
        {{ project.project }}
        <JiraProjectIssueButton :project="project" />
        <d-spacer />
        <JiraProjectRemoteCommits :project="project" />
        <d-divider vertical height="100%" />
        <JiraProjectActions :project="project" horizontal :disabled="isLoading" />
      </template>
      <d-column
        style="max-height: 100%; overflow: overlay"
        height="40vh" width="40vw"
        :wrap="false"
        no-padding
      >
        <d-card elevation="n2" block>
          <d-column no-padding class="sticky" elevation="n1">
            <d-tab-list v-model="currentAction" height="40px" color="primary" rounded="none"
                        class="tab-list font-weight-bold">
              <d-list-item v-for="tab in gitActionTabs" center :key="tab.type" rounded="none" class="tab-item">
                <d-icon :name="tab.icon" />
                {{ tab.type }}
              </d-list-item>
            </d-tab-list>
            <d-divider elevation-dark="2" />
          </d-column>
          <d-row style="max-height: calc(100% - 41px); height: 100%" align="stretch">
            <component :is="currentActionComponent" :project="project" />
          </d-row>
        </d-card>
      </d-column>
    </JiraViewWrapper>
  </d-dialog>
</template>

<script setup lang="ts">
import JiraViewWrapper from "./JiraViewWrapper.vue";
import JiraProjectActions from "./JiraProjectActions.vue";
import { computed, PropType, ref } from "vue";
import { Project } from "../../types/Jira";
import jiraStore, { currentIssue, loading } from "../store/jira.store";
import JiraProjectRemoteCommits from "./JiraProjectRemoteCommits.vue";
import JiraProjectIssueButton from "./JiraProjectIssueButton.vue";
import { gitActionTabs } from "../constants/GitActionTabs";
import JiraProjectAdvancedGitCommit from "./JiraProjectAdvancedGitCommit.vue";
import { GitActionTabTypes } from "../../types/GitActionTabTypes";
import { startCase } from "lodash";

const props = defineProps({
  repository: { type: Object as PropType<Project["path"]>, required: true },
  open: { type: Boolean, required: true }
});

const project = computed<Project>(
  () => jiraStore.getters.singleFullProject(props.repository)
);

const currentAction = ref<GitActionTabTypes>(GitActionTabTypes.Commit);
const currentActionComponent = computed(() => {
  switch (currentAction.value) {
    case GitActionTabTypes.Commit: {
      return JiraProjectAdvancedGitCommit;
    }
    default: {
      return JiraProjectAdvancedGitCommit;
    }
    /*case GitActionTabTypes.Logs: {

    }
    case GitActionTabTypes.Stash: {

    }
    case GitActionTabTypes.Custom: {

    }*/
  }
});

const isLoading = computed(() => {
  return loading.value.project?.includes(project.value.path);
});
</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-list {
  .tab-item {
    text-transform: capitalize;
  }
}
</style>
