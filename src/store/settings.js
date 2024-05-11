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

  function switchPair(newPair) {
    pair.value = newPair;
    updateHistory(newPair);
  }

  function changeLimit(limit) {
    limit.value = limit;
  }

  function updateHistory(pair) {
    pairHistory.value.push(pair);
  }

  // Getters
  const getSetting = (key) => settings.value[key];

  // const check
  // const pairHistory = computed(() => pairHistory.value ? );

  // Return the store interface
  return { limit, pair, pairHistory, switchPair, changeLimit };
});
