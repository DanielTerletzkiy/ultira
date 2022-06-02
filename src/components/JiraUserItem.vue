<template>
  <d-card rounded="pill" glow background-color="transparent" v-ripple width="auto">
    <d-tooltip position="right" color="primary" filled>
      <d-avatar v-if="avatar" rounded="circle" :size="24" :style="{
            backgroundImage: `url(${avatar})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }">
        <div/>
      </d-avatar>
      <d-avatar v-else rounded="circle" :size="36" color="primary" :tint="0">
        <d-icon name="image-question" color="primary" :tint="-100"/>
      </d-avatar>
      <template v-slot:tooltip>
        <slot/>
      </template>
    </d-tooltip>
    <d-card-subtitle class="py-0">
      {{ name }}
    </d-card-subtitle>
  </d-card>
</template>

<script setup lang="ts">
import {computed, PropType} from "vue";
import {JiraIssue} from "../../types/Jira";

const props = defineProps({
  user: Object as PropType<JiraIssue.User>,
  avatar: String,
  name: String,
})

const avatar = computed(() => props.avatar ?? props.user?.avatarUrls['24x24'])
const name = computed(() => props.name ?? props.user?.displayName ?? 'Undefined')
</script>

<style scoped lang="scss">

</style>
