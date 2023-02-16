<template>
  <d-column gap>
    <d-column gap>
      <d-textfield
        v-model="scrapePath"
        color="primary"
        filled
        full-width
        label="Scrape Path"
        placeholder="C:\Path\To\Projects\ or /Path/To/Projects/"
      >
        <template v-slot:suffix>
          <d-button :disabled="!scrapePath" @click="startScraper(scrapePath)">
            <template v-slot:suffix>
              <d-icon name="arrow-right" :size="30" />
            </template>
            Scrape
          </d-button>
        </template>
      </d-textfield>
      <JiraProjectBranchRefreshButton />
    </d-column>
    <d-column v-for="(project, i) in projects" :key="i" gap>
      <JiraSettingsProject v-model="projects[i]" @remove="removeProject(i)" />
      <d-divider />
    </d-column>
    <d-button color="primary" glow type="button" @click="addProject">
      <template v-slot:prefix>
        <d-icon name="plus" />
      </template>
      Add Project
    </d-button>
  </d-column>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { projects } from "../store/jira.store";
import ProjectController from "../controller/ProjectController";
import { useStore } from "vuex";
import JiraProjectBranchRefreshButton from "./JiraProjectBranchRefreshButton.vue";
import JiraSettingsProject from "./JiraSettingsProject.vue";

const store = useStore();

watch(
  projects,
  (value) => {
    store.dispatch("setProjects", value);
  },
  { deep: true }
);

const scrapePath = ref("");

function addProject() {
  projects.value.push({
    project: "",
    path: "",
    branch: "none",
    changes: [],
  });
}

function removeProject(index: number) {
  projects.value.splice(index, 1);
}

function startScraper(path: string) {
  ProjectController.scrape(path);
}
</script>

<style scoped lang="scss"></style>
