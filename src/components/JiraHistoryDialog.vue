<template>
  <d-dialog
    :modelValue="open"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <d-card class="pa-2 pt-1 pb-0" width="700px" height="600px">
      <d-column style="height: 90px">
        <d-card-title> History</d-card-title>
        <d-card-subtitle> Text generator</d-card-subtitle>
        <d-divider />
      </d-column>
      <d-column>
        <d-tab-list v-model="timeRange" color="primary" filled elevation="n1" class="pa-2">
          <d-list-item v-for="range in times" :key="range.name" center class="font-weight-bold"
                       style="text-transform: uppercase">
            {{ range.name }}
          </d-list-item>
        </d-tab-list>
      </d-column>
      <d-column
        gap
        class="pa-0 my-2"
        :wrap="false"
        style="max-height: calc(100% - 100px - 70px); overflow: hidden auto"
      >
        <d-card-subtitle v-for="(line, l) in fullText" :key="l" elevation="2" class="font-size-medium">
          {{ line }}
        </d-card-subtitle>
        <d-column v-if="!fullText.length" style="user-select: none">
          <d-card-title color="primary" class="mx-3">
            <d-icon name="file-question-alt" :size="30" />
            Empty
          </d-card-title>
        </d-column>
      </d-column>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import JiraController from "../controller/JiraController";
import { times } from "../constants/Times";

const props = defineProps({
  open: Boolean
});
const timeRange = ref<string>(times[0].name);

const fullText = ref<String[]>([]);

function filter() {
  if (!props.open || !timeRange.value) {
    fullText.value = [];
    return;
  }
  const localIssueList = JiraController.issues.value;

  const selectedRange = times.find((time) => time.name === timeRange.value);

  if (!selectedRange) return;

  const dateStart = new Date();
  dateStart.setHours(dateStart.getHours() - selectedRange.hours);

  let items = localIssueList.filter((issue) => {
    const issueTime = new Date(issue.task.fields.updated).getTime();
    return issueTime >= dateStart.getTime();
  });
  const logs = items.map((item) => {
    return {
      item,
      history: item.task.changelog.histories?.filter(
        (history) =>
          new Date(history.created).getTime() >= dateStart.getTime() &&
          history.author.key === JiraController.myself.value?.key)
    };
  }).filter((item) => item && item.history && item.history.length > 0);

  const text = [];
  for (const log of logs) {
    if (!log.history) return;
    for (const history of log.history.reverse()) {
      for (const item of history.items.reverse()) {
        const sentence = [];
        sentence.push(`[${log.item.task.key}]: ${log.item.task.fields.summary} >`);
        switch (item?.field) {
          case "status": {
            if (item?.from === "1") {
              sentence.push(`Started working`);
            }
            if (item?.toString === "In Code Review" || item?.toString === "Resolved" || item?.toString === "Done") {
              sentence.push(`Finished working`);
            }
            break;
          }
          case "assignee": {
            const assignee = JiraController.myself.value?.key === item?.to ? "me" : item?.toString;
            sentence.push(`assigned to ${assignee}`);
            break;
          }
        }
        if (sentence.length > 1) {
          text.push(sentence.join(" "));
        }
      }
    }
  }
  fullText.value = text;
}

watch([timeRange, () => props.open], filter);
</script>

<style scoped lang="scss"></style>
