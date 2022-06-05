<template>
  <JiraViewWrapper>
    <template v-slot:title>
      Pull Requests
    </template>
    <SlideYDownTransition>
      <d-column v-if="item?.pullRequestData?.detail&&item?.pullRequestData?.detail[0].pullRequests.length>0" gap
                style="max-height: 100%; overflow: overlay">
        <d-card v-for="pullRequest in item.pullRequestData.detail[0].pullRequests" block elevation="4">
          <d-row gap class="px-3">
            <d-card-title class="font-weight-bold">#{{ pullRequest.id }}</d-card-title>
            <d-card-title>{{ pullRequest.name }}</d-card-title>
            <d-spacer/>
            <d-button root-tag="a" target="_blank" :href="pullRequest.url" outlined
                      color="primary">
              <template v-slot:prefix>
                <d-icon name="external-link-alt" :size="20"/>
              </template>
              Open
            </d-button>
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
          <d-row gap class="pa-3 pt-0">
            <d-tooltip v-for="user in pullRequest.reviewers" position="right" filled color="primary">
              <d-avatar rounded="circle" :size="40" :style="{
                backgroundImage: `url(${user.avatar})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                outline: `2px solid ${$vuelize.getColor(user.approved ? 'success' : 'error')}`,
                outlineOffset: '2px'
              }">
                <div/>
              </d-avatar>
              <template v-slot:tooltip>
                {{ user.name }}
              </template>
            </d-tooltip>
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
import {SlideYDownTransition} from "v3-transitions";

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})

function getApprovals(reviewers: any)/*TODO export namespace bs*/ {
  return reviewers.filter((reviewer: any /*TODO export namespace bs*/) => reviewer.approved).length
}
</script>

<style scoped lang="scss">

</style>
