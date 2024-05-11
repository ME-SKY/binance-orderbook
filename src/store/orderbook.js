import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import BinanceApiService from '../services/binanceApi';
import { useSettingsStore } from './settings';

export const useOrderBookStore = defineStore('orderbook', () => {

    const settingsStore = useSettingsStore();

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

    

    async function fetchOrderBook() {
        const {pair, limit} = settingsStore;

        try {
            const newOrderBook = await BinanceApiService().getOrderBook(pair, limit);
            setOrderBook({ bids: newOrderBook.bids, asks: newOrderBook.asks, lastUpdateId: newOrderBook.lastUpdateId });

        } catch (error) {
            console.error('Error fetching the order book:', error);
        }

    }

    async function subscribeToOrderBookUpdates() {
        const {pair, limit} = settingsStore;
        const handleOrderBookUpdate = (update) => {
            setOrderBook(update);
        };

        const ws = await BinanceApiService().subscribeToOrderBook(pair, limit, handleOrderBookUpdate);
        return () => {
            if (ws) {
                ws.close();
                console.log(`Unsubscribed from ${pair} order book updates.`);
            }
        };
    }


    function setOrderBook(newOrderBook) {
        lastUpdateId.value = newOrderBook.lastUpdateId;
        // const {limit} = settingsStore;
        
        const arrayOfBids = Array.from(newOrderBook.bids.entries()).map(([price, quantity]) => ({
            price,
            quantity,
            total: parseFloat((price * quantity).toFixed(7))
        })).sort((a, b) => b.price - a.price);
        
        const arrayOfAsks = Array.from(newOrderBook.asks.entries()).map(([price, quantity]) => ({
            price,
            quantity,
            total: parseFloat((price * quantity).toFixed(7))
        }))
        .sort((a, b) => b.price - a.price);;
        

        bids.value = arrayOfBids;
        asks.value = arrayOfAsks;
    }

    function clearOrderBook() {
        orderBook.value = [];
    }

    // Getters
    const totalOrders = computed(() => orderBook.value.length);

    // const tableBids = computed(function () {
    //     return Array.from(bids.value.entries())
    //         .map(([price, quantity]) => ({
    //             price: (+price).toFixed(2),
    //             quantity,
    //             total: parseFloat((price * quantity).toFixed(7))
    //         }))
    //         .sort((a, b) => b.price - a.price);
    // });

    // const tableAsks = computed(function () {
    //     return Array.from(asks.value.entries())
    //         .map(([price, quantity]) => ({
    //             price: (+price).toFixed(2),
    //             quantity,
    //             total: parseFloat((price * quantity).toFixed(7))
    //         }))
    //         .sort((a, b) => b.price - a.price);
    // })

    // Return the store interface
    return { fetchOrderBook, bids, asks, setOrderBook, clearOrderBook, totalOrders, subscribeToOrderBookUpdates };
});
