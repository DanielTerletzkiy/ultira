<template>
  <d-accordion header-color="primary">
    <template v-slot:header>
      <d-row class="px-3" gap>
        <d-column class="project">
          <d-card-title class="title">
            {{ project.project }}
          </d-card-title>
          <d-card-subtitle class="path">
            {{ project.path }}
          </d-card-subtitle>
        </d-column>
        <d-spacer />
        <d-row gap width="max-content">
          <d-tooltip position="left" color="warning">
            <d-card-subtitle
              class="pa-0"
              color="warning"
              v-if="project.changes.behind > 0"
            >
              <d-icon name="left-arrow-from-left" />
              {{ project.changes.behind }}
            </d-card-subtitle>
            <template v-slot:tooltip>Commits behind</template>
          </d-tooltip>
          <d-spacer />
          <d-tooltip position="right" color="success">
            <d-card-subtitle
              class="pa-0"
              color="success"
              v-if="project.changes.ahead > 0"
            >
              {{ project.changes.ahead }}
              <d-icon name="arrow-from-right" />
            </d-card-subtitle>
            <template v-slot:tooltip>Commits ahead</template>
          </d-tooltip>
        </d-row>
        <d-button
          v-if="project.branch"
          :color="project.branch === currentIssueKey ? 'primary' : 'secondary'"
          :disabled="!issueExists(project.branch)"
          @click="setIssue(project.branch)"
        >
          <template v-slot:prefix>
            <d-icon
              v-if="project.defaultBranch === project.branch"
              name="cloud-data-connection"
            />
          </template>
          {{ project.branch }}
        </d-button>
        <JiraProjectButton
          :repository="project.project"
          tooltip-position="left"
        />
      </d-row>
    </template>
    <template v-slot:default>
      <d-column
        block
        no-padding
        elevation="4"
        v-for="group in changeGroups"
        :key="group.name"
        v-show="group.files.length"
      >
        <d-accordion :header-color="group.color">
          <template v-slot:header>
            <d-row class="pa-2" gap>
              <d-label class="font-weight-bold">
                <template v-slot:prefix>
                  <d-icon name="file" />
                </template>
                {{ group.files.length }}
              </d-label>
              <span>
                {{ group.name }}
              </span>
            </d-row>
          </template>
          <d-row :wrap="false">
            <d-divider vertical block :color="group.color" size="2px" />
            <d-column block>
              <d-card
                v-for="(file, f) in group.files"
                :key="file"
                block
                background-color="transparent"
                class="file"
              >
                <d-row class="pa-0" gap>
                  <d-avatar
                    size="30"
                    color="transparent"
                    :src="getMaterialFileIcon(file.to || file)"
                  />
                  <d-card-subtitle
                    glow
                    v-ripple
                    @click="onFileClick(file.to || file)"
                  >
                    <d-row v-if="file.from && file.to">
                      {{ file.from }}
                      <d-icon name="arrow-right" />
                      {{ file.to }}
                    </d-row>
                    <span v-else>{{ file }}</span>
                  </d-card-subtitle>
                </d-row>
                <d-divider elevation="8" v-if="f !== group.files.length - 1" />
              </d-card>
            </d-column>
          </d-row>
        </d-accordion>
      </d-column>
    </template>
  </d-accordion>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";
import { Project } from "../../types/Jira";
import jiraStore, { currentIssueKey } from "../store/jira.store";
import JiraController from "../controller/JiraController";
import ProjectController from "../controller/ProjectController";
import JiraProjectButton from "./JiraProjectButton.vue";
import { getMaterialFileIcon } from "file-extension-icon-js";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true },
});

function setIssue(branch: string) {
  currentIssueKey.value = branch;
}

function issueExists(branch: string): boolean {
  return (
    JiraController.issues.value.findIndex(
      (issue) => issue.task.key === branch
    ) > -1
  );
}

function onFileClick(file: string) {
  ProjectController.openFile(
    jiraStore.getters.singleFullProject(props.project?.path),
    file
  );
}

const changeGroups = computed(() => {
  return [
    {
      name: "Staged",
      files: props.project?.changes.staged,
      color: "primary",
    },
    {
      name: "Modified",
      files: props.project?.changes.modified,
      color: "warning",
    },
    {
      name: "Created",
      files: props.project?.changes.created,
      color: "success",
    },
    {
      name: "Deleted",
      files: props.project?.changes.deleted,
      color: "error",
    },
    {
      name: "Renamed",
      files: props.project?.changes.renamed,
      color: "secondary",
    },
    {
      name: "Not Added",
      files: props.project?.changes.not_added,
      color: "secondary",
    },
  ];
});
</script>
<style scoped lang="scss">
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
