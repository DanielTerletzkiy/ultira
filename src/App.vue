<script setup lang="ts">
import { inject, onBeforeMount, ref } from "vue";
import JiraDashboard from "./views/JiraDashboard.vue";
import JiraSettings from "./components/JiraSettings.vue";
import JiraBaseSelector from "./components/JiraBaseSelector.vue";
import JiraSearchDialog from "./components/JiraSearchDialog.vue";
import { searchOpen, historyOpen, theme } from "./store/jira.store";
import AppToolbarControls from "./components/AppToolbarControls.vue";
import JiraHistoryDialog from "./components/JiraHistoryDialog.vue";
import { version } from "../package.json";

const vuelize: Vuelize = inject("vuelize") as Vuelize;

const settingsOpen = ref(false);

function toggleSettings() {
  settingsOpen.value = !settingsOpen.value;
}

function onSettingsSubmit() {
  toggleSettings();
}

function onToggleSearch() {
  searchOpen.value = !searchOpen.value;
}

const baseurl = import.meta.env.BASE_URL;

onBeforeMount(() => {
  vuelize.theme.dark = theme.value.isDark as boolean;
  ["dark", "light"].forEach((mode) => {
    //@ts-ignore
    vuelize.theme.themes[mode].primary = theme.value.primary[mode];
  });
});
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
        <d-tooltip filled color="secondary">
          <d-icon-button class="title action" name="search" @click="onToggleSearch" size="30" />
          <template v-slot:tooltip>
            <kbd>CTR</kbd> + <kbd>SHIFT</kbd> + <kbd>S</kbd>
          </template>
        </d-tooltip>
        <JiraBaseSelector />
        <d-spacer />
        <pre>v{{ version }}</pre>
        <AppToolbarControls />
      </DToolbar>
    </template>
    <template v-slot:default>
      <JiraDashboard />
      <JiraSettings v-model:open="settingsOpen" @submit="onSettingsSubmit" />
      <JiraSearchDialog v-model:open="searchOpen" />
      <JiraHistoryDialog v-model:open="historyOpen" />
    </template>
    <template v-slot:notifications>
      <d-notification-wrapper />
    </template>
  </d-root>
</template>

<style lang="scss">
.d-root > header {
  max-height: 30px !important;
}

header,
.d-toolbar {
  -webkit-app-region: drag;

  .d-card {
    padding: 0 !important;

    .d-row {
      padding-right: 0 !important;
    }
  }

  .d-title {
    -webkit-user-select: none !important;
  }

  .action {
    -webkit-app-region: no-drag;
  }

  kbd {
    $border-color: #282a2b;
    color: inherit;
    position: relative;
    user-select: none;
    font-weight: bold;
    font-size: 0.8rem;
    border: rgba(lighten($border-color, 20), 0.3) 1px solid;
    box-shadow: 2px 3px 0 rgba(lighten($border-color, 20), 0.3);
    min-width: 18px;
    padding: 0 4px;
    border-radius: 5px;
    overflow: hidden;
    transition: all 0.2s;
    font-family: monospace;

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
