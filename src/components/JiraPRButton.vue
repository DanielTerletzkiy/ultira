<template>
  <d-icon-button
    name="data-sharing"
    color="primary"
    root-tag="a"
    target="_blank"
    :href="pullRequestUrl"
    :disabled="!repository.url"
  />
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { ApplicationType } from "../../types/Jira";
import JiraController from "../controller/JiraController";
import { currentIssue } from "../store/jira.store";
import { Repository } from "../../types/JiraCommits";

const props = defineProps({
  repository: { type: Object as PropType<Repository>, required: true }
});

const pullRequestUrl = computed(() => {
  console.log(props.repository);
  switch (JiraController.controller.applicationType) {
    case ApplicationType.Bitbucket:
    case ApplicationType.Stash:
      return `${props.repository?.url.replace("browse", "pull-requests?create")}&sourceBranch=${currentIssue.value?.task.key}`;
    case ApplicationType.GitHub:
      return `${props.repository?.url}/compare/...${currentIssue.value?.task.key}`;
  }
});
</script>

<style scoped lang="scss"></style>
