<template>
  <d-card width="100%" elevation="2">

    <d-card-subtitle class="description"
                     v-html="jira2md.jira_to_html(comment.body)"/>
    <d-divider class="mx-3"/>
    <d-card-subtitle>
      <JiraUserItem :user="comment.author">
        {{new Date(comment.created).toLocaleString('de-DE')}}
      </JiraUserItem>
    </d-card-subtitle>
  </d-card>
</template>

<script setup lang="ts">
import {PropType} from "vue";
//@ts-ignore
import jira2md from "jira2md";
import JiraUserItem from "./JiraUserItem.vue";
/* TODO why? when everything else works nearly the same?
import {JiraComments} from "../../types/Jira";
import Comment = JiraComments.Comment;
*/

const props = defineProps({
  comment: Object as PropType<any>,
})
</script>

<style scoped lang="scss">

</style>
