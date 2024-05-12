import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LIMITS, CURRENCY_PAIRS, BASE_QUOTE } from '@/consts';

export const useSettingsStore = defineStore('settings', () => {

  const limit = ref(LIMITS[0]);
  const pair = ref(CURRENCY_PAIRS[0].value);
  const pairHistory = ref(['BTCUSDT']);

  function switchPair(newPair) {
    pair.value = newPair;
    updateHistory(newPair);
  }

  function changeLimit(newLimit) {
    limit.value = newLimit;
  }

  function updateHistory(pair) {
    pairHistory.value.push(pair);
  }

  const baseAsset = computed(() => BASE_QUOTE[pair.value].base);
  const quoteAsset = computed(() => BASE_QUOTE[pair.value].quote);

  return { limit, pair, pairHistory, switchPair, changeLimit, baseAsset, quoteAsset };
});
