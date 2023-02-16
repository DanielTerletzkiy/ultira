<template>
  <d-column gap>
    <d-column outlined>
      <d-card-subtitle class="font-weight-bold">
        IDEs
      </d-card-subtitle>
      <d-column gap>
        <d-column v-for="(ide, i) in ides" :key="ide.id" gap>
          <JiraSettingsIDE :modelValue="ide" @update:modelValue="(e) => (ides[i] = e)" @remove="removeIDE(i)" />
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
    <d-column v-for="(project, i) in projects" :key="project.id" gap>
      <JiraSettingsProject :modelValue="project"
                           @update:modelValue="(e) => (projects[i] = e)"
                           @remove="removeProject(i)" />
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
import { useStore } from "vuex";
import JiraProjectBranchRefreshButton from "./JiraProjectBranchRefreshButton.vue";
import JiraSettingsProject from "./JiraSettingsProject.vue";
import { v4 as uuidv4 } from "uuid";
import JiraSettingsIDE from "./JiraSettingsIDE.vue";
import { Project } from "../../types/Jira";

const store = useStore();

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
    changes: [],
    ideId: ""
  });
  console.log(projects.value);
}

function removeProject(index: number) {
  console.log(typeof projects.value, projects.value);
  projects.value.splice(index, 1);
  console.log(index, jiraStore.state.projects);
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

function removeIDE(index: number) {
  ides.value.splice(index, 1);
}
</script>

<style scoped lang="scss"></style>
