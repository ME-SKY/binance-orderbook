<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { CURRENCY_PAIRS, LIMITS } from '@/consts';
import { useSettingsStore } from '@/store/settings';

const settingsStore = useSettingsStore();
const {pair, limit, pairHistory} = storeToRefs(settingsStore);
// const selectedCurrencyPair = ref(settingsStore.pair);
// const selectedLimit = ref(settingsStore.limit);

const changePair = (ev) => {
    console.log('change pair', ev);
    const newPairV
    settingsStore.switchPair(ev);
};

const pairTitles = computed(() => CURRENCY_PAIRS.map(p => p.title));

const pairOptionComputed = computed(() => pairTitles.find(p => p.value === pair.value));

const changeLimit = (ev) => {
    console.log('change limit', ev);
    // settingsStore.changeLimit(ev);
};
// @modelUpdate="event => changePair(event)"
//

const updateSettings = (key, value) => {
  settingsStore.$patch({ [key]: value });
};
</script>

<template>
  <div>
    <v-select label="Currency pair"
              :items="CURRENCY_PAIRS"
              :value="pairOptionComputed"
              @update:modelValue="event => changePair(event)"
              
             
             ></v-select>
    <v-select label="Limit"
              :items="LIMITS"
              @change="event => changeLimit(event)"
              ></v-select>

              <div>
                {{ pair }}, {{ limit }}, {{ pairHistory }}
              </div>
  </div>
</template>

<style scoped>
</style>
