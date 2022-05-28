<template>
  <d-card rounded="pill" glow outlined background-color="transparent" v-ripple width="100%">
    <d-tooltip position="right" color="primary" filled>
      <d-avatar v-if="user" rounded="circle" :size="36" :style="{
            backgroundImage: `url(${user.avatarUrls['48x48']})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }">
        <div/>
      </d-avatar>
      <d-avatar v-else rounded="circle" :size="36" color="primary" :tint="0">
        <d-icon name="image-question" color="primary" :tint="-100"/>
      </d-avatar>
      <template v-slot:tooltip>
        {{ type }}
      </template>
    </d-tooltip>
    <d-card-subtitle>
      {{ user?.displayName || 'Undefined' }}
    </d-card-subtitle>
  </d-card>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {JiraIssue} from "../../types/Jira";

const props = defineProps({
  user: Object as PropType<JiraIssue.User>,
  type: String
})
</script>

<style scoped lang="scss">

</style>
