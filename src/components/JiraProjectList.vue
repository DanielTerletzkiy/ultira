<template>
  <d-card v-if="projects.length > 0" block elevation="2" class="ma-3">
    <d-textfield
      v-model="search"
      class="search sticky"
      filled
      solo
      placeholder="Search..."
      full-width
    >
      <template v-slot:prefix>
        <d-icon name="search" />
      </template>
      <template v-slot:suffix>
        <d-icon-button v-if="!!search" name="times" :size="30" @click="clearSearch"/>
      </template>
    </d-textfield>
    <d-column
      v-for="list in lists"
      :key="list.title"
      gap
      class="pa-0"
      v-show="list.projects.length > 0"
    >
      <d-card-subtitle
        color="primary"
        class="font-weight-bold px-4 sticky"
        glow
      >
        {{ list.title }}
      </d-card-subtitle>
      <JiraProjectListItem v-for="(project, p) in list.projects" :key="p" :project="project" />
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import { currentIssueKey, projects } from "../store/jira.store";
import { computed, ref } from "vue";
import { Project } from "../../types/Jira";
import JiraProjectListItem from "./JiraProjectListItem.vue";

const search = ref("");

function clearSearch(){
  search.value = "";
}

const lists = computed<Array<{ title: string; projects: Array<Project> }>>(
  () => {
    return [
      {
        title: "Recommended",
        projects: recommendedProjects.value,
      },
      {
        title: "All",
        projects: !search.value
          ? projects.value
          : projects.value.filter(
              (project) =>
                project.project
                  .toLowerCase()
                  .includes(search.value.toLowerCase()) ||
                project.branch
                  .toLowerCase()
                  .includes(search.value.toLowerCase()) ||
                project.path.toLowerCase().includes(search.value.toLowerCase())
            ),
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
.sticky {
  position: sticky;
  top: 48px;
  z-index: 1;
  user-select: none;
  backdrop-filter: blur(10px);
}

.search {
  top: 0;
  z-index: 2;
}

::v-deep(.d-accordion .d-title) {
  padding: 0 !important;
}

::v-deep(.d-accordion__header__icon) {
  display: none !important;
}
</style>
