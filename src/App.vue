<script setup lang="ts">
import {ref} from "vue";
import JiraDashboard from "./views/JiraDashboard.vue";
import JiraSettings from "./components/JiraSettings.vue";
import JiraBaseSelector from "./components/JiraBaseSelector.vue";

const settingsOpen = ref(false);

function toggleSettings() {
  settingsOpen.value = !settingsOpen.value;
}

function onSettingsSubmit() {
  toggleSettings();
}
</script>

<template>
  <d-root>
    <template v-slot:toolbar>
      <DToolbar>
        <DCardTitle color="primary" class="font-size-medium">
          Ultira
        </DCardTitle>
        <d-row class="action" width="fit-content">
          <d-tooltip>
            <d-icon-button @click="toggleSettings">
              <d-icon name="setting"/>
            </d-icon-button>
            <template v-slot:tooltip>
              Settings
            </template>
          </d-tooltip>
        </d-row>
        <JiraBaseSelector/>
      </DToolbar>
    </template>
    <template v-slot:default>
      <d-notification-wrapper/>
      <JiraDashboard/>
      <JiraSettings v-model:open="settingsOpen" @submit="onSettingsSubmit"/>
    </template>
  </d-root>
</template>

<style lang="scss">
header, .d-toolbar {
  -webkit-app-region: drag;

  .d-title {
    -webkit-user-select: none !important;
  }

  .action {
    -webkit-app-region: no-drag;
  }
}
.d-tooltip {
  width: initial;
}
</style>
