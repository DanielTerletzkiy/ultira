<template>
  <d-dialog :modelValue="open" @update:modelValue="(e)=>$emit('update:open', e)">
    <d-card class="pa-2 pt-1" width="500px">
      <d-card-title>
        Ultira Settings
      </d-card-title>
      <d-divider/>
      <d-card-content root-tag="form" @submit.prevent="onSubmit"
                      style="min-height: 300px; max-height: 600px; overflow: overlay">
        <d-column gap>
          <d-card-subtitle class="pl-0 font-weight-bold">
            Look & Feel
          </d-card-subtitle>
          <d-checkbox color="primary" v-model="$vuelize.theme.dark">
            Dark mode
          </d-checkbox>
          <d-card-subtitle root-tag="label" for="color" class="color-picker" glow color="primary" v-ripple
                           :depressed="false">
            <input id="color" type="color" v-model="$vuelize.theme.themes[currentTheme].primary"/>
            Primary color
          </d-card-subtitle>
        </d-column>
        <d-divider/>
        <d-column gap>
          <d-card-subtitle class="pl-0 font-weight-bold">
            Jira Configurations
          </d-card-subtitle>
          <FadeTransition group>
            <d-column v-for="(config, i) in jiraConfigs" :key="i" gap>
              <JiraSettingsConfig v-model="jiraConfigs[i]" @remove="removeConfig(i)"/>
              <d-divider/>
            </d-column>
          </FadeTransition>
          <d-button color="primary" glow type="button" @click="addConfig">
            Add Config
          </d-button>
        </d-column>
      </d-card-content>
    </d-card>
  </d-dialog>
</template>

<script setup lang="ts">
import {computed, inject, onBeforeMount, watch} from "vue";
import {useStore} from "vuex";
import JiraSettingsConfig from "./JiraSettingsConfig.vue";
import {FadeTransition} from "v3-transitions"

const vuelize: Vuelize = inject('vuelize') as Vuelize;

const emit = defineEmits(['submit']);
const props = defineProps({
  open: Boolean,
});

const store = useStore()
const jiraConfigs = computed<Array<{ name: string, url: string }>>({
  get() {
    return store.getters.jiraConfigs
  },
  set(value) {
    console.log(value)
    store.dispatch('setJiraConfigs', value)
  }
})
watch(jiraConfigs, (value) => {
  store.dispatch('setJiraConfigs', value)
}, {deep: true})

function addConfig() {
  jiraConfigs.value.push({
    name: '',
    url: ''
  })
}

function removeConfig(index: number) {
  jiraConfigs.value.splice(index, 1);
}

function onSubmit() {
  emit('submit', null);
}

const currentTheme = computed(() => vuelize.theme.dark ? 'dark' : 'light')
watch(() => vuelize.theme.themes[currentTheme.value].primary, (color) => {
  localStorage.setItem(`${currentTheme.value}:primary`, color);
})

watch(() => vuelize.theme.dark, (dark) => {
  localStorage.setItem('theme:dark', JSON.stringify(dark));
})

onBeforeMount(() => {
  vuelize.theme.dark = JSON.parse(localStorage.getItem('theme:dark') || '{}');
  ['dark', 'light'].forEach((theme) => {
    const primary = localStorage.getItem(`${theme}:primary`)
    if (primary) {
      //@ts-ignore
      vuelize.theme.themes[theme].primary = primary;
    }
  })
})

</script>

<style scoped lang="scss">
.color-picker {
  user-select: auto !important;
  overflow: hidden;
  padding: 0;

  input[type="color"] {
    z-index: 1;
    -webkit-appearance: none;
    border: none;
    width: 30px;
    height: 30px;
    background: transparent;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
}
</style>
