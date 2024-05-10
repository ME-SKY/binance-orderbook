import { defineStore } from 'pinia';
import {ref, computed} from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // State
  // const settings = ref({});
  const limit = ref(10);
  const pair = ref('BTCUSDT');
  const pairHistory = ref(['BTCUSDT']);
  // const pairSwithingHistory = ref(false);



  // Actions
  // function updateSetting(key, value) {
  //   settings.value[key] = value;
  // }

  function switchPair(pair) {
    settings.value.pair = pair;
    updateHistory(pair);
  }

  function updateHistory(pair) {
    pairHistory.value.push(pair);
  }

  // Getters
  const getSetting = (key) => settings.value[key];
  // const pairHistory = computed(() => pairHistory.value ? );

  // Return the store interface
  return { limit, pair, pairHistory, switchPair};
});
