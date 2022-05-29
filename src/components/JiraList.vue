<template>
  <d-column gap>
    <d-list v-model="modelValue" @update:modelValue="onChange" color="primary">
      <d-list-item v-for="issue in jiraController.issues" :key="issue.task.key" :id="issue.task.key" class="item">
        <JiraListItem :item="issue"/>
        <span v-if="issue.task.key === modelValue" class="observer" v-intersection-observer="intersectObserver"></span>
      </d-list-item>
    </d-list>
    <d-divider class="mx-3"/>
    <d-card class="sort-list mx-2" elevation-dark="2" elevation-light="">
      <d-tab-list class="font-weight-bold" show-indicator v-model="currentSort">
        <d-list-item class="sort-list__item" v-for="option in sortOptions" :key="option.name" :color="option.color">
          <d-icon :name="option.icon" :size="20"/>
          {{ option.name }}
        </d-list-item>
        <d-divider class="my-2" vertical elevation="6"/>
        <d-tooltip position="top" color="secondary" filled>
          <d-icon-button :size="40" @click="reload">
            <d-icon name="sync" :size="20"/>
          </d-icon-button>
          <template v-slot:tooltip>
            Reload
          </template>
        </d-tooltip>
        <d-tooltip position="top" color="secondary" filled>
          <d-icon-button :size="40" @click="scrollIntoView(modelValue)">
            <d-icon name="crosshair" :size="20"/>
          </d-icon-button>
          <template v-slot:tooltip>
            Snipe into view
          </template>
        </d-tooltip>
      </d-tab-list>
    </d-card>
  </d-column>
</template>

<script setup lang="ts">
import JiraListItem from "./JiraListItem.vue";
import JiraController from "../controller/JiraController";
import {inject, ref} from "vue";
import {refreshTime} from "../store/jira.store";
import {vIntersectionObserver} from "@vueuse/components";


const jiraController = inject('JiraController') as { value: JiraController };

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: String,
})

function onChange(selectedIssue: string) {
  emit('update:modelValue', selectedIssue)
}

function scrollIntoView(id: string) {
  document?.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
}

async function intersectObserver([{isIntersecting}]: any) {
  if (!isIntersecting && props.modelValue) {
    setTimeout(() => {
      if (props.modelValue) {
        scrollIntoView(props.modelValue)
      }
    }, 30000)
  }
}

function reload() {
  jiraController.value.getAllIssues();
}

setInterval(reload, refreshTime.value * 1000)

const currentSort = ref();
const sortOptions = [
  {
    name: 'Last updated',
    icon: 'clock',
    color: 'primary'
  },
  {
    name: 'Priority',
    icon: 'exclamation-triangle',
    color: 'warning'
  },
  {
    name: 'Project',
    icon: 'parcel',
    color: 'primary'
  },
]

</script>

<style scoped lang="scss">
.sort-list {
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: auto;

  &__item {
    flex: 1;
    text-align: center;

    :deep(.d-list__item__content) {
      justify-content: center;
    }
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

  ::v-deep(.d-list__item__content) {
    padding: 6px 8px !important;
  }
}
</style>
