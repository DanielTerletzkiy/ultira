<template>
  <d-card-subtitle class="content" v-html="jira2md.jira_to_html(body)"/>
</template>

<script setup lang="ts">
//@ts-ignore
import jira2md from "jira2md";

const props = defineProps({
  body: String
})
</script>

<style scoped lang="scss">
.content {
  flex-direction: column;
  align-items: baseline;
  gap: 0;

  display: block;
  text-align-last: left;
  max-height: inherit;

  ::v-deep(ul), ::v-deep(ol) {
    margin-left: 24px;
  }

  ::v-deep(pre) {
    backdrop-filter: brightness(95%);
    padding: 8px;
    margin: 8px;
    border-radius: inherit;
    white-space: pre-wrap;
  }

  ::v-deep(a) {
    text-decoration: underline;
  }
}
</style>
