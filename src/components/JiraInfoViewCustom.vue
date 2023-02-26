<template>
  <JiraViewWrapper hide-divider>
    <template v-slot:icon>
      <d-icon
        name="list-ui-alt"
        :size="30"
        icon-style="monochrome"
        color="primary"
      />
    </template>
    <template v-slot:title>
      Custom Variables
    </template>
    <d-card style="max-height: 100%; max-width: 100%; overflow: auto;">
      <d-column v-for="(item,i) in customVariables" :key="item.key" no-padding>
        <d-row>
          <d-card-subtitle class="font-size-medium font-weight-bold">
            {{ item.name }}:
          </d-card-subtitle>
          <d-spacer />
          <d-card-subtitle root-tag="pre" style="word-break: break-word;">
            {{ item.value }}
          </d-card-subtitle>
        </d-row>
        <d-divider v-if="i < customVariables.length -1 " />
      </d-column>
    </d-card>
  </JiraViewWrapper>
</template>

<script setup lang="ts">
import { currentIssue } from "../store/jira.store";
import { computed } from "vue";
import JiraViewWrapper from "./JiraViewWrapper.vue";

const customVariables = computed(() => {
  if (!currentIssue.value?.task) {
    return null;
  }
  const customVarKeys = Object.keys(currentIssue.value.task.fields)
    // @ts-ignore
    .filter(key => key.includes("customfield") && currentIssue.value.task.fields[key]);

  const customVariables = customVarKeys.map(key => {
    return {
      key,
      name: currentIssue.value?.task.names[key],
      // @ts-ignore
      value: currentIssue.value?.task.fields[key]
    };
  });
  console.log({ customVariables });
  return customVariables;

});
</script>

<style scoped lang="scss">

</style>
