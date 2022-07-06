<template>
  <d-dialog
    :modelValue="open"
    @update:modelValue="(e) => $emit('update:open', e)"
  >
    <d-card class="pa-2 pt-1">
      <d-card-title>
        {{ name }}
      </d-card-title>
      <d-card-subtitle> Jira Credentials </d-card-subtitle>
      <d-divider />
      <form @submit.prevent="onSubmit">
        <d-column gap>
          <d-textfield
            v-model="username"
            color="primary"
            filled
            label="Username"
            type="name"
          />
          <d-textfield
            v-model="password"
            color="primary"
            filled
            label="Password"
            type="password"
          />
          <d-button color="primary" glow :disabled="isDisabled" type="submit">
            Submit Credentials
          </d-button>
        </d-column>
      </form>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits(["submit"]);

const props = defineProps({
  open: Boolean,
  name: String,
});

const username = ref<string>();
const password = ref<string>();

function onSubmit() {
  emit("submit", { username: username.value, password: password.value });
}

const isDisabled = computed(() => {
  return !username.value || !password.value;
});
</script>

<style scoped lang="scss"></style>
