<template>
  <d-row gap block align="stretch" elevation="2">
    <d-column gap block>
      <d-textfield full-width v-model="modelValue.name" color="primary" filled label="Name" type="name"/>
      <d-textfield full-width v-model="modelValue.url" color="primary" filled label="Url" type="url"/>
    </d-column>
    <d-icon-button height="initial" type="button" color="error" @click="remove">
      <d-icon name="times"/>
    </d-icon-button>
  </d-row>
</template>

<script setup lang="ts">
import {PropType, watch} from "vue";

const emit = defineEmits(['remove', 'update:modelValue'])
const props = defineProps({
  modelValue: Object as PropType<{ name: string, url: string }>,
})

function remove() {
  emit('remove')
}

watch(() => props.modelValue, (data) => emit("update:modelValue", data))
</script>

<style scoped lang="scss">

</style>
