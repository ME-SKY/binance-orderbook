import axios from 'axios';

const BINANCE_API_BASE_URL = 'https://api.binance.com';
const BINANCE_STREAM_BASE_URL = 'wss://stream.binance.com:9443/ws';

function resizeMap(map, n, fromEnd = false) {
    const entries = Array.from(map.entries());

    if (fromEnd) {
        const slicedEntries = entries.slice(-n);
        return new Map(slicedEntries);
    } else {
        const slicedEntries = entries.slice(0, n);
        return new Map(slicedEntries);
    }
}

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
        let localOrderBook = {};
        let lastUpdateId = null;
        let uPrevious = false;

        async function loadSnapshot() {
            try {
                const snapshot = await getOrderBook(valutePair, limit);
                localOrderBook = processSnapshot(snapshot);
                lastUpdateId = snapshot.lastUpdateId;
            } catch (error) {
                console.error('Error loading snapshot:', error);
            }
        }

        function processSnapshot(snapshot) {
            const bids = new Map(snapshot.bids);
            const asks = new Map(snapshot.asks);
            return { bids, asks, lastUpdateId: snapshot.lastUpdateId };
        }

        function updateLocalOrderBook(event) {
            const { b, a } = event;

            for (const [price, quantity] of b) {
                if ((+quantity) == '0') {
                    localOrderBook.bids.delete(price);
                } else {
                    localOrderBook.bids.set(price, quantity);
                }
            }

            for (const [price, quantity] of a) {
                if ((+quantity) == '0') {
                    localOrderBook.asks.delete(price);
                } else {
                    localOrderBook.asks.set(price, quantity);
                }
            }

            if (localOrderBook.asks.size > limit) { // if quantity more than limit - resize to fit limit
                localOrderBook.asks = resizeMap(localOrderBook.asks, limit, false);
            }

            if (localOrderBook.bids.size > limit) {
                localOrderBook.bids = resizeMap(localOrderBook.bids, limit, true);
            }

            callback(localOrderBook);
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
                    localOrderBook.lastUpdateId = eventData.u;
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
