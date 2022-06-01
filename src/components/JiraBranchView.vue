<template>
  <d-card class="jira-branch" elevation="1" block height="100%">
    <d-card-title class="font-size-medium">
      Branches & Commits
    </d-card-title>
    <SlideXLeftTransition group>
      <d-column key="content" v-if="item?.commitData?.detail&&item?.commitData?.detail[0].repositories.length>0"
                class="mx-2 pt-0"
                style="max-height: calc(500px - 47px - 8px); overflow: overlay"
                gap :wrap="false">
        <d-card v-for="repository in item.commitData.detail[0].repositories" elevation="2" block
                background-color="transparent">
          <d-card class="sticky" block elevation="4">
            <d-row>
              <d-column>
                <d-card-title class="font-size-medium">
                  {{ repository.name }}
                </d-card-title>
                <d-card-subtitle>
                  Repository
                </d-card-subtitle>
              </d-column>
              <d-column>
                <d-card-title class="font-size-medium">
                  {{ repository.commits.length }}
                </d-card-title>
                <d-card-subtitle>
                  Commits
                </d-card-subtitle>
              </d-column>
            </d-row>
          </d-card>
          <d-column class="pa-2" gap>
            <d-accordion v-for="commit in repository.commits" header-color="primary">
              <template v-slot:header>
                <d-icon color="currentColor" name="file-check-alt"/>
                <d-card-subtitle class="pa-0 font-size-small"
                                 v-html="jira2md.jira_to_html(commit.message)"/>
              </template>
              <template v-slot:default>
                <d-card v-for="file in commit.files" block background-color="transparent">
                  <d-row block gap justify="start">
                    <d-label :color="changeTypeColor(file.changeType)">
                      {{ file.changeType }}
                    </d-label>
                    <d-column class="pa-0">
                      <d-card-subtitle class="pa-0" style="font-size: 0.8rem" color="success">
                        <d-icon name="plus" :size="14"/>
                        {{ file.linesAdded }}
                      </d-card-subtitle>
                      <d-card-subtitle class="pa-0" style="font-size: 0.8rem" color="error">
                        <d-icon name="minus" :size="14"/>
                        {{ file.linesRemoved }}
                      </d-card-subtitle>
                    </d-column>
                    <d-card-subtitle glow v-ripple root-tag="a" target="_blank" :href="file.url">
                      {{ file.path }}
                    </d-card-subtitle>
                  </d-row>
                  <d-divider elevation="6"/>
                </d-card>
              </template>
            </d-accordion>
          </d-column>
        </d-card>
      </d-column>
      <d-column key="empty" v-else-if="item?.commitData?.detail[0].repositories.length === 0">
        <d-card-title color="primary">
          <d-icon name="file-question-alt" :size="30"/>Empty
        </d-card-title>
      </d-column>
      <d-elevation-loader key="loader" v-else :elevation="20" :columns="10" :amount="100" default-size="40"
                          :speed="4000"/>
    </SlideXLeftTransition>
  </d-card>
</template>

<script setup lang="ts">
import {inject, PropType} from "vue";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
//@ts-ignore
import jira2md from "jira2md";
import {SlideXLeftTransition} from "v3-transitions";
import {JiraCommits} from "../../types/Jira";
import ChangeType = JiraCommits.ChangeType;

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})

function changeTypeColor(type: ChangeType) {
  switch (type) {
    case 'MODIFIED': {
      return 'primary'
    }
    case 'ADDED': {
      return 'success'
    }
    case 'DELETED': {
      return 'error'
    }
    case 'MOVED':
    case 'COPIED': {
      return 'warning'
    }
    case 'UNKNOWN': {
      return 'secondary'
    }
  }
}
</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
