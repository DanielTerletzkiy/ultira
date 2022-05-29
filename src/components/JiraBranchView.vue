<template>
  <d-card class="jira-branch" elevation="1" block height="100%">
    <d-card-title class="font-size-medium">
      Branches
    </d-card-title>
    <d-column gap class="mx-2">
      <d-card v-for="repository in item.commitData.detail[0].repositories" outlined block
              background-color="transparent">
        <d-row>
          <d-column>
            <d-card-title class="font-size-medium">
              {{ repository.name }}
            </d-card-title>
            <d-card-subtitle>
              Repository
            </d-card-subtitle>
          </d-column>
          <d-column>
            <d-card-title class="font-size-medium">
              {{ repository.commits.length }}
            </d-card-title>
            <d-card-subtitle>
              Commit count
            </d-card-subtitle>
          </d-column>
        </d-row>
        <d-divider/>
        <d-column class="pa-2" gap>
          <d-accordion v-for="commit in repository.commits" header-color="primary">
            <template v-slot:header>
              <d-icon color="currentColor" name="file-check-alt"/>
              <d-card-subtitle class="font-size-small"
                               v-html="jira2md.jira_to_html(commit.message)"/>
            </template>
            <template v-slot:default>
              <d-card v-for="file in commit.files" block background-color="transparent">
                <d-row block gap justify="start">
                  <d-card-subtitle>
                    {{ file.changeType }}
                  </d-card-subtitle>
                  <d-column class="pa-0">
                    <d-card-subtitle class="pa-0" style="font-size: 0.8rem" color="success">
                      <d-icon name="plus" :size="14"/>{{ file.linesAdded }}
                    </d-card-subtitle>
                    <d-card-subtitle class="pa-0" style="font-size: 0.8rem" color="error">
                      <d-icon name="minus" :size="14"/>{{ file.linesRemoved }}
                    </d-card-subtitle>
                  </d-column>
                  <d-card-subtitle glow v-ripple root-tag="a" target="_blank" :href="file.url">
                    {{ file.path }}
                  </d-card-subtitle>
                </d-row>
                <d-divider/>
              </d-card>
            </template>
          </d-accordion>
        </d-column>
      </d-card>
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import {inject, PropType} from "vue";
import JiraController from "../controller/JiraController";
import JiraTask from "../controller/JiraTask";
//@ts-ignore
import jira2md from "jira2md";

const vuelize: Vuelize = inject('vuelize') as Vuelize;
const jiraController = inject('JiraController') as { value: JiraController };

const props = defineProps({
  item: Object as PropType<JiraTask>
})
</script>

<style scoped lang="scss">

</style>
