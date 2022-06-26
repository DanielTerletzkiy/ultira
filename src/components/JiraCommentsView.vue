<template>
  <JiraViewWrapper class="jira-comments">
    <template v-slot:icon>
      <d-icon name="comment-message" :size="30" icon-style="monochrome" color="primary"/>
    </template>
    <template v-slot:title>
      Comments
    </template>
    <d-column key="content" v-if="currentIssue?.commentsData && currentIssue?.commentsData?.comments.length>0" class="px-2"
              style="max-height: calc(100% - 3rem); overflow: auto" height="100%" gap :wrap="false">
      <JiraCommentsViewItem v-for="comment in currentIssue.commentsData.comments.slice().reverse()" :comment="comment"/>
    </d-column>
    <d-column v-else-if="currentIssue?.commentsData?.comments?.length === 0" style="user-select: none">
      <d-card-title color="primary" class="mx-3 font-size-medium">
        <d-icon name="file-question-alt" :size="30"/>
        No Comments
      </d-card-title>
    </d-column>
    <d-row v-else block justify="center">
      <JiraLoader :size="200"/>
    </d-row>
    <d-spacer/>
    <d-textfield v-model="commentBody" :disabled="loading" full-width filled solo placeholder="Comment..."
                 color="primary" class="sticky"
                 elevation="2" style="min-height: 3rem">
      <template v-slot:suffix>
        <d-icon-button name="message" :size="30" :disabled="loading||!commentBody" color="primary"
                       @click="submitComment"/>
      </template>
    </d-textfield>
  </JiraViewWrapper>
</template>

<script setup lang="ts">
import {inject, ref} from "vue";
import JiraCommentsViewItem from "./JiraCommentsViewItem.vue";
import JiraViewWrapper from "./JiraViewWrapper.vue";
import JiraLoader from "./JiraLoader.vue";
import {currentIssue} from "../store/jira.store";

const vuelize: Vuelize = inject('vuelize') as Vuelize;

const loading = ref(false);
const commentBody = ref("");

async function submitComment() {
  if (!loading.value && currentIssue.value && commentBody.value) {
    loading.value = true;
    await currentIssue.value.addComment(commentBody.value)
    commentBody.value = "";
    loading.value = false;
  }
}

</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: auto;
}
</style>
