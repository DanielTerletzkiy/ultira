<template>
  <d-dialog
    :modelValue="open"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <d-card width="700px">
      <d-card class="pa-2 pt-1" block>
        <d-card-title> Ultira Settings</d-card-title>
        <d-divider />
      </d-card>
      <d-column
        class="pa-4"
        gap
        :wrap="false"
        style="min-height: 300px; max-height: 800px; overflow: overlay"
      >
        <d-column gap>
          <d-card-subtitle class="pl-0 font-weight-bold">
            Look & Feel
          </d-card-subtitle>
          <d-checkbox color="primary" v-model="$vuelize.theme.dark">
            Dark mode
          </d-checkbox>
          <d-card-subtitle
            root-tag="label"
            for="color"
            class="color-picker"
            glow
            color="primary"
            v-ripple
            :depressed="false"
          >
            <input
              id="color"
              type="color"
              v-model="$vuelize.theme.themes[currentTheme].primary"
            />
            Primary color
          </d-card-subtitle>
          <d-textfield
            v-model="refreshTime"
            full-width
            color="primary"
            filled
            label="Refresh Interval"
            type="number"
            min="15"
          >
            <template v-slot:suffix> seconds</template>
          </d-textfield>
          <d-textfield
            v-model="maxResults"
            full-width
            color="primary"
            filled
            label="Max Results"
            type="number"
            min="5"
          />
          <d-card-subtitle class="pl-0 pb-0 font-weight-bold">
            Zoom
          </d-card-subtitle>
          <d-row gap block outlined space-between :wrap="false">
            <d-icon-button
              :size="40"
              name="angle-left-b"
              type="button"
              @click="zoomFactor > 0.1 ? (zoomFactor -= 0.1) : null"
            />
            <d-button
              block
              color="secondary"
              type="button"
              style="font-size: 1.5rem"
              @click="zoomFactor = 1"
            >
              {{
                (Math.round(zoomFactor * 10) / 10).toString().padEnd(3, ".0")
              }}
            </d-button>
            <d-icon-button
              :size="40"
              name="angle-right-b"
              type="button"
              @click="zoomFactor < 5 ? (zoomFactor += 0.1) : null"
            />
          </d-row>
        </d-column>
        <d-divider />
        <d-column gap>
          <d-card-subtitle class="pl-0 font-weight-bold">
            Jira Configurations
          </d-card-subtitle>
          <d-column v-for="(config, i) in jiraConfigs" :key="i" gap>
            <JiraSettingsConfig
              v-model="jiraConfigs[i]"
              @remove="removeConfig(i)"
            />
            <d-divider />
          </d-column>
          <d-button color="primary" glow type="button" @click="addConfig">
            <template v-slot:prefix>
              <d-icon name="plus" />
            </template>
            Add Config
          </d-button>
        </d-column>
        <d-divider />
        <d-column gap>
          <d-card-subtitle class="pl-0 font-weight-bold">
            Projects
          </d-card-subtitle>
          <d-column gap>
            <d-textfield
              v-model="scrapePath"
              color="primary"
              outlined
              filled
              full-width
              label="Scrape Path"
              placeholder="C:\Users\[Current User]/[your input] or ~/[your input]"
            >
              <template v-slot:suffix>
                <d-icon-button
                  name="arrow-right"
                  :size="30"
                  :disabled="!scrapePath"
                  @click="startScraper(scrapePath)"
                />
              </template>
            </d-textfield>
            <JiraProjectBranchRefreshButton />
          </d-column>
          <d-column v-for="(project, i) in projects" :key="i" gap>
            <JiraSettingsProject
              v-model="projects[i]"
              @remove="removeProject(i)"
            />
            <d-divider />
          </d-column>
          <d-button color="primary" glow type="button" @click="addProject">
            <template v-slot:prefix>
              <d-icon name="plus" />
            </template>
            Add Project
          </d-button>
        </d-column>
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import JiraSettingsConfig from "./JiraSettingsConfig.vue";
import JiraSettingsProject from "./JiraSettingsProject.vue";
import {
  jiraConfigs, maxResults,
  projects,
  refreshTime, theme,
  zoomFactor
} from "../store/jira.store";
import { useZoomFactor } from "@vueuse/electron";
import ProjectController from "../controller/ProjectController";
import JiraProjectBranchRefreshButton from "./JiraProjectBranchRefreshButton.vue";
import { ApplicationType } from "../../types/Jira";
import { v4 as uuidv4 } from "uuid";

const factor = useZoomFactor();

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;
defineEmits(["submit"]);
defineProps({
  open: Boolean
});

const store = useStore();
watch(
  jiraConfigs,
  (value) => {
    store.dispatch("setJiraConfigs", value);
  },
  { deep: true }
);

function addConfig() {
  jiraConfigs.value.push({
    id: uuidv4(),
    name: "",
    url: "",
    applicationType: ApplicationType.Bitbucket
  });
}

function removeConfig(index: number) {
  jiraConfigs.value.splice(index, 1);
}

watch(
  projects,
  (value) => {
    store.dispatch("setProjects", value);
  },
  { deep: true }
);

function addProject() {
  projects.value.push({
    project: "",
    path: "",
    branch: "none",
    changes: []
  });
}

function removeProject(index: number) {
  projects.value.splice(index, 1);
}

const scrapePath = ref("");

function startScraper(path: string) {
  ProjectController.scrape(path);
}

const currentTheme = computed(() => (vuelize.theme.dark ? "dark" : "light"));
watch(
  () => vuelize.theme.themes[currentTheme.value].primary,
  (color) => {
    //@ts-ignore
    theme.value = { primary: { [currentTheme.value]: color } };
  }
);

watch(
  () => vuelize.theme.dark,
  (dark) => {
    theme.value = { isDark: dark };
  }
);

watch(
  () => zoomFactor.value,
  (factor) => {
    setElectronZoom(factor);
  }
);

function setElectronZoom(value: string | number) {
  if (typeof value === "string") {
    factor.value = parseFloat(value);
  } else {
    factor.value = value;
  }
}

onBeforeMount(() => {
  setElectronZoom(zoomFactor.value);
  vuelize.theme.dark = theme.value.isDark as boolean;
  ["dark", "light"].forEach((mode) => {
    //@ts-ignore
    vuelize.theme.themes[mode].primary = theme.value.primary[mode];
  });
});
</script>

<style scoped lang="scss">
.color-picker {
  user-select: auto !important;
  overflow: hidden;
  padding: 0;

  input[type="color"] {
    z-index: 1;
    -webkit-appearance: none;
    border: none;
    width: 30px;
    height: 30px;
    background: transparent;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
}
</style>
