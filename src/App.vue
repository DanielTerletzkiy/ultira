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

const baseurl = import.meta.env.BASE_URL
</script>

<template>
  <d-root>
    <template v-slot:toolbar>
      <DToolbar>
        <d-row class="action" width="fit-content">
          <d-tooltip color="primary">
            <d-icon-button color="primary" @click="toggleSettings">
              <d-avatar size="30" color="transparent" :style="{
                  backgroundImage: `url(${baseurl}favicon.ico)`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }">
                <div/>
              </d-avatar>
            </d-icon-button>
            <template v-slot:tooltip>
              Settings
            </template>
          </d-tooltip>
        </d-row>
        <DCardTitle color="primary" class="title font-size-medium">
          ULTIRA
        </DCardTitle>
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
