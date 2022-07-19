<template>
  <d-card v-if="projects.length > 0" block elevation="4" class="ma-3">
    <d-column
      v-for="list in lists"
      :key="list.title"
      gap
      v-show="list.projects.length > 0"
    >
      <d-card-subtitle color="primary" class="font-weight-bold" glow
        >{{ list.title }}
      </d-card-subtitle>
      <d-row
        v-for="project in list.projects"
        :key="project.path"
        width="auto"
        class="px-3"
        glow
        gap
      >
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
}
</style>
