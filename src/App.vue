<script setup lang="ts">
import {ref} from "vue";
import JiraDashboard from "./views/JiraDashboard.vue";
import JiraSettings from "./components/JiraSettings.vue";
import JiraBaseSelector from "./components/JiraBaseSelector.vue";
import JiraSearchDialog from "./components/JiraSearchDialog.vue";
import {searchOpen} from "./store/jira.store";

const settingsOpen = ref(false);

function toggleSettings() {
  settingsOpen.value = !settingsOpen.value;
}

function onSettingsSubmit() {
  toggleSettings();
}

function closeWindow() {
  window.close()
}

const baseurl = import.meta.env.BASE_URL
</script>

<template>
  <d-root>
    <template v-slot:toolbar>
      <DToolbar style="max-height: 30px;">
        <d-row class="action" width="fit-content">
          <d-tooltip color="secondary" position="right" filled>
            <d-icon-button color="primary" :size="30" @click="toggleSettings">
              <d-avatar :size="20" color="transparent" :style="{
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
        <DCardTitle color="primary" class="title font-size-small">
          ULTIRA
        </DCardTitle>
        <JiraBaseSelector/>
        <d-spacer/>
        <d-row class="action" gap width="auto">
          <d-icon-button :size="25" name="times" color="primary" @click="closeWindow"/>
        </d-row>
      </DToolbar>
    </template>
    <template v-slot:default>
      <d-notification-wrapper/>
      <JiraDashboard/>
      <JiraSettings v-model:open="settingsOpen" @submit="onSettingsSubmit"/>
      <JiraSearchDialog v-model:open="searchOpen"/>
    </template>
  </d-root>
</template>

<style lang="scss">
#root main {
  overflow: hidden;
}

.d-root > div {
  height: calc(100% - 30px) !important;
}

.d-root > header {
  max-height: 30px !important;
}

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
