import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import BinanceApiService from '../services/binanceApi';

export const useOrderBookStore = defineStore('orderbook', () => {
    // State
    const orderBook = ref({
        bids: [],
        asks: [],
        lastUpdateId: 0
    });

    // Actions

    async function fetchOrderBook(valutePair = 'BTCUSDT') {
        try {
            const newOrderBook = await BinanceApiService().getOrderBook(valutePair);
            console.log('orderbook', newOrderBook);
            orderBook.value = newOrderBook;
        } catch (error) {
            console.error('Error fetching the order book:', error);
        }
    }
    function setOrderBook(newOrderBook) {
        orderBook.value = newOrderBook;
    }

    function clearOrderBook() {
        orderBook.value = [];
    }

    // Getters
    const totalOrders = computed(() => orderBook.value.length);

    // Return the store interface
    return { fetchOrderBook, orderBook, setOrderBook, clearOrderBook, totalOrders };
});
