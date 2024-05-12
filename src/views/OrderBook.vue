<script setup>
import Select from '@/components/Select.vue';
import { LIMITS } from '@/consts';
import { useOrderBookStore } from '@store/orderbook';
import { useSettingsStore } from '@store/settings';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';

const orderBookStore = useOrderBookStore();
const settingsStore = useSettingsStore();

const { mobile } = useDisplay();

const { bids, asks } = storeToRefs(orderBookStore);
const { baseAsset, quoteAsset, limit } = storeToRefs(settingsStore);

const unsubscribeHandler = ref(null);

const changeLimit = (value) => {
    settingsStore.changeLimit(value);

    if (unsubscribeHandler.value) {
        unsubscribeHandler.value();
        orderBookStore.subscribeToOrderBookUpdates().then(wsObjectFunctionToClose => {
            unsubscribeHandler.value = wsObjectFunctionToClose;
        })
    }
}

onMounted(() => {
    orderBookStore.subscribeToOrderBookUpdates().then(wsObjectFunctionToClose => {
        unsubscribeHandler.value = wsObjectFunctionToClose;
    });

    const asksSection = document.querySelector('.order-book__asks-section');

    if (asksSection) {
        asksSection.scrollTop = asksSection.scrollHeight - asksSection.clientHeight;
    }
});

onBeforeUnmount(() => {
    if (unsubscribeHandler.value) {
        unsubscribeHandler.value();
    }
});


</script>

<template>
    <div class="order-book">

        <div class="order-book__table-header">
            <Select :options="LIMITS" :value="limit" @change="changeLimit" />

            <h5>Price({{ quoteAsset }})</h5>
            <h5 v-if="!mobile">Quantity({{ baseAsset }})</h5>
            <h5>Total</h5>
        </div>

        <section class="order-book__asks-section custom-scroll">

            <table>
                <tbody>
                    <tr v-for="ask in asks" :key="ask.price">
                        <td class="price">{{ ask.price }}</td>
                        <td v-if="!mobile" class="quantity">{{ ask.quantity }}</td>
                        <td class="total">{{ ask.total }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="order-book__bids-section custom-scroll">

            <table>
                <tbody>
                    <tr v-for="bid in bids" :key="bid.price">
                        <td class="price">{{ bid.price }}</td>
                        <td v-if="!mobile" class="quantity">{{ bid.quantity }}</td>
                        <td class="total">{{ bid.total }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<style scoped>
.order-book {
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-flow: column nowrap;
}

.order-book__asks-section,
.order-book__bids-section {
    height: auto;
    max-height: calc(48% - 5px);
    overflow-y: auto;
}

.order-book__asks-section {
    box-shadow: 0px 0px 2px 0px rgb(194, 100, 100);
    display: flex;
    margin-bottom: 10px;
}

.order-book__bids-section {
    box-shadow: 0px 0px 2px 0px rgb(109, 194, 100);
    display: flex;
}

.order-book__asks-section table,
.order-book__bids-section table {
    height: fit-content;
    width: 100%;
}

.order-book__asks-section table tr,
.order-book__bids-section table tr {
    margin: 4px 0;
    border-collapse: collapse;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    gap: 5px;
}

.price {
    flex: 20%;
    text-align: left;
}

.quantity {
    flex: 40%;
}

.total {
    flex: 40%;
}

.quantity,
.total {
    text-align: right;
}

.order-book__table-header {
    padding: 0 10px 0px 0px;
    flex: 0 1 4%;
    max-height: 4%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
}

.order-book__table-header h5 {
    flex: 30%;
}

.order-book__table-header h5:last-child {
    text-align: right;
}

.order-book__asks-section .price {
    color: red;
}

.order-book__bids-section .price {
    color: green;

}

.v-list-item {
    margin-bottom: 4px;
    font-size: 0.8em;
}

.custom-scroll {
    overflow: auto;
    scrollbar-color: #c1c1c1 transparent;
    scrollbar-width: thin;
    border-radius: 5px;
}

.order-book__asks-section.custom-scroll {
    scrollbar-color: #652525 transparent;
}

.order-book__bids-section.custom-scroll {
    scrollbar-color: #1e461b transparent;
}
</style>
