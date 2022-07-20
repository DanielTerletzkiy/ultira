<template>
  <d-list-item
    :key="item.task.key"
    :id="item.task.key"
    class="list-item"
    :color="status.color"
  >
    <d-row gap :wrap="false">
      <d-tooltip
        class="status-tooltip"
        position="right"
        :color="status.color"
        filled
        :tint="80"
      >
        <d-avatar
          class="status"
          :color="status.color"
          glowing
          :tint="80"
          :size="56"
        >
          <d-icon
            :name="status.icon"
            :color="status.color"
            :tint="0"
            :size="30"
          />
        </d-avatar>
        <template v-slot:tooltip>
          <d-card-subtitle class="pa-0" :color="status.color" :tint="-50">
            {{ item.task.fields.status.name }}
          </d-card-subtitle>
        </template>
      </d-tooltip>
      <d-column class="header" width="100%">
        <d-card-subtitle class="summary">
          {{ item.task.fields.summary }}
          <d-spacer />
          <FadeTransition>
            <ve-progress
              v-if="item.loading"
              :color="$vuelize.getColor(status.color, 0)"
              :empty-color="$vuelize.getColor(status.color, 20) + '10'"
              thickness="2"
              empty-thickness="2px"
              :size="16"
              loading
            />
          </FadeTransition>
          <d-tooltip position="left">
            <d-image
              width="16px"
              height="16px"
              :src="item.task.fields.priority.iconUrl"
              rounded="md"
            />
            <template v-slot:tooltip>
              Priority: <strong>{{ item.task.fields.priority.name }}</strong>
            </template>
          </d-tooltip>
          <d-tooltip position="left">
            <d-image
              width="16px"
              height="16px"
              :src="item.task.fields.issuetype.iconUrl"
              rounded="md"
            />
            <template v-slot:tooltip>
              Type: <strong>{{ item.task.fields.issuetype.name }}</strong>
            </template>
          </d-tooltip>
        </d-card-subtitle>
        <d-card-subtitle class="sub">
          <span class="key">{{ item.task.key }}</span>
          <d-spacer />
          {{ new Date(item.task.fields.updated).toLocaleString("DE-de") }}
        </d-card-subtitle>
      </d-column>
    </d-row>
    <slot />
  </d-list-item>
</template>

<script setup lang="ts">
//@ts-ignore
import { VeProgress } from "vue-ellipse-progress";
import { FadeTransition } from "v3-transitions";
import { computed, inject, PropType } from "vue";
import JiraTask from "../model/JiraTask";

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;

const props = defineProps({
  item: { type: Object as PropType<JiraTask>, required: true },
});

const status = computed(() => {
  const payload = {
    color: "success",
    icon: "check",
  };
  switch (props.item.task.fields.status.name) {
    case "Open":
    case "Backlog":
    case "To Do": {
      payload.color = "error";
      payload.icon = "database";
      break;
    }
    case "In Progress":
    case "Reopened": {
      payload.color = "warning";
      payload.icon = "forward";
      break;
    }
    case "In Code Review": {
      payload.color = "info";
      payload.icon = "search-alt";
      break;
    }
  }
  return payload;
});
</script>

<style scoped lang="scss">
.list-item {
  ::v-deep(.d-list__item__content) {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
  }

  .status {
    background: transparent;

    &::before {
      background: linear-gradient(
        90deg,
        currentColor 0%,
        rgba(0, 212, 255, 0) 100%
      );
    }
  }

  .header {
    > * {
      color: inherit !important;
    }

    .summary {
      padding: 0;
    }

    .sub {
      font-size: 0.8rem;
      padding: 0;

      .key {
        letter-spacing: 0.15em;
      }
    }
  }
}
</style>
