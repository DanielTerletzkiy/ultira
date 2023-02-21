<template>
  <d-tab-list
    v-if="issue.transitionData"
    :key="issue.task.key"
    :wrap="false"
    gap
  >
    <d-tooltip
      v-for="transition in issue.transitionData.transitions"
      :key="transition.id" position="bottom" :inactive="disableTooltip"
    >
      <d-list-item color="secondary" @click="onClick(transition.id)">
        <d-avatar v-if="disableTooltip" :color="transition.to.statusCategory.colorName" :size="8" rounded="circle">
          <div />
        </d-avatar>
        {{ transition.name }}
      </d-list-item>
      <template v-slot:tooltip>
        Status
        <d-icon name="arrow-right" :size="20" :color="transition.to.statusCategory.colorName" />
        <strong>{{ transition.to.name }}</strong>
      </template>
    </d-tooltip>
  </d-tab-list>
</template>

<script setup lang="ts">
import { inject, PropType } from "vue";
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
