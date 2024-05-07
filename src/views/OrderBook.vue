<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted, watch } from 'vue';
import { useOrderBookStore } from '@store/orderbook';
// import { VList, VListItem, VListItemTitle } from 'vuetify/lib';

const orderBookStore = useOrderBookStore();
console.log('orderBookStore', orderBookStore);

const { orderBook } = storeToRefs(orderBookStore);
console.log('orderBookRef after storeToRefs', orderBook);

watch(() => orderBook, () => {
    console.log('Order book updated:', orderBook);
});



// const fetchOrderBookData = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         bids: [],
//         asks: []
//       });
//     }, 1000);
//   });
// };

// const orderBookData = ref({
//   bids: [],
//   asks: []
// });

// const initializeOrderBookData = async () => {
//   try {
//     const data = await fetchOrderBookData();
//     orderBookData.value = data;
//   } catch (error) {
//     console.error('Failed to fetch order book data:', error);
//   }
// };

</script>

<template>
    <div>
        <h1>Order Book</h1>
        <section>
            <h2>Bids</h2>
            <v-list>
                <v-list-item v-for="(bid, index) in orderBook.bids" :key="`bid-${index}`">
                    <v-list-item-title>{{ bid[0] }} {{ bid[1] }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </section>
        <section>
            <h2>Asks</h2>
            <v-list>
                <v-list-item v-for="(ask, index) in orderBook.asks" :key="`ask-${index}`">
                    <v-list-item-title>{{ ask[0] }} {{ ask[1] }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </section>
    </div>
</template>

<style scoped>
/* Add your scoped styles here */
</style>
