<script setup>
import { CURRENCY_PAIRS, LIMITS, BASE_QUOTE } from '@/consts';
import { useSettingsStore } from '@/store/settings';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import BinarySearchTree from '@/utils';

const settingsStore = useSettingsStore();
const { pair, limit, pairHistory } = storeToRefs(settingsStore);

onMounted(() => {
    console.log(new BinarySearchTree(10, 'left'));
})
const changePair = (ev) => {
    settingsStore.switchPair(ev);
};

const changeLimit = (ev) => {
    settingsStore.changeLimit(ev);
};

const reversedHistory = computed(() => {
    return pairHistory.value.reverse();
});

</script>

<template>
    <div>
        <v-select label="Currency pair" :items="CURRENCY_PAIRS" :model-value="pair"
            @update:modelValue="event => changePair(event)"></v-select>
        <v-select label="Limit" :items="LIMITS" :model-value="limit"
            @update:modelValue="event => changeLimit(event)"></v-select>

        <h4>History</h4>
        <v-list>
            <v-list-item v-for="(item, index) in reversedHistory" :key="index">
                {{pairHistory.length - index}}. {{ BASE_QUOTE[item].base }}/{{ BASE_QUOTE[item].quote }}
            </v-list-item>
        </v-list>
    </div>
</template>
