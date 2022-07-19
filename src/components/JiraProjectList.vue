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
              color="secondary"
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
          <d-column gap block>
            <d-row
              v-for="change in project.changes"
              :key="change"
              class="pa-0"
              gap
            >
              <d-card-subtitle
                v-for="(str, s) in change.split(/(D|M|A|\?\?) /)"
                :key="str"
                class="pa-0"
                :color="s <= 1 ? 'primary' : ''"
              >
                {{ str }}
              </d-card-subtitle>
            </d-row>
            <d-divider elevation="10" />
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
