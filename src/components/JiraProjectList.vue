<template>
  <d-card v-if="projects.length > 0" block elevation="4" class="ma-3">
    <d-column
      v-for="list in lists"
      :key="list.title"
      gap
      class="pa-0"
      v-show="list.projects.length > 0"
    >
      <d-card-subtitle color="primary" class="font-weight-bold px-4 sticky" glow
        >{{ list.title }}
      </d-card-subtitle>
      <d-accordion
        v-for="(project, p) in list.projects"
        :key="p"
        :model-value="project.changes?.length > 0 ? false : -1"
        header-color="primary"
      >
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
            <d-button
              v-if="project.branch"
              :color="
                project.branch === currentIssueKey ? 'primary' : 'secondary'
              "
              :disabled="!issueExists(project.branch)"
              @click="setIssue(project.branch)"
            >
              {{ project.branch }}
            </d-button>
            <JiraProjectButton
              :repository="project.project"
              tooltip-position="left"
            />
          </d-row>
        </template>
        <template v-slot:default>
          <d-column block>
            <d-card
              v-for="change in project.changes"
              :key="change"
              block
              background-color="transparent"
            >
              <d-row class="pa-0" gap>
                <d-label
                  v-for="(str, s) in change.slice(0, 2)"
                  :key="str"
                  :color="s <= 1 ? 'primary' : ''"
                  v-show="str !== ' ' && str !== ''"
                  :glowing="s <= 1"
                >
                  {{ str }}
                </d-label>
                <d-card-subtitle
                  glow
                  v-ripple
                  @click="onFileClick(project, change.at(-1))"
                >
                  {{ change.at(-1) }}
                </d-card-subtitle>
              </d-row>
              <d-divider elevation="8" />
            </d-card>
          </d-column>
        </template>
      </d-accordion>
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import { projects, currentIssueKey } from "../store/jira.store";
import JiraProjectButton from "./JiraProjectButton.vue";
import JiraController from "../controller/JiraController";
import { computed } from "vue";
import Project from "../model/Project";
import ProjectController from "../controller/ProjectController";

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

const lists = computed<Array<{ title: string; projects: Array<Project> }>>(
  () => {
    console.log(recommendedProjects.value);
    return [
      {
        title: "Recommended",
        projects: recommendedProjects.value,
      },
      {
        title: "All",
        projects: projects.value,
      },
    ];
  }
);

const recommendedProjects = computed<Array<Project>>(() => {
  return projects.value.filter(
    (project) =>
      project.branch.split("-")[0] === currentIssueKey.value.split("-")[0]
  );
});

function onFileClick(project: Project, file: string) {
  ProjectController.openFile(project, file);
}
</script>

<style scoped lang="scss">
.project {
  .title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .path {
    padding-left: 0;
    margin-top: -14px;
  }
}

.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  user-select: none;
  backdrop-filter: saturate(120%) blur(10px);
}

::v-deep(.d-accordion .d-title) {
  padding: 0 !important;
}

::v-deep(.d-accordion__header__icon) {
  display: none !important;
}
</style>
