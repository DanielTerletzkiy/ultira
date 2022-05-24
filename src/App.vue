<script setup lang="ts">
import JiraDashboard from "./views/JiraDashboard.vue";
</script>

<template>
  <d-root>
    <template v-slot:toolbar>
      <DToolbar>
        <d-column class="pa-0">
          <DCardTitle color="primary" :tint="80" class="font-size-medium">
            Ultira
          </DCardTitle>
        </d-column>
      </DToolbar>
    </template>
    <template v-slot:default>
      <d-notification-wrapper/>
      <JiraDashboard/>
    </template>
  </d-root>
</template>

<style lang="scss">
header, .d-toolbar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>
