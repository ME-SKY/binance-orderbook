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

    async function getOrderBook(valutePair) {
        try {
            const response = await http.get(`/api/v3/depth`, {
                params: {
                    symbol: valutePair.toUpperCase(),
                    limit: 10, //TODO: make as parameter, 10 used only as demo
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching the order book:', error);
            throw error;
        }
    }

    async function subscribeToOrderBook(valutePair, callback) {

        const streamName = `${valutePair.toLowerCase()}@depth`;
        let localOrderBook = {};
        let lastUpdateId = null;
        let uPrevious = false;

        async function loadSnapshot() {
            try {
                const snapshot = await getOrderBook(valutePair);
                localOrderBook = processSnapshot(snapshot);
                lastUpdateId = snapshot.lastUpdateId;
                console.log("Snapshot loaded successfully.");
                return true;
            } catch (error) {
                console.error('Error loading snapshot:', error);
                reject(error);
            }
        }

        function processSnapshot(snapshot) {
            const bids = new Map(snapshot.bids);
            const asks = new Map(snapshot.asks);
            return { bids, asks, lastUpdateId: snapshot.lastUpdateId };
        }

        function updateLocalOrderBook(event) {
            const { e, b, a } = event;

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

            if(localOrderBook.asks.size > 10) { //TODO:  10/50/100/500/1000 should comes from limit param
                localOrderBook.asks = resizeMap(localOrderBook.asks, 10, true); //TODO: 10/50/100/500/1000 should comes from limit param
            } 
            
            if(localOrderBook.bids.size > 10) {
                localOrderBook.bids = resizeMap(localOrderBook.bids, 10, false);
            }

            callback(localOrderBook);
        }

        await loadSnapshot();

        const ws = new WebSocket(`${BINANCE_STREAM_BASE_URL}/${streamName}`);

        ws.onmessage = (message) => {
            const eventData = JSON.parse(message.data); 

            //TODO: refactor this, u is the same as lastUpdateId in the snapshot
            if (uPrevious === false) {

                if (eventData.U <= lastUpdateId + 1 && eventData.u >= lastUpdateId + 1) {
                    updateLocalOrderBook(eventData);
                    uPrevious = eventData.u;
                } else {
                    uPrevious = eventData.u;
                    console.log("Invalid event received. Skipping update.");
                    console.log('lastUpdateId:', lastUpdateId);
                    console.log('eventData.U:', eventData.U);
                    console.log('eventData.u:', eventData.u);
                }
            } else {
                if (eventData.U === uPrevious + 1) {
                    localOrderBook.lastUpdateId = eventData.u;
                    updateLocalOrderBook(eventData);
                    uPrevious = eventData.u;

                } else {
                    uPrevious = eventData.u;
                    console.log('skipped!!!')
                }
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket encountered an error:', error.message);
        };

        ws.onopen = () => {
            console.log('open connection!');
        };

        return ws;
    }

    return { getOrderBook, subscribeToOrderBook };
}

export default BinanceApiService;
