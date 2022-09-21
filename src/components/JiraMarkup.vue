<template>
  <d-card-subtitle
    class="content"
    color="secondary"
    :tint="10"
    v-html="html"
  />
</template>

<script setup lang="ts">
//@ts-ignore
import jira2md from "jira2md";
import { computed } from "vue";

const props = defineProps({
  body: String,
});

const html = computed(()=>{
  try {
    return jira2md.jira_to_html(props.body);
  }catch (e) {
    return props.body
  }
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

  ::v-deep(ul),
  ::v-deep(ol) {
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
    overflow-wrap: anywhere;
    text-decoration: underline;
  }
}
</style>
