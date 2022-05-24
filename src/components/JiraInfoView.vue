<template>
  <d-card class="jira-info" elevation="1" block height="100%">
    <d-column gap>
      <d-row class="px-1" gap>
        <d-tooltip position="right" filled color="primary">
          <d-avatar size="64" :style="{
            backgroundImage: `url(${item.task.fields.project.avatarUrls['48x48']})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }">
            <div/>
          </d-avatar>
          <template v-slot:tooltip>
            <d-column>
              <d-card-subtitle class="pa-0" color="inherit">
                <d-icon name="transaction" :size="20"/>
                {{ item.task.fields.project.name }}
              </d-card-subtitle>
              <d-card-subtitle class="pa-0" color="inherit">
                <d-icon name="key-skeleton" :size="20"/>
                {{ item.task.fields.project.key }}
              </d-card-subtitle>
            </d-column>
          </template>
        </d-tooltip>
        <d-column>
          <d-card-title class="pt-0">
            {{ item.task.fields.summary }}
          </d-card-title>
          <d-card-subtitle color="secondary">
            <d-icon-button rounded="md" :size="20" color="inherit" @click="copy(item.task.key)">
              <d-icon name="clipboard" :size="20"/>
            </d-icon-button>
            {{ item.task.key }}
          </d-card-subtitle>
        </d-column>
      </d-row>
      <div v-if="item.task.fields.description">
        <d-row>
          <d-card-subtitle class="pa-0">
            Description
          </d-card-subtitle>
          <d-divider class="mx-3" block/>
        </d-row>
        <d-card-subtitle class="description"
                         v-html="jira2md.jira_to_html(item.task.fields.description)"/>
      </div>
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import {inject, PropType} from "vue";
import JiraTask from "../controller/JiraTask";
import {State} from "vuelize/src/types/Vuelize";
//@ts-ignore
import jira2md from "jira2md";

const vuelize: Vuelize = inject('vuelize') as Vuelize;

const props = defineProps({
  item: Object as PropType<JiraTask>
})

function copy(text: string) {
  navigator.clipboard.writeText(text).then(function () {
    vuelize.notify('Copy', `Copied "${text}"`, State.Success)
  }, function (err) {
    vuelize.notify('Copy', `Failed to copy "${text}", ERR: ${err}`, State.Error)
  });
}
</script>

<style lang="scss">
.jira-info {
  .description {
    display: block;
    text-align-last: left;

    ul {
      margin-left: 20px;
    }
  }
}
</style>
