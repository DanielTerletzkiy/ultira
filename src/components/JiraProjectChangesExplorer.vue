<template>
  <d-column
    block
    no-padding
    v-for="group in changeGroups"
    :key="group.name"
    v-show="group.files.length"
    :gap="false"
  >
    <d-accordion :header-color="group.color">
      <template v-slot:header>
        <d-row class="pa-2" gap>
          <d-row v-if="selectable && group.stageable" width="max-content" gap elevation="1">
            <d-tooltip>
              <d-icon-button :color="group.color" :disabled="group.files.length === selectedFileCount(group.files)"
                             :size="35" name="plus" @click="addAllFiles(group.files)" />
              <template v-slot:tooltip>
                Select all
              </template>
            </d-tooltip>
            <span>
              {{ selectedFileCount(group.files).toString().padStart(2, "0") }}
            </span>
            <d-tooltip>
              <d-icon-button :color="group.color" :disabled="!!!selectedFileCount(group.files)" :size="35" name="minus"
                             @click="removeAllFiles(group.files)" />
              <template v-slot:tooltip>
                Deselect all
              </template>
            </d-tooltip>
          </d-row>
          <d-label class="font-weight-bold">
            <template v-slot:prefix>
              <d-icon :name="group.icon || 'file'" />
            </template>
            {{ group.files.length }}
          </d-label>
          <span>{{ group.name }}</span>
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
            glow
            v-ripple
            @click.self="onFileClick(file.to || file)"
          >
            <d-row class="pa-0 px-2" gap>
              <d-checkbox v-if="selectable && group.stageable" :model-value="isFileSelected(file.to || file)"
                          @update:modelValue="()=>onFileSelect(file.to || file)"
                          :color="group.color" outlined/>
              <d-avatar
                size="30"
                color="transparent"
                :src="getVSIFileIcon(file.to || file)"
              />
              <d-card-subtitle class="py-1">
                <d-row v-if="file.from && file.to">
                  {{ getFileName(file.from).file }}
                  <d-icon name="arrow-right" />
                  {{ getFileName(file.to).file }}
                </d-row>
                <d-column no-padding v-else style="text-align: start">
                  <span>{{ getFileName(file).file }}</span>
                  <small>{{ getFileName(file).path }}</small>
                </d-column>
              </d-card-subtitle>
            </d-row>
            <d-divider
              elevation="8"
              v-if="f !== group.files.length - 1"
            />
          </d-card>
        </d-column>
      </d-row>
    </d-accordion>
  </d-column>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { Project } from "../../types/Jira";
import ProjectController from "../controller/ProjectController";
import { getVSIFileIcon } from "file-extension-icon-js";
import jiraStore from "../store/jira.store";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true },
  selectable: { type: Boolean }
});

function onFileClick(file: string) {
  ProjectController.openFile(
    jiraStore.getters.singleFullProject(props.project?.path),
    file
  );
}

function getFileName(path: string) {
  return {
    file: path.split("/").pop(),
    path: path.split("/").slice(0, -1).join("/") + "/"
  };
}

const changeGroups = computed(() => {
  return [
    {
      name: "Conflicted",
      files: props.project?.changes.conflicted,
      color: "error",
      icon: "exclamation-triangle",
      stageable: false
    },
    {
      name: "Modified",
      files: props.project?.changes.modified,
      color: "warning",
      icon: "edit",
      stageable: true
    },
    {
      name: "Created",
      files: props.project?.changes.created,
      color: "success",
      icon: "plus",
      stageable: true
    },
    {
      name: "Deleted",
      files: props.project?.changes.deleted,
      color: "error",
      icon: "trash",
      stageable: true
    },
    {
      name: "Not Added",
      files: props.project?.changes.not_added,
      color: "secondary",
      icon: "file-question",
      stageable: true
    },
    {
      name: "Renamed",
      files: props.project?.changes.renamed,
      color: "info",
      icon: "text-fields",
      stageable: false
    }
  ];
});

const selectedFiles = ref<Set<string>>(new Set<string>());

function isFileSelected(path: string) {
  return selectedFiles.value.has(path);
}

function selectedFileCount(paths: string[]) {
  let count = 0;
  for (const path of paths) {
    if (isFileSelected(path)) {
      count++;
    }
  }
  return count;
}

function onFileSelect(path: string) {
  if (isFileSelected(path)) {
    selectedFiles.value.delete(path);
  } else {
    selectedFiles.value.add(path);
  }
}

function addAllFiles(paths: string[]) {
  paths.forEach(selectedFiles.value.add, selectedFiles.value);
}

function removeAllFiles(paths: string[]) {
  paths.forEach(selectedFiles.value.delete, selectedFiles.value);
}
</script>
<style scoped lang="scss">

::v-deep(.d-accordion .d-title) {
  padding: 0 !important;
}

::v-deep(.d-accordion__header__icon) {
  display: none !important;
}
</style>
