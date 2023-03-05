<template>
  <d-accordion header-color="primary" elevation="3" :disabled="!hasChanges">
    <template v-slot:header>
      <d-row class="header px-3 pr-0" gap>
        <d-column class="project">
          <d-card-title class="title">
            {{ project.project }}
          </d-card-title>
          <d-card-subtitle class="path">
            {{ project.path }}
          </d-card-subtitle>
        </d-column>
        <d-spacer />
        <JiraProjectRemoteCommits :project="project" />
        <JiraProjectIssueButton :project="project" />
        <JiraProjectButton
          :repository="project.project"
          tooltip-position="left"
        />
      </d-row>
    </template>
    <template v-slot:default>
      <d-column gap>
        <d-card block elevation="2">
          <JiraProjectChangesExplorer :project="project" />
        </d-card>
      </d-column>
    </template>
  </d-accordion>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import { Project } from "../../types/Jira";
import JiraProjectButton from "./JiraProjectButton.vue";
import JiraProjectRemoteCommits from "./JiraProjectRemoteCommits.vue";
import JiraProjectChangesExplorer from "./JiraProjectChangesExplorer.vue";
import JiraProjectIssueButton from "./JiraProjectIssueButton.vue";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true }
});

const hasChanges = computed(() => props.project?.changes.files.length > 0);
</script>
<style scoped lang="scss">
.header {
  padding-right: 2px !important;

  .project {
    height: 54px;

    .title {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .path {
      padding-left: 0;
      margin-top: -8px;
      padding-bottom: 0;
    }
  }
}

.type {
  font-family: monospace;
}

.sticky {
  position: sticky;
  top: 82px;
  z-index: 1;
  user-select: none;
  backdrop-filter: blur(10px);
}

::v-deep(.d-accordion .d-title) {
  padding: 0 !important;
}

::v-deep(.d-accordion__header__icon) {
  display: none !important;
}
</style>
