<template>
  <d-card class="jira-comments" elevation="1" block height="100%">
    <d-card-title class="font-size-medium">
      Comments
    </d-card-title>
    <d-column key="content" v-if="item?.commentsData?.comments" class="mx-2 py-0"
              style="max-height: calc(100% - 55px); overflow: overlay" height="100%"
              gap :wrap="false">
      <JiraCommentsViewItem v-for="comment in item.commentsData.comments" :comment="comment"/>
      <d-spacer/>
      <d-textfield full-width filled solo placeholder="Comment..." color="primary" class="sticky" elevation="2" style="min-height: 3rem">
        <template v-slot:suffix>
          <d-icon-button name="message" :size="30"/>
        </template>
      </d-textfield>
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import {inject, PropType} from "vue";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
import JiraCommentsViewItem from "./JiraCommentsViewItem.vue";

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})

</script>

<style scoped lang="scss">
.sticky{
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: auto;
}
</style>
