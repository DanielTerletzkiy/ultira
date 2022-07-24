<script setup lang="ts">
import { ref } from "vue";
import JiraDashboard from "./views/JiraDashboard.vue";
import JiraSettings from "./components/JiraSettings.vue";
import JiraBaseSelector from "./components/JiraBaseSelector.vue";
import JiraSearchDialog from "./components/JiraSearchDialog.vue";
import { searchOpen } from "./store/jira.store";

const settingsOpen = ref(false);

function toggleSettings() {
  settingsOpen.value = !settingsOpen.value;
}

function onSettingsSubmit() {
  toggleSettings();
}

function closeWindow() {
  window.close();
}

const baseurl = import.meta.env.BASE_URL;
</script>

<template>
  <d-root>
    <template v-slot:toolbar>
      <DToolbar style="max-height: 30px">
        <d-row class="action" width="fit-content">
          <d-tooltip color="secondary" position="right" filled>
            <d-icon-button color="primary" :size="30" @click="toggleSettings">
              <d-avatar
                :size="20"
                color="transparent"
                :style="{
                  backgroundImage: `url(${baseurl}favicon.ico)`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }"
              >
                <div />
              </d-avatar>
            </d-icon-button>
            <template v-slot:tooltip> Settings</template>
          </d-tooltip>
        </d-row>
        <DCardTitle color="primary" class="title font-size-small">
          ULTIRA
        </DCardTitle>
        <d-card-title class="title font-size-small">
          <kbd>CTR</kbd> + <kbd>SHIFT</kbd> + <kbd>S</kbd> = search
        </d-card-title>
        <JiraBaseSelector />
        <d-spacer />
        <d-row class="action" gap width="auto">
          <d-icon-button
            :size="25"
            name="times"
            color="primary"
            @click="closeWindow"
          />
        </d-row>
      </DToolbar>
    </template>
    <template v-slot:default>
      <d-notification-wrapper />
      <JiraDashboard />
      <JiraSettings v-model:open="settingsOpen" @submit="onSettingsSubmit" />
      <JiraSearchDialog v-model:open="searchOpen" />
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

header,
.d-toolbar {
  -webkit-app-region: drag;

  .d-title {
    -webkit-user-select: none !important;
  }

  .action {
    -webkit-app-region: no-drag;
  }

  kbd {
    $border-color: #727272;
    $font-color: #949494;
    position: relative;
    user-select: none;
    font-weight: bold;
    font-size: 0.8rem;
    color: $font-color;
    border: rgba(lighten($border-color, 20), 0.3) 1px solid;
    box-shadow: 2px 3px 0 rgba(lighten($border-color, 20), 0.3);
    min-width: 18px;
    padding: 0 4px;
    border-radius: 5px;
    overflow: hidden;
    transition: all 0.2s;


    &:hover {
      $hover-border-color: rgba(lighten($border-color, 40), 0.3);
      border: $hover-border-color 1px solid;
      box-shadow: 0 0 0 transparent;
    }
  }
}

.d-tooltip {
  width: initial;
}
</style>
