<template>
  <d-dialog
    :modelValue="open"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <d-card width="700px">
      <d-card class="pa-2 pt-1 pb-0" block>
        <d-card-title> Ultira Settings</d-card-title>
        <d-tab-list v-model="currentSetting" color="primary" elevation="4" class="pa-2" filled gap>
          <d-list-item v-for="item in settingsList" center :key="item.name">
            <d-icon :name="item.icon" />
            {{ item.name }}
          </d-list-item>
        </d-tab-list>
      </d-card>
      <d-column
        class="pa-4 pt-0"
        gap
        :wrap="false"
        style="min-height: 800px; max-height: 800px; overflow: overlay"
      >
        <component :is="currentComponent" />
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import JiraSettingsTabProjects from "./JiraSettingsTabProjects.vue";
import JiraSettingsTabGeneral from "./JiraSettingsTabGeneral.vue";
import { zoomFactor } from "../store/jira.store";
import { useZoomFactor } from "@vueuse/electron";

defineEmits(["submit"]);
defineProps({
  open: Boolean
});

const currentSetting = ref("General");
const settingsList = [
  {
    name: "General",
    icon: "setting",
    component: JiraSettingsTabGeneral
  },
  {
    name: "Projects",
    icon: "folder-open",
    component: JiraSettingsTabProjects
  }
];
const currentComponent = computed(() =>
  (currentSetting.value && settingsList.length > 0
    ? settingsList.find((item) => item.name === currentSetting.value)
    : settingsList[0])?.component
);

onBeforeMount(() => {
  const factor = useZoomFactor();
  factor.value = zoomFactor.value;
});
</script>

<style scoped lang="scss">

</style>
