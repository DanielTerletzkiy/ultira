<template>
  <JiraViewWrapper hide-divider :canHide="canHide"
                   @long="() => currentDialogComponent = JiraBranchView">
    <template v-slot:icon>
      <d-icon
        name="layer-group"
        :size="30"
        icon-style="monochrome"
        color="primary"
      />
    </template>
    <template v-slot:title>
      Branches & Commits
      <d-spacer />
      <d-tab-list
        v-if="currentIssue?.hasCommits"
        v-model="currentViewSwitch"
        color="primary"
      >
        <d-list-item
          v-for="option in viewSwitchTabs"
          :key="option.type"
          height="40px"
          style="font-size: 1.2rem">
          <d-icon :name="option.icon" />
          {{ option.type }}
        </d-list-item>
      </d-tab-list>
      <JiraProjectBranchRefreshButton class="mr-2" />
    </template>
    <d-card
      block
      background-color="transparent"
      style="
        max-height: 100%;
        overflow: overlay;
        overflow-x: hidden;
      "
    >
      <d-column
        key="content"
        v-if="
          currentIssue.hasCommits && currentViewSwitch === ViewSwitch.Server
        "
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
                <d-card-subtitle
                >Repository
                  <JiraLinkIconButton
                    v-if="repository.url"
                    :url="repository.url"
                    color="inherit"
                  />
                </d-card-subtitle>
              </d-column>
              <d-column>
                <d-card-title
                  class="font-size-medium"
                  style="font-family: Consolas, sans-serif"
                >
                  {{ repository.commits.length.toString().padStart(2, "0") }}
                </d-card-title>
                <d-card-subtitle> Commits</d-card-subtitle>
              </d-column>
              <d-spacer />
              <d-tooltip>
                <JiraPRButton :repository="repository" />
                <template v-slot:tooltip> Create PR</template>
              </d-tooltip>
              <JiraProjectButton
                :repository="
                  repository.name.match(new RegExp('.*(/|^)(.*)')).pop()
                "
              />
            </d-row>
          </d-card>
          <d-column class="pa-2" gap>
            <d-accordion
              v-for="commit in repository.commits"
              :key="commit.id"
              header-color="primary"
            >
              <template v-slot:header>
                <d-label v-if="!commit.merge" class="ml-1">
                  {{ commit.fileCount }}
                </d-label>
                <d-icon v-if="commit.merge" name="arrows-merge" class="ml-3" />
                <JiraMarkup :body="commit.message" />
                <d-spacer />
                <JiraLinkIconButton :url="commit.url" />
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
                            undefined
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
                            <template v-slot:tooltip> Lines added</template>
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
                            <template v-slot:tooltip> Lines deleted</template>
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
                        <d-spacer />
                        <d-label :color="changeTypeColor(file.changeType)">
                          {{ file.changeType }}
                        </d-label>
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
      <d-column
        key="empty"
        v-else-if="
          currentIssue.commitsEmpty || currentViewSwitch === ViewSwitch.Local
        "
      >
        <JiraProjectList />
      </d-column>
      <d-row v-else block justify="center">
        <JiraLoader />
      </d-row>
    </d-card>
  </JiraViewWrapper>
</template>

<script setup lang="ts">
import JiraUserItem from "./JiraUserItem.vue";
import JiraViewWrapper from "./JiraViewWrapper.vue";
import JiraMarkup from "./JiraMarkup.vue";
import JiraProjectButton from "./JiraProjectButton.vue";
import JiraProjectList from "./JiraProjectList.vue";
import { currentDialogComponent, currentIssue } from "../store/jira.store";
import JiraLoader from "./JiraLoader.vue";
import JiraProjectBranchRefreshButton from "./JiraProjectBranchRefreshButton.vue";
import { ref } from "vue";
import JiraLinkIconButton from "./JiraLinkIconButton.vue";
import JiraPRButton from "./JiraPRButton.vue";
import { ChangeType } from "../../types/ChangeType";
import { ViewSwitch } from "../../types/ViewSwitch";
import JiraBranchView from "./JiraBranchView.vue";
import { viewSwitchTabs } from "../constants/ViewSwitchTabs";

defineProps({
  canHide: { type: Boolean }
});

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

const currentViewSwitch = ref<ViewSwitch>(ViewSwitch.Server);
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
