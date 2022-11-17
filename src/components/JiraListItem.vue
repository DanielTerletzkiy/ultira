<template>
  <div class="list-item--wrapper">
    <d-list-item
      v-if="!hide"
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
          filled popover simple-fade
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
          <template v-slot:tooltip-wrapper>
            <d-card elevation="n4">
              <d-card-title :color="status.color" class="font-size-medium font-weight-bold" glowing>
                {{ item.task.fields.status.name }}
              </d-card-title>
              <JiraTransitionButtons :issue="item" class="font-size-small pa-2" disable-tooltip
                                     style="flex-direction: column" />
            </d-card>
          </template>
        </d-tooltip>
        <d-column class="header" width="100%">
          <d-card-subtitle class="summary">
            {{ item.task.fields.summary }}
            <d-spacer />
            <ve-progress
              v-if="item.loading"
              :color="$vuelize.getColor(status.color, 0)"
              :empty-color="$vuelize.getColor(status.color, 20) + '10'"
              thickness="2"
              empty-thickness="2px"
              :size="16"
              loading
            />
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
            <d-tooltip position="left">
              <JiraImage
                :url="item.task.fields.project.avatarUrls['16x16']"
                :key="item.task.fields.project.key"
              >
                <template v-slot:default="{ base64 }">
                  <d-avatar
                    v-if="base64"
                    key="image"
                    color="transparent"
                    size="16"
                    rounded="md"
                    :style="{
                      backgroundImage: `url(${base64})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }"
                  >
                    <div />
                  </d-avatar>
                  <d-elevation-loader
                    v-else
                    key="loader"
                    :default-size="8"
                    :amount="4"
                    :columns="2"
                  />
                </template>
              </JiraImage>
              <template v-slot:tooltip>
                Project: <strong>{{ item.task.fields.project.name }}</strong>
              </template>
            </d-tooltip>
          </d-card-subtitle>
          <d-card-subtitle class="sub">
            <span class="key">{{ item.task.key }}</span>
            <d-spacer />
            {{ new Date(item.task.fields.updated).toLocaleString(undefined) }}
          </d-card-subtitle>
        </d-column>
      </d-row>
    </d-list-item>
    <slot />
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import { VeProgress } from "vue-ellipse-progress";
import { computed, inject, PropType } from "vue";
import JiraTask from "../model/JiraTask";
import JiraImage from "./JiraImage.vue";
import JiraTransitionButtons from "./JiraTransitionButtons.vue";

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;

const props = defineProps({
  item: { type: Object as PropType<JiraTask>, required: true },
  hide: { type: Boolean }
});

const status = computed(() => {
  const payload = {
    color: "success",
    icon: "check"
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
      payload.icon = "bug";
      break;
    }
  }
  return payload;
});
</script>

<style scoped lang="scss">
.list-item {
  padding: 0 8px 0 0;

  &--wrapper {
    min-height: 56px;
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
