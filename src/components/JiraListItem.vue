<template>
  <d-row gap :wrap="false">
    <d-tooltip position="right" :color="status.color" filled :tint="80">
      <d-card elevation="4">
        <d-avatar :color="status.color" :tint="80" :size="40">
          <d-icon :name="status.icon" :color="status.color" :tint="-50" :size="30"/>
        </d-avatar>
      </d-card>
      <template v-slot:tooltip>
        <d-card-subtitle class="pa-0" :color="status.color" :tint="-50">
          {{ item.task.fields.status.name }}
        </d-card-subtitle>
      </template>
    </d-tooltip>
    <d-column class="header" width="100%">
      <d-card-subtitle class="summary">
        {{ item.task.fields.summary }}
        <d-spacer/>
        <d-image width="16px" height="16px" :src="item.task.fields.priority.iconUrl"/>
      </d-card-subtitle>
      <d-card-subtitle class="key">
        {{ item.task.key }}
        <d-spacer/>
        {{ new Date(item.task.fields.updated).toLocaleString('DE-de') }}
      </d-card-subtitle>
    </d-column>
  </d-row>
</template>

<script setup lang="ts">
import {computed, PropType} from "vue";
import JiraTask from "../controller/JiraTask";

const props = defineProps({
  item: {type: Object as PropType<JiraTask>, required: true}
})

const status = computed(() => {
  const payload = {
    color: '#62c62f',
    icon: 'check',
  };
  switch (props.item.task.fields.status.name) {
    case 'Open':
    case 'Backlog':
    case 'To Do': {
      payload.color = 'error';
      payload.icon = 'database';
      break;
    }
    case 'In Progress': {
      payload.color = 'warning';
      payload.icon = 'forward';
      break;
    }
    case 'In Code Review': {
      payload.color = 'info';
      payload.icon = 'search-alt'
      break;
    }
  }
  return payload;

})
</script>

<style scoped lang="scss">
.header {
  > * {
    color: inherit !important;
  }

  .summary {
    padding: 0;
  }

  .key {
    font-size: 0.8rem;
    padding: 0;
  }
}
</style>
