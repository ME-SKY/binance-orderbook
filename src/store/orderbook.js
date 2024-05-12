import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import BinanceApiService from '../services/binanceApi';
import { useSettingsStore } from './settings';

export const useOrderBookStore = defineStore('orderbook', () => {

    const settingsStore = useSettingsStore();

    const bids = ref(new Map());
    const asks = ref(new Map());

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
            setOrderBookFromStream(update);
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


    function setOrderBookFromStream(newOrderBook) {

        const arrayOfBids = Array.from(newOrderBook.bids.entries()).map(([price, quantity]) => ({
            price,
            quantity,
            total: parseFloat((price * quantity).toFixed(7))
        })).sort((a, b) => b.price - a.price);

        const arrayOfAsks = Array.from(newOrderBook.asks.entries()).map(([price, quantity]) => ({
            price,
            quantity,
            total: parseFloat((price * quantity).toFixed(7))
        })).sort((a, b) => b.price - a.price);;

        bids.value = arrayOfBids;
        asks.value = arrayOfAsks;
    }

    return { fetchOrderBook, bids, asks, setOrderBook, subscribeToOrderBookUpdates };
});
