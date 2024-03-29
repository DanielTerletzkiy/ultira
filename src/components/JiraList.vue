<template>
  <d-column
    no-padding
    block
    elevation="n2"
    height="100%"
    class="wrapper pa-0"
    :wrap="false"
  >
    <d-list
      v-if="debouncedSortedGroups.length"
      :model-value="modelValue"
      @update:modelValue="onChange"
      mandatory
      gap
      width="100%"
      class="list font-weight-bold"
      style="max-height: calc(100% - 48px); height: 100%; overflow: hidden auto"
    >
      <d-card
        v-for="group in debouncedSortedGroups"
        :key="group.name"
        background-color="transparent"
        block
        class="group"
      >
        <d-card-title
          class="py-1 pl-3 group-header font-weight-bold font-size-medium"
          glow
          color="secondary"
        >
          <JiraImage
            v-if="group.icon.type === 'image'"
            :url="group.icon.url"
            :key="group.icon.url"
          >
            <template v-slot:default="{ base64 }">
              <d-avatar
                v-if="base64"
                key="image"
                color="transparent"
                :size="30"
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
                :default-size="15"
                :amount="4"
                :columns="2"
              />
            </template>
          </JiraImage>
          <d-icon v-else :name="group.icon.url" :size="30" />
          {{ group.name }}
          <d-divider class="group-header__divider" block />
        </d-card-title>
        <d-column no-padding gap block class="pa-0 pt-1">
          <JiraListItem
            v-for="issue in group.items"
            :item="issue"
            class="item"
            :key="issue.task.key"
            :hide="hidden.has(issue.task.key)"
          >
            <span
              class="observer"
              v-intersection-observer="
                (e) =>
                  intersectObserver(
                    e,
                    issue.task.key === modelValue,
                    issue.task.key
                  )
              "
            ></span>
          </JiraListItem>
        </d-column>
      </d-card>
    </d-list>
    <d-row v-else block justify="center" height="100%" width="100%">
      <JiraLoader />
    </d-row>
    <d-card
      v-if="!hideSorter"
      style="max-height: 48px"
      block
      elevation-dark="2"
      elevation-light=""
    >
      <d-tab-list class="font-weight-bold" v-model="currentSort">
        <d-list-item
          class="sort-list__item"
          v-for="option in sortOptions"
          :key="option.name"
          :color="option.color"
          height="48px"
          center
        >
          <d-icon :name="option.icon" :size="20" />
          {{ option.name }}
        </d-list-item>
        <d-divider class="my-2" vertical elevation="6" />
        <d-tooltip position="top" color="secondary" filled>
          <d-icon-button :size="48" @click="reload">
            <d-icon name="sync" :size="25" />
          </d-icon-button>
          <template v-slot:tooltip> Reload</template>
        </d-tooltip>
        <d-tooltip position="top" color="secondary" filled>
          <d-icon-button :size="48" @click="scrollIntoView(modelValue)">
            <d-icon name="crosshair" :size="25" />
          </d-icon-button>
          <template v-slot:tooltip> Snipe into view</template>
        </d-tooltip>
      </d-tab-list>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import JiraListItem from "./JiraListItem.vue";
import JiraController from "../controller/JiraController";
import JiraTask from "../model/JiraTask";
import { onMounted, PropType, ref, watch } from "vue";
import {
  currentIssue,
  currentIssueKey,
  currentSort,
  refreshTime,
} from "../store/jira.store";
import { vIntersectionObserver } from "@vueuse/components";
import JiraImage from "./JiraImage.vue";
import { times } from "../constants/Times";
import { SortNames } from "../../types/SortNames";
import { debounce } from "lodash";
import JiraLoader from "./JiraLoader.vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: String,
  hideSorter: Boolean,
  issueList: {
    type: Object as PropType<Array<JiraTask>>,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [],
  },
});

onMounted(() => {
  scrollTimeout(5000);
});

function onChange(selectedIssue: string) {
  emit("update:modelValue", selectedIssue);
}

