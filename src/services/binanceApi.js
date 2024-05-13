import axios from 'axios';

const BINANCE_API_BASE_URL = 'https://api.binance.com';
const BINANCE_STREAM_BASE_URL = 'wss://stream.binance.com:9443/ws';
import BinarySearchTree from '@/utils';

function BinanceApiService() {
    const http = axios.create({
        baseURL: BINANCE_API_BASE_URL,
    });

    async function getOrderBook(valutePair, limit = 10) {
        try {
            const response = await http.get(`/api/v3/depth`, {
                params: {
                    symbol: valutePair.toUpperCase(),
                    limit: limit,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching the order book:', error);
            throw error;
        }
    }

    async function subscribeToOrderBook(valutePair, limit, callback) {

        const streamName = `${valutePair.toLowerCase()}@depth`;

        const bidsTree = new BinarySearchTree(limit, 'left');
        const asksTree = new BinarySearchTree(limit, 'right');
    
        let lastUpdateId = null;
        let uPrevious = false;

        async function loadSnapshot() {
            try {
                const snapshot = await getOrderBook(valutePair, limit);
                lastUpdateId = snapshot.lastUpdateId;
            } catch (error) {
                console.error('Error loading snapshot:', error);
            }
        }

        function updateLocalOrderBook(event) {
            const { b, a } = event;

            const bidsDeletions = [];
            const asksDeletions = [];

            for (const [price, quantity] of b) {
                if (+quantity == '0') {
                    bidsDeletions.push([price, quantity]);
                } else {
                    bidsTree.insert(price, quantity);
                }
            }

            for (const [price, quantity] of a) {
                if (+quantity == '0') {
                    asksDeletions.push([price, quantity]);
                } else {
                    asksTree.insert(price, quantity);
                }
            }

            while(bidsTree.countNodes() > limit) {
                if(bidsDeletions.length) {
                    bidsTree.remove(bidsDeletions.shift()[0]);
                } else {
                    bidsTree.removeOldestNode();
                }
                
            };

            while(asksTree.countNodes() > limit) {
                if(asksDeletions.length) {
                    asksTree.remove(asksDeletions.shift()[0]);
                } else {
                    asksTree.removeOldestNode();
                }
            };

            callback({ bids: bidsTree.toArray(), asks: asksTree.toArray() });
        }

        await loadSnapshot();

        const ws = new WebSocket(`${BINANCE_STREAM_BASE_URL}/${streamName}`);

        ws.onmessage = (message) => {
            const eventData = JSON.parse(message.data);

            if (uPrevious === false) {

                if (eventData.U <= lastUpdateId + 1 && eventData.u >= lastUpdateId + 1) {
                    updateLocalOrderBook(eventData);
                    uPrevious = eventData.u;
                } else {
                    uPrevious = eventData.u;
                }
            } else {

                if (eventData.U === uPrevious + 1) {
                    updateLocalOrderBook(eventData);
                    uPrevious = eventData.u;
                } else {
                    uPrevious = eventData.u;
                }
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket encountered an error:', error.message);
        };

        return ws;
    }

    return { getOrderBook, subscribeToOrderBook };
}

export default BinanceApiService;
