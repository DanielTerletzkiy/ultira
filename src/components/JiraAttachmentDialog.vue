<template>
  <d-dialog :model-value="modelValue" @update:modelValue="close">
    <d-card min-width="700px">
      <d-column class="pa-2 pt-1" block>
        <d-card-title>Attachments</d-card-title>
        <d-divider />
      </d-column>
      <Carousel :wrapAround="true">
        <Slide
          v-for="attachment in currentIssue.task.fields.attachment"
          :key="attachment.id"
          class="pa-6"
        >
          <JiraImage :url="attachment.content" :key="attachment.id">
            <template v-slot:default="{ base64 }">
              <d-column block gap>
                <d-image
                  v-if="base64"
                  :src="`${base64}`"
                  :style="{ height: '50vh', width: '100%' }"
                />
                <d-elevation-loader
                  v-else
                  key="loader"
                  :default-size="16"
                  :amount="16"
                  :columns="4"
                />
                <d-divider/>
                <d-card-subtitle class="font-weight-bold font-size-medium py-0">
                  {{ attachment.filename }}
                </d-card-subtitle>
              </d-column>
            </template>
          </JiraImage>
        </Slide>
        <template #addons>
          <Pagination v-if="currentIssue.task.fields.attachment.length > 1" />
          <Navigation v-if="currentIssue.task.fields.attachment.length > 1" />
        </template>
      </Carousel>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import JiraImage from "./JiraImage.vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { currentIssue } from "../store/jira.store";
import { inject, onMounted } from "vue";

// eslint-disable-next-line no-undef
const vuelize: Vuelize = inject("vuelize") as Vuelize;

const emit = defineEmits(["update:modelValue"]);

defineProps({
  modelValue: Boolean,
});

function close() {
  emit("update:modelValue", false);
}

onMounted(() => {
  document.documentElement.style.setProperty(
    "--vc-clr-primary",
    vuelize.theme.themes[vuelize.theme.dark ? "dark" : "light"].primary
  );
  document.documentElement.style.setProperty("--vc-pgn-height", "10px");
});
</script>

<style lang="scss">
.carousel__prev {
  top: 50%;
  left: 0;
  transform: translate(20%, -50%);
}

.carousel__next {
  top: 50%;
  right: 0;
  transform: translate(-20%, -50%);
}
</style>
