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
/* TODO why? when everything else works nearly the same?
import {JiraComments} from "../../types/Jira";
import Comment = JiraComments.Comment;
*/

const props = defineProps({
  comment: Object as PropType<any>,
});
</script>

<style scoped lang="scss"></style>
