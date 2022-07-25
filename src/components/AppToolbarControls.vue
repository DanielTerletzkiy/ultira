<template>
  <d-row class="action" width="auto">
    <d-icon-button
        :size="30"
        name="minus"
        color="primary"
        @click="minimizeWindow"
    />
    <d-icon-button
        :size="30"
        name="arrows-v-alt"
        color="primary"
        @click="maximizeWindow"
    />
    <d-icon-button
        :size="30"
        name="times"
        color="error"
        @click="closeWindow"
    />
  </d-row>
</template>
<script setup lang="ts">
const { BrowserWindow } = window.require('@electron/remote')
const getWindow = () => BrowserWindow.getFocusedWindow();

function closeWindow() {
  getWindow().close();
}

function minimizeWindow() {
  getWindow().minimize();
}

function maximizeWindow() {
  const window = getWindow();
  window.isMaximized() ? window.unmaximize() : window.maximize();
}
</script>
<style lang="scss"></style>
