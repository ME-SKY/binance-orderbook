import { defineStore } from 'pinia';
import {ref, computed} from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref({});

  // Actions
  function updateSetting(key, value) {
    settings.value[key] = value;
  }

  // Getters
  const getSetting = (key) => settings.value[key];

  // Return the store interface
  return { settings, updateSetting, getSetting };
});
