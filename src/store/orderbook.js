import { defineStore } from 'pinia';
import { ref } from 'vue';
import BinanceApiService from '../services/binanceApi';
import { useSettingsStore } from './settings';

export const useOrderBookStore = defineStore('orderbook', () => {

    const settingsStore = useSettingsStore();

    const bids = ref([]);
    const asks = ref([]);

    async function fetchOrderBook() {
        const { pair, limit } = settingsStore;

        try {
            const newOrderBook = await BinanceApiService().getOrderBook(pair, limit);
            setOrderBook({ bids: newOrderBook.bids, asks: newOrderBook.asks, lastUpdateId: newOrderBook.lastUpdateId });
        } catch (error) {
            console.error('Error fetching the order book:', error);
        }
    }

    async function subscribeToOrderBookUpdates() {
        const { pair, limit } = settingsStore;
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

    function setOrderBook(newBook) {
        bids.value = newBook.bids.map(([price, quantity]) => ({
            price,
            quantity,
            total: parseFloat((price * quantity).toFixed(7))
        }));

        asks.value = newBook.asks.map(([price, quantity]) => ({
            price,
            quantity,
            total: parseFloat((price * quantity).toFixed(7))
        }));
    }
    return { fetchOrderBook, bids, asks, setOrderBook, subscribeToOrderBookUpdates };
});
