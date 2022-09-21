<template>
  <d-card class="jira-info" elevation="1" block>
    <d-column gap block :wrap="false">
      <d-row class="px-1" gap :wrap="false">
        <d-tooltip position="right" filled color="primary">
          <JiraImage
            :url="currentIssue.task.fields.project.avatarUrls['48x48']"
            :key="currentIssue.task.fields.project.key"
          >
            <template v-slot:default="{ base64 }">
              <d-card width="64px" height="64px" elevation-light>
                <d-avatar
                  v-if="base64"
                  key="image"
                  color="transparent"
                  size="64"
                  :style="{
                      backgroundImage: `url(${base64})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }"
                >
                  <div />
                </d-avatar>
                <d-elevation-loader
                  v-else
                  key="loader"
                  :default-size="16"
                  :amount="16"
                  :columns="4"
                />
              </d-card>
            </template>
          </JiraImage>
          <template v-slot:tooltip>
            <d-column>
              <d-card-subtitle class="pa-0" color="inherit">
                <d-icon name="transaction" :size="20" />
                {{ currentIssue.task.fields.project.name }}
              </d-card-subtitle>
              <d-card-subtitle class="pa-0" color="inherit">
                <d-icon name="key-skeleton" :size="20" />
                {{ currentIssue.task.fields.project.key }}
              </d-card-subtitle>
            </d-column>
          </template>
        </d-tooltip>
        <d-column block>
          <d-card-title class="pt-0 font-size-medium">
            {{ currentIssue.task.fields.summary }}
          </d-card-title>
          <d-card-subtitle class="pt-3 pb-0">
            <d-tooltip position="bottom">
              <d-icon-button
                rounded="md"
                :size="24"
                color="inherit"
                @click="copy(currentIssue.task.key)"
              >
                <d-icon name="key-skeleton" :size="20" />
              </d-icon-button>
              <template v-slot:tooltip> Copy Key</template>
            </d-tooltip>
            <d-tooltip position="bottom">
              <d-icon-button
                rounded="md"
                :size="24"
                color="inherit"
                @click="copy(`[${currentIssue.task.key}](${issueLink})`)"
              >
                <d-icon name="link-alt" :size="20" />
              </d-icon-button>
              <template v-slot:tooltip> Copy Issue Link</template>
            </d-tooltip>
            <d-button
              width="max-content"
              root-tag="a"
              target="_blank"
              :href="issueLink"
            >
              {{ currentIssue.task.key }}
            </d-button>
            <d-spacer />
            <JiraTransitionButtons :issue="currentIssue"/>
          </d-card-subtitle>
        </d-column>
      </d-row>
      <d-row class="info-row" gap block :wrap="false" align="start">
        <d-column class="description-column" :wrap="false" block height="100%">
          <d-column
            v-if="currentIssue.task.fields.description"
            :wrap="false"
            block
          >
            <d-row>
              <d-card-subtitle class="pa-0 font-weight-bold">
                Description
              </d-card-subtitle>
              <d-divider class="mx-3" block elevation="6" />
            </d-row>
            <JiraMarkup :body="currentIssue.task.fields.description" />
          </d-column>
          <d-spacer/>
          <d-button :disabled="!currentIssue.task.fields.attachment || currentIssue.task.fields.attachment?.length === 0"
                    color="primary" block
                    @click="toggleAttachmentDialog">
            <template v-slot:prefix>
              <d-icon name="file" :size="20" />
            </template>
            Open Attachments
          </d-button>
          <JiraAttachmentDialog v-model="attachmentDialog"/>
        </d-column>
        <JiraInfoViewSidebar />
      </d-row>
    </d-column>
  </d-card>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { State } from "vuelize/src/types/Vuelize";
import JiraController from "../controller/JiraController";
import JiraInfoViewSidebar from "./JiraInfoViewSidebar.vue";
import JiraMarkup from "./JiraMarkup.vue";
import JiraImage from "./JiraImage.vue";
import JiraTransitionButtons from "./JiraTransitionButtons.vue";
import { currentIssue } from "../store/jira.store";
import JiraAttachmentDialog from "./JiraAttachmentDialog.vue";

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;

const attachmentDialog = ref(false);

const issueLink = computed(
  () =>
    `${JiraController.controller.url}/browse/${currentIssue.value?.task.key}`
);

function copy(text: string) {
  navigator.clipboard.writeText(text).then(
    function() {
      vuelize.notify("Copy", `Copied "${text}"`, State.Success);
    },
    function(err) {
      vuelize.notify(
        "Copy",
        `Failed to copy "${text}", ERR: ${err}`,
        State.Error
      );
    }
  );
}

function toggleAttachmentDialog() {
  attachmentDialog.value = !attachmentDialog.value;
}
</script>

<style lang="scss">
.jira-info {
  display: flex;
  max-height: inherit;
  overflow: hidden;

  .info-row {
    max-height: calc(100% - 78px - 8px);

    .description-column {
      max-height: 100%;
      overflow: auto;
    }
  }
}
</style>
