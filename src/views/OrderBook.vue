<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted, onUnmounted, watch, onBeforeUnmount } from 'vue';
import { useOrderBookStore } from '@store/orderbook';

const orderBookStore = useOrderBookStore();
console.log('orderBookStore', orderBookStore);

const { bids, asks } = storeToRefs(orderBookStore);
const unsubscribeHandler = ref(null);
// console.log('orderBookRef after storeToRefs', orderBook);

// watch(() => bids, () => {
// console.log('Order book updated:', bids);
// });


onMounted(() => {
    orderBookStore.subscribeToOrderBookUpdates().then(wsObjectFunctionToClose => {
        unsubscribeHandler.value = wsObjectFunctionToClose;
    });
    // console.log('inside onMounted', unsubscribeHandler.value);
});

onBeforeUnmount(() => {
    // console.log('inside onBeforeUnmount', unsubscribeHandler.value);
    if (unsubscribeHandler.value) {
        unsubscribeHandler.value();
    }
});

</script>

<template>
    <div class="order-book">

        <div class="order-book__table-header">
            <h5>Price</h5>
            <h5>Quantity</h5>
            <h5>Total</h5>
        </div>

        <section class="order-book__asks-section">

            <table>
                <tbody>
                    <tr v-for="ask in asks" :key="ask.price">
                        <td class="price">{{ ask.price }}</td>
                        <td class="quantity">{{ ask.quantity }}</td>
                        <td class="total">{{ ask.total }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="order-book__bids-section">

            <table>
                <tbody>
                    <tr v-for="bid in bids" :key="bid.price">
                        <td class="price">{{ bid.price }}</td>
                        <td class="quantity">{{ bid.quantity }}</td>
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
    max-height: 48%;
}

.order-book__asks-section {
    display: flex;
    /* align-items: end; */
}

.order-book__asks-section table,
.order-book__bids-section table {
    height: fit-content;
    /* border-collapse: collapse !important;
    border-spacing: 0; */
    width: 100%;
}

.order-book__asks-section table tr,
.order-book__bids-section table tr {
    /* border: 1px solid black; */
    /* border-spacing: 4px; */
    margin: 4px 0;
    border-collapse: collapse;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
}

/* td { */
    /* flex: 32%; */
/* } */

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
.quantity, .total {
    text-align: right;
}

.order-book__table-header {
    padding: 0 10px;
    flex: 0 1 4%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}

.order-book__table-header h5 {
    flex: 33%;
}

.order-book__table-header h5:last-child {
    text-align: right;
}

.order-book__asks-section .price {
    /* flex: 50% */
    color: red;
    /* Green background with opacity */
}

.order-book__bids-section .price{
    color: green;

}

.v-list-item {
    margin-bottom: 4px;
    /* Adjust spacing between list items */
    font-size: 0.8em;
    /* Decrease font size */
}
</style>
