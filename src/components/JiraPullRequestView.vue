<template>
  <JiraViewWrapper class="jira-pull-request-view">
    <template v-slot:icon>
      <d-icon name="download-alt" :size="30" icon-style="monochrome" color="primary"/>
    </template>
    <template v-slot:title>
      Pull Requests
    </template>
    <SlideYDownTransition>
      <d-column v-if="item?.pullRequestData?.detail&&item?.pullRequestData?.detail[0]?.pullRequests.length>0" gap
                style="max-height: 100%; overflow: overlay" height="100%" :wrap="false">
        <d-card v-for="pullRequest in item.pullRequestData.detail[0]?.pullRequests" width="100%" elevation="4">
          <d-row gap class="px-3" glow v-ripple root-tag="a" target="_blank" :href="pullRequest.url">
            <d-avatar key="image" color="transparent" size="40" elevation-light :style="{
                          backgroundImage: `url(${pullRequest.source.repository.avatar})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                        }">
              <div/>
            </d-avatar>
            <d-column class="pa-0">
              <d-card-title class="font-size-medium">
                {{ pullRequest.name }}
              </d-card-title>
              <d-card-subtitle class="font-weight-bold">
                {{ pullRequest.source.repository.name }}
              </d-card-subtitle>
            </d-column>
            <d-spacer/>
            <d-column>
              <d-label>{{ pullRequest.status }}</d-label>
              <strong>{{ pullRequest.id }}</strong>
            </d-column>
          </d-row>
          <d-divider elevation="8"/>
          <d-card-subtitle class="pa-0">
            <d-card-subtitle class="font-weight-bold">
              Reviewers
            </d-card-subtitle>
            <d-card-subtitle class="font-weight-bold pa-0" color="success">
              {{ getApprovals(pullRequest.reviewers) }}
            </d-card-subtitle>
            /
            <d-card-subtitle class="pa-0">
              {{ pullRequest.reviewers.length }}
            </d-card-subtitle>
          </d-card-subtitle>
          <d-row>
            <d-row v-for="approved in [true, false]"
                   v-show="getReviewersForType(pullRequest.reviewers, approved).length"
                   gap class="ma-2 pa-3 mt-0" rounded="pill" style="gap: 20px"
                   :color="approved?'success':'error'" width="max-content" glowing>
              <d-tooltip v-for="user in getReviewersForType(pullRequest.reviewers, approved)" position="top"
                         filled :color="approved?'success':'error'">
                <SlideYUpTransition>
                  <d-avatar rounded="circle" :size="40" :style="{
                      backgroundImage: `url(${user.avatar})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      outline: `3px solid ${$vuelize.getColor(user.approved ? 'success' : 'error')}`,
                      outlineOffset: '4px'
                    }">
                    <div/>
                  </d-avatar>
                </SlideYUpTransition>
                <template v-slot:tooltip>
                  {{ user.name }}
                </template>
              </d-tooltip>
            </d-row>
          </d-row>
        </d-card>
      </d-column>
    </SlideYDownTransition>
  </JiraViewWrapper>
</template>

<script setup lang="ts">
import {inject, PropType} from "vue";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
import JiraViewWrapper from "./JiraViewWrapper.vue";
import {SlideYDownTransition, SlideYUpTransition} from "v3-transitions";

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})

function getApprovals(reviewers: any)/*TODO export namespace bs*/ {
  return reviewers.filter((reviewer: any /*TODO export namespace bs*/) => reviewer.approved).length
}

function getReviewersForType(reviewers: any, approved: boolean) {
  return reviewers
      .filter((reviewer: any) => reviewer.approved == approved)
      .sort((a: any, b: any) => b.name.localeCompare(a.name));
}
</script>

<style scoped lang="scss">
.jira-pull-request-view {
  .reviewer-row {
    display: flex;
  }
}
</style>