function scrollIntoView(id: string) {
  document?.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

const hidden = ref<Set<string>>(new Set<string>());

// eslint-disable-next-line no-undef
let timeout: NodeJS.Timeout | null | undefined = null;

async function intersectObserver(e: any, selected: boolean, key: string) {
  const isIntersecting = e[0].isIntersecting;
  if (selected) {
    if (timeout && isIntersecting) {
      clearTimeout(timeout);
    }
    if (!isIntersecting && props.modelValue !== key) {
      scrollTimeout(60000);
    }
    hidden.value.delete(key);
  } else {
    if (isIntersecting) {
      hidden.value.delete(key);
    } else if (props.modelValue !== key) {
      // hidden.value.add(key); //TODO: check if more performance or not
    }
  }
}

function scrollTimeout(milli: number) {
  timeout = setTimeout(() => {
    if (props.modelValue) {
      scrollIntoView(props.modelValue);
    }
  }, milli);
}

function reload() {
  JiraController.getAllIssues();
}

setInterval(reload, refreshTime.value * 1000);

const sortOptions = [
  {
    name: SortNames.Latest,
    icon: "clock",
    color: "primary",
  },
  {
    name: SortNames.Priority,
    icon: "exclamation-triangle",
    color: "warning",
  },
  {
    name: SortNames.Type,
    icon: "list-ui-alt",
    color: "primary",
  },
  /*{ TODO
    name: SortNames.State,
    icon: 'arrow-growth',
    color: 'primary'
  },*/
  {
    name: SortNames.Project,
    icon: "parcel",
    color: "primary",
  },
];

const sortGroups = () => {
  let groups: Array<{
    name: string;
    icon: { type: string; url: string };
    items: Array<JiraTask>;
  }> = [];

  const localIssueList = [...props.issueList].sort((a, b) => {
    const da = new Date(a.task.fields.updated);
    const db = new Date(b.task.fields.updated);
    if (da == db) {
      return 0;
    }
    return da < db ? 1 : -1;
  });

  switch (currentSort.value) {
    case SortNames.Latest: {
      for (const time of times) {
        const dateStart = new Date();
        dateStart.setHours(dateStart.getHours() - time.hours);

        let items = localIssueList.filter((issue) => {
          const issueTime = new Date(issue.task.fields.updated).getTime();
          return issueTime >= dateStart.getTime();
        });

        if (groups.length > 0) {
          items = items.filter(
            (issue) =>
              !groups.filter(
                (group) =>
                  group.items.findIndex((x) => x.task.key === issue.task.key) >=
                  0
              ).length
          );
        }

        if (items.length > 0) {
          groups.push({
            name: time.name,
            icon: {
              type: "icon",
              url: "calendar-alt",
            },
            items,
          });
        }
      }
      break;
    }
    case SortNames.Priority: {
      const priorities = localIssueList
        .filter(
          (issue, idx) =>
            localIssueList.findIndex(
              (x) => x.task.fields.priority.id == issue.task.fields.priority.id
            ) == idx
        )
        .map((issue) => issue.task.fields.priority)
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

      for (const priority of priorities) {
        const items = localIssueList.filter(
          (issue) => issue.task.fields.priority.id === priority.id
        );
        groups.push({
          name: priority.name,
          icon: {
            type: "image",
            url: priority.iconUrl,
          },
          items,
        });
      }
      break;
    }
    case SortNames.Type: {
      const types = localIssueList
        .filter(
          (issue, idx) =>
            localIssueList.findIndex(
              (x) =>
                x.task.fields.issuetype.id == issue.task.fields.issuetype.id
            ) == idx
        )
        .map((issue) => issue.task.fields.issuetype)
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

      for (const type of types) {
        const items = localIssueList.filter(
          (issue) => issue.task.fields.issuetype.id === type.id
        );
        groups.push({
          name: type.name,
          icon: {
            type: "image",
            url: type.iconUrl,
          },
          items,
        });
      }
      break;
    }
    case SortNames.Project: {
      const projects = localIssueList
        .filter(
          (issue, idx) =>
            localIssueList.findIndex(
              (x) => x.task.fields.project.id == issue.task.fields.project.id
            ) == idx
        )
        .map((issue) => issue.task.fields.project)
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

      for (const project of projects) {
        const items = localIssueList.filter(
          (issue) => issue.task.fields.project.id === project.id
        );
        groups.push({
          name: project.name,
          icon: {
            type: "image",
            url: project.avatarUrls["32x32"],
          },
          items,
        });
      }
      break;
    }
  }
  return groups;
};

const debouncedSortedGroups = ref<
  Array<{
    name: string;
    icon: { type: string; url: string };
    items: Array<JiraTask>;
  }>
>([]);
watch(
  () => props.issueList,
  debounce(
    () => {
      debouncedSortedGroups.value = sortGroups();
    },
    props.hideSorter ? 0 : 500
  ),
  { deep: true }
);

watch(currentSort, () => {
  debouncedSortedGroups.value = sortGroups();
  scrollTimeout(100);
});

watch(
  [() => currentIssueKey.value, () => currentIssue.value?.task.fields.updated],
  () => {
    scrollTimeout(1000);
  }
);
</script>

<style scoped lang="scss">
.wrapper {
}
.group-header {
  position: sticky;
  top: -8px;
  z-index: 1;
  user-select: none;
  backdrop-filter: blur(10px);

  &__divider {
    background: linear-gradient(
      90deg,
      rgba(0, 212, 255, 0) 0%,
      currentColor 100%
    );
  }
}

.item {
  position: relative;
  padding: 0 !important;

  .observer {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.sort-list {
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: auto;

  &__item {
    flex: 1;
    text-align: center;

    ::v-deep(.d-list__item__content) {
      justify-content: center;
    }
  }
}
</style>
