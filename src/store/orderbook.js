import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import BinanceApiService from '../services/binanceApi';

export const useOrderBookStore = defineStore('orderbook', () => {
    // State

    const bids = ref(new Map());
    const asks = ref(new Map());
    const lastUpdateId = ref(0); // TODO: remove orderBook ref and use these three refs instead
    const orderBook = ref({
        bids: new Map(),
        asks: new Map(),
        lastUpdateId: 0
    });

    // Actions

    async function fetchOrderBook(valutePair = 'BTCUSDT') {
        try {
            const newOrderBook = await BinanceApiService().getOrderBook(valutePair);
            console.log('orderbook', newOrderBook);

            const bids = new Map(newOrderBook.bids);
            const asks = new Map(newOrderBook.asks);

            setOrderBook({ bids, asks, lastUpdateId: newOrderBook.lastUpdateId });

        } catch (error) {
            console.error('Error fetching the order book:', error);
        }

    }

    async function subscribeToOrderBookUpdates(valutePair = 'BTCUSDT') {
        const handleOrderBookUpdate = (update) => {
            setOrderBook(update);
            console.log('Order book updated:', update);
        };

        const ws = await BinanceApiService().subscribeToOrderBook(valutePair, handleOrderBookUpdate);
        return () => {
            console.log('ws iunside subscribeToOrderBookUpdatese:', ws);
            if (ws) {
                ws.close();
                console.log(`Unsubscribed from ${valutePair} order book updates.`);
            }

        };
    }


    function setOrderBook(newOrderBook) {
        lastUpdateId.value = newOrderBook.lastUpdateId;
        bids.value = newOrderBook.bids;
        asks.value = newOrderBook.asks;
    }

    function clearOrderBook() {
        orderBook.value = [];
    }

    // Getters
    const totalOrders = computed(() => orderBook.value.length);

    const tableBids = computed(function () {
        return Array.from(bids.value.entries())
            .map(([price, quantity]) => ({
                price: (+price).toFixed(2),
                quantity,
                total: parseFloat((price * quantity).toFixed(7))
            }))
            .sort((a, b) => b.price - a.price);
    });

    const tableAsks = computed(function () {
        return Array.from(asks.value.entries())
            .map(([price, quantity]) => ({
                price: (+price).toFixed(2),
                quantity,
                total: parseFloat((price * quantity).toFixed(7))
            }))
            .sort((a, b) => b.price - a.price);
    })

    // Return the store interface
    return { fetchOrderBook, bids, asks, setOrderBook, clearOrderBook, totalOrders, subscribeToOrderBookUpdates, tableBids, tableAsks };
});
