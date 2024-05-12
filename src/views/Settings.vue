<script setup>
import { CURRENCY_PAIRS, LIMITS } from '@/consts';
import { useSettingsStore } from '@/store/settings';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();
const { pair, limit, pairHistory } = storeToRefs(settingsStore);

const changePair = (ev) => {
    settingsStore.switchPair(ev);
};

const changeLimit = (ev) => {
    settingsStore.changeLimit(ev);
};

</script>

<template>
    <div>
        <v-select label="Currency pair" :items="CURRENCY_PAIRS" :model-value="pair"
            @update:modelValue="event => changePair(event)"></v-select>
        <v-select label="Limit" :items="LIMITS" :model-value="limit"
            @update:modelValue="event => changeLimit(event)"></v-select>

        <div>
            {{ pair }}, {{ limit }}, {{ pairHistory }}
        </div>
    </div>
</template>
