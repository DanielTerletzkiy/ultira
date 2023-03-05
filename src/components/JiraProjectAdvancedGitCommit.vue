<template>
  <d-column gap block no-padding>
    <d-card block background-color="transparent" class="pa-1">
      <JiraProjectChangesExplorer :project="project" selectable />
    </d-card>
    <d-textfield v-model="message" elevation="n1" class="sticky" color="primary" placeholder="Commit message" rounded="none" filled solo
                 full-width>
      <template v-slot:prefix>
                <span style="width: max-content; display: flex">
                  [{{ currentIssue?.task.key }}]
                </span>
      </template>
      <template v-slot:suffix>
        <d-row>
          <d-tooltip padding="12px">
            <d-icon-button name="message" :size="30" :disabled="!canCommit"/>
            <template v-slot:tooltip>
              Commit & Push
            </template>
          </d-tooltip>
        </d-row>
      </template>
    </d-textfield>
  </d-column>
</template>
<script setup lang="ts">
import JiraProjectChangesExplorer from "./JiraProjectChangesExplorer.vue";
import { computed, PropType, ref } from "vue";
import { Project } from "../../types/Jira";
import { currentIssue } from "../store/jira.store";

const props = defineProps({
  project: { type: Object as PropType<Project>, required: true }
});

const message = ref("");

const canCommit = computed(() => !!message.value.length);
</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
</style>
