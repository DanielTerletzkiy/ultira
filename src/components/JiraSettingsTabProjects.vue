<template>
  <d-column gap>
    <d-column outlined>
      <d-card-subtitle class="font-weight-bold">
        IDEs
      </d-card-subtitle>
      <d-column gap>
        <d-column v-for="(ide, i) in ides" :key="ide.id" gap>
          <JiraSettingsIDE :modelValue="ide" @update:modelValue="(e) => (ides[i] = e)" @remove="removeIDE(ide.id)" />
          <d-divider />
        </d-column>
        <d-button color="primary" glow type="button" @click="addIDE">
          <template v-slot:prefix>
            <d-icon name="plus" />
          </template>
          Add IDE
        </d-button>
      </d-column>
    </d-column>
    <d-card-subtitle class="pl-0 font-weight-bold">
      Projects
    </d-card-subtitle>
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
    <d-column v-for="(project, i) in projects" :key="project.path" gap>
      <JiraSettingsProject :modelValue="project"
                           @update:modelValue="(e) => (projects[i] = e)"
                           @remove="removeProject(project.path)" />
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
import jiraStore, { ides, projects } from "../store/jira.store";
import ProjectController from "../controller/ProjectController";
import JiraProjectBranchRefreshButton from "./JiraProjectBranchRefreshButton.vue";
import JiraSettingsProject from "./JiraSettingsProject.vue";
import { v4 as uuidv4 } from "uuid";
import JiraSettingsIDE from "./JiraSettingsIDE.vue";
import { Project } from "../../types/Jira";

const store = jiraStore;

watch(
  projects,
  (value) => {
    console.log(value);
    store.dispatch("setRawProjects", value);
  },
  { deep: true }
);

watch(
  ides,
  (value) => {
    store.dispatch("setIdes", value);
  },
  { deep: true }
);

const scrapePath = ref("");

function addProject() {
  projects.value.push({
    project: "",
    path: "",
    branch: "none",
    //@ts-ignore
    changes: {},
    ideId: ""
  });
  console.log(projects.value);
}

function removeProject(path: string) {
  const index = projects.value.findIndex((project) => project.path === path);
  if (index > -1) {
    projects.value.splice(index, 1);
  }
}

function updateProject(project: Project, i: number) {
  //@ts-ignore
  projects.value[i] = project;
  console.log(projects.value[i]);
}

function startScraper(path: string) {
  ProjectController.scrape(path);
}

function addIDE() {
  ides.value.push({
    id: uuidv4(),
    path: "",
    name: ""
  });
}

function removeIDE(id: string) {
  const index = ides.value.findIndex((ide) => ide.id === id);
  if (index > -1) {
    ides.value.splice(index, 1);
  }
}
</script>

<style scoped lang="scss"></style>
