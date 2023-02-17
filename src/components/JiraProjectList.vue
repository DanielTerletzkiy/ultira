<template>
  <d-card v-if="projects.length > 0" block elevation="4" class="ma-3">
    <d-textfield v-model="search" class="search sticky" filled solo placeholder="Search..." full-width>
      <template v-slot:prefix>
        <d-icon name="search" />
      </template>
    </d-textfield>
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
              v-for="file in project.changes.files"
              :key="file"
              block
              background-color="transparent"
            >
              <d-row class="pa-0" gap>
                <d-label
                  color="primary"
                >
                  {{ file.working_dir }}
                </d-label>
                <d-card-subtitle
                  glow
                  v-ripple
                  @click="onFileClick(project, file.path)"
                >
                  {{ file.path }}
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
import { computed, ref } from "vue";
import ProjectController from "../controller/ProjectController";
import { Project } from "../../types/Jira";

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

const search = ref("");

const lists = computed<Array<{ title: string; projects: Array<Project> }>>(
  () => {
    return [
      {
        title: "Recommended",
        projects: recommendedProjects.value
      },
      {
        title: "All",
        projects: !search ?
          projects.value :
          projects.value.filter((project) =>
            project.project.toLowerCase().includes(search.value.toLowerCase()) ||
            project.branch.toLowerCase().includes(search.value.toLowerCase()) ||
            project.path.toLowerCase().includes(search.value.toLowerCase())
          )
      }
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

.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  user-select: none;
  backdrop-filter: blur(10px);
}

.search {
  top: 35px;
  z-index: 2;

}

::v-deep(.d-accordion .d-title) {
  padding: 0 !important;
}

::v-deep(.d-accordion__header__icon) {
  display: none !important;
}
</style>
