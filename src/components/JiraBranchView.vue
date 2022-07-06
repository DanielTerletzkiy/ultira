<template>
  <JiraViewWrapper hide-divider>
    <template v-slot:icon>
      <d-icon
        name="layer-group"
        :size="30"
        icon-style="monochrome"
        color="primary"
      />
    </template>
    <template v-slot:title> Branches & Commits </template>
    <template v-slot:tooltip> View and Open Branches & Commits </template>
    <SlideXLeftTransition
      group
      style="
        width: 100%;
        max-height: calc(500px - 50px - 8px);
        overflow: overlay;
        overflow-x: hidden;
      "
      :class="$vuelize.theme.dark ? 'dark' : 'light'"
    >
      <d-column
        key="content"
        v-if="currentIssue.hasCommits"
        class="mx-2 pt-0"
        gap
        :wrap="false"
      >
        <d-card
          v-for="repository in currentIssue.commitData.detail[0]?.repositories"
          :key="repository.name"
          elevation="2"
          block
          background-color="transparent"
        >
          <d-card class="sticky" block elevation="4">
            <d-row class="pr-3">
              <d-column>
                <d-card-title class="font-size-medium">
                  {{ repository.name }}
                </d-card-title>
                <d-card-subtitle> Repository </d-card-subtitle>
              </d-column>
              <d-column>
                <d-card-title
                  class="font-size-medium"
                  style="font-family: Consolas, sans-serif"
                >
                  {{ repository.commits.length.toString().padStart(2, "0") }}
                </d-card-title>
                <d-card-subtitle> Commits </d-card-subtitle>
              </d-column>
              <d-spacer />
              <JiraProjectButton :repository="repository.name" />
            </d-row>
          </d-card>
          <d-column class="pa-2" gap>
            <d-accordion
              v-for="commit in repository.commits"
              :key="commit.id"
              header-color="primary"
            >
              <template v-slot:header>
                <JiraMarkup :body="commit.message" />
                <d-spacer />
                <d-icon-button
                  root-tag="a"
                  target="_blank"
                  :href="commit.url"
                  color="primary"
                  style="margin: -6px 0"
                  :size="30"
                >
                  <d-icon name="external-link-alt" :size="20" />
                </d-icon-button>
              </template>
              <template v-slot:default>
                <d-row gap :wrap="false" block>
                  <d-divider vertical block color="primary" size="2px" />
                  <d-column block>
                    <d-row gap :wrap="false">
                      <d-card-subtitle class="pr-0">
                        <d-icon name="plus" :size="20" color="primary" />
                        {{
                          new Date(commit.authorTimestamp).toLocaleString(
                            "DE-de"
                          )
                        }}
                      </d-card-subtitle>
                      <d-icon name="arrow-right" />
                      <JiraUserItem
                        :name="commit.author.name"
                        :avatar="commit.author.avatar"
                      >
                        Committer
                      </JiraUserItem>
                    </d-row>
                    <d-divider elevation="10" />
                    <d-card
                      v-for="file in commit.files"
                      :key="file.path"
                      block
                      background-color="transparent"
                    >
                      <d-row block gap justify="start">
                        <d-label
                          rounded="pill"
                          :color="changeTypeColor(file.changeType)"
                        >
                          {{ file.changeType }}
                        </d-label>
                        <d-column
                          v-if="file.linesAdded || file.linesRemoved"
                          class="pa-0"
                          style="
                            font-family: Consolas, sans-serif;
                            min-width: 50px;
                          "
                        >
                          <d-tooltip color="success" filled position="right">
                            <d-card-subtitle
                              class="pa-0"
                              style="font-size: 0.8rem"
                              color="success"
                              glow
                            >
                              <d-icon name="plus" :size="14" />
                              {{ file.linesAdded }}
                            </d-card-subtitle>
                            <template v-slot:tooltip> Lines added </template>
                          </d-tooltip>
                          <d-tooltip color="error" filled position="right">
                            <d-card-subtitle
                              class="pa-0"
                              style="font-size: 0.8rem"
                              color="error"
                              glow
                            >
                              <d-icon name="minus" :size="14" />
                              {{ file.linesRemoved }}
                            </d-card-subtitle>
                            <template v-slot:tooltip> Lines deleted </template>
                          </d-tooltip>
                        </d-column>
                        <d-card-subtitle
                          glow
                          v-ripple
                          root-tag="a"
                          target="_blank"
                          :href="file.url"
                        >
                          {{ file.path }}
                        </d-card-subtitle>
                      </d-row>
                      <d-divider elevation="6" />
                    </d-card>
                  </d-column>
                </d-row>
              </template>
            </d-accordion>
          </d-column>
        </d-card>
      </d-column>
      <d-column key="empty" v-else-if="currentIssue.commitsEmpty">
        <d-column style="user-select: none">
          <d-card-title color="primary" class="mx-3">
            <d-icon name="file-question-alt" :size="30" />
            Empty
          </d-card-title>
          <d-card-subtitle class="ml-4">
            Select Project below to
            <d-card-subtitle
              root-tag="pre"
              elevation="3"
              style="user-select: text"
            >
              <d-icon name="brackets-curly" :size="18" />
              git stash && git checkout -b {{ currentIssueKey }}
            </d-card-subtitle>
            <d-spacer />
            <JiraProjectBranchRefreshButton />
          </d-card-subtitle>
        </d-column>
        <JiraProjectList />
      </d-column>
      <JiraLoader key="loader" v-else />
    </SlideXLeftTransition>
  </JiraViewWrapper>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { SlideXLeftTransition } from "v3-transitions";
import { JiraCommits } from "../../types/Jira";
import JiraUserItem from "./JiraUserItem.vue";
import JiraViewWrapper from "./JiraViewWrapper.vue";
import JiraMarkup from "./JiraMarkup.vue";
import JiraProjectButton from "./JiraProjectButton.vue";
import JiraProjectList from "./JiraProjectList.vue";
import { currentIssueKey, currentIssue } from "../store/jira.store";
import ChangeType = JiraCommits.ChangeType;
import JiraLoader from "./JiraLoader.vue";
import JiraProjectBranchRefreshButton from "./JiraProjectBranchRefreshButton.vue";

function changeTypeColor(type: ChangeType) {
  switch (type) {
    case "MODIFIED": {
      return "primary";
    }
    case "ADDED": {
      return "success";
    }
    case "DELETED": {
      return "error";
    }
    case "MOVED":
    case "COPIED": {
      return "warning";
    }
    case "UNKNOWN": {
      return "secondary";
    }
  }
}
</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
}

::v-deep(.d-accordion) {
  .d-title {
    padding: 0 8px 0 0;
  }

  .d-accordion__content {
    padding-top: 0;
  }
}
</style>
