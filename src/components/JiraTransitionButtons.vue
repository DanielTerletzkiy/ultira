<template>
  <d-tab-list
    v-if="issue.transitionData"
    :key="issue.task.key"
    :wrap="false"
    gap
  >
    <component :is="disableTooltip?'span':DTooltip"
               v-for="transition in issue.transitionData.transitions"
               :key="transition.id" position="bottom"
    >
      <d-list-item color="secondary" @click="onClick(transition.id)">
        {{ transition.name }}
      </d-list-item>
      <template v-slot:tooltip>
        Status
        <d-icon name="arrow-right" :size="20" />
        <strong>{{ transition.to.name }}</strong>
      </template>
    </component>
  </d-tab-list>
</template>

<script setup lang="ts">
import { computed, inject, PropType, ref } from "vue";
import { currentIssue } from "../store/jira.store";
import JiraTask from "../model/JiraTask";
import DTooltip from "vuelize/src/components/tooltip/DTooltip.vue";

// eslint-disable-next-line no-undef,no-unused-vars
const vuelize: Vuelize = inject("vuelize") as Vuelize;

const props = defineProps({
  issue: Object as PropType<JiraTask>,
  disableTooltip: Boolean
});


function onClick(id: string) {
  props.issue?.updateTransition(id);
}
</script>

<style scoped></style>
