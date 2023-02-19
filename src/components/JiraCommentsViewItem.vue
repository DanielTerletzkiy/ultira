<template>
  <d-card width="100%" elevation="4">
    <JiraMarkup :body="comment.body" />
    <d-divider class="mx-3" elevation="6" />
    <d-card-subtitle>
      <JiraUserItem :user="comment.author">
        {{ new Date(comment.created).toLocaleString(undefined) }}
      </JiraUserItem>
    </d-card-subtitle>
  </d-card>
</template>

<script setup lang="ts">
import { PropType } from "vue";
//@ts-ignore
import JiraUserItem from "./JiraUserItem.vue";
import JiraMarkup from "./JiraMarkup.vue";
import { CommentItem } from "../../types/JiraIssue";

defineProps({
  comment: Object as PropType<CommentItem>,
});
</script>

<style scoped lang="scss"></style>
