<script setup>
import { ref, computed, watch, toRefs } from 'vue';

const emit = defineEmits(['change']);
const props = defineProps({
    options: {
        type: Array,
        default: []
    },
    value: [String, Number]
});

const { options, value } = toRefs(props);
const dropdownVisible = ref(false);
const selectedValue = ref(value.value);

const selectedOption = computed(() => {
    return options.value.find(option => {
        return option === selectedValue.value || option === selectedValue.value;
    });
});

const selectedOptionTitle = computed(() => {
    return selectedOption.value ? selectedOption.value.title || selectedOption.value : '';
});

const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
}

const selectOption = (option) => {
    selectedValue.value = option.value || option;
    dropdownVisible.value = false;
    emit('change', selectedValue.value);
}

watch(value, (newValue) => {
    if (newValue !== selectedValue.value) {
        selectedValue.value = newValue;
    }
});
</script>

<template>
    <div class="custom-select">
        <div class="custom-select__input" @click="toggleDropdown">{{ selectedOptionTitle }}</div>
        <div v-if="dropdownVisible" class="custom-select__dropdown">
            <div v-for="option in options" :key="option.value" class="custom-select__option"
                @click="selectOption(option)">
                {{ option.title || option }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-select {
    max-height: 100%;
    min-width: 46px;
    position: relative;
    display: block;
    width: auto;
}

.custom-select__input {
    cursor: pointer;
    padding: 0 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.custom-select__dropdown {
    position: absolute;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: rgb(56, 52, 52);
    z-index: 1000;
}

.custom-select__option {
    padding: 2px 4px;
    cursor: pointer;

    &:hover {
        background-color: #706f6f;
    }
}
</style>
