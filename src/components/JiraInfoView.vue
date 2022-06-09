<template>
  <d-card class="jira-info" elevation="1" block>
    <d-column gap block :wrap="false">
      <d-row class="px-1" gap :wrap="false">
        <d-tooltip position="right" filled color="primary">
          <JiraImage :url="item.task.fields.project.avatarUrls['48x48']" :key="item.task.fields.project.key">
            <template v-slot:default="{base64}">
              <d-card width="64px" height="64px" elevation-light>
                <FadeTransition group>
                  <d-avatar v-if="base64" key="image" color="transparent" size="64" :style="{
                    backgroundImage: `url(${base64})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }">
                    <div/>
                  </d-avatar>
                  <d-elevation-loader v-else key="loader" :default-size="32" :amount="4" :columns="2"/>
                </FadeTransition>
              </d-card>
            </template>
          </JiraImage>
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
        <d-column block>
          <d-card-title class="pt-0 font-size-medium">
            {{ item.task.fields.summary }}
          </d-card-title>
          <d-card-subtitle>
            <d-tooltip>
              <d-icon-button rounded="md" :size="24" color="inherit" @click="copy(item.task.key)">
                <d-icon name="key-skeleton" :size="20"/>
              </d-icon-button>
              <template v-slot:tooltip>
                Copy Key
              </template>
            </d-tooltip>
            <d-tooltip>
              <d-icon-button rounded="md" :size="24" color="inherit" @click="copy(`[${item.task.key}](${issueLink})`)">
                <d-icon name="link-alt" :size="20"/>
              </d-icon-button>
              <template v-slot:tooltip>
                Copy Issue Link
              </template>
            </d-tooltip>
            <d-button width="max-content" root-tag="a" target="_blank" :href="issueLink">
              {{ item.task.key }}
            </d-button>
            <d-spacer/>
            <JiraTransitionButtons :item="item"/>
          </d-card-subtitle>
        </d-column>
      </d-row>
      <d-row class="info-row" gap block :wrap="false" align="start">
        <d-column v-if="item.task.fields.description" class="description-column" :wrap="false" block>
          <d-row>
            <d-card-subtitle class="pa-0 font-weight-bold">
              Description
            </d-card-subtitle>
            <d-divider class="mx-3" block elevation="6"/>
          </d-row>
          <JiraMarkup :body="item.task.fields.description"/>
        </d-column>
        <d-spacer v-else/>
        <JiraInfoViewSidebar :item="item"/>
      </d-row>
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import {computed, inject, PropType} from "vue";
import JiraTask from "../controller/JiraTask";
import {State} from "vuelize/src/types/Vuelize";
//@ts-ignore
import jira2md from "jira2md";
import JiraController from "../controller/JiraController";
import JiraInfoViewSidebar from "./JiraInfoViewSidebar.vue";
import JiraMarkup from "./JiraMarkup.vue";
import JiraImage from "./JiraImage.vue";
import {FadeTransition} from "v3-transitions"
import JiraTransitionButtons from "./JiraTransitionButtons.vue";

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})

const issueLink = computed(() => `${jiraController.value.controller.url}/browse/${props.item?.task.key}`)

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
  display: flex;
  max-height: inherit;
  overflow: hidden;

  .info-row {
    max-height: calc(100% - 78px - 8px);

    .description-column {
      max-height: 100%;
      overflow: auto;
    }
  }
}
</style>
