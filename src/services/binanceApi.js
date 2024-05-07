import axios from 'axios';
import WebSocket from 'ws';

const BINANCE_API_BASE_URL = 'https://api.binance.com';
const BINANCE_STREAM_BASE_URL = 'wss://stream.binance.com:9443/ws';

function BinanceApiService() {
    const http = axios.create({
        baseURL: BINANCE_API_BASE_URL,
    });

    async function getOrderBook(valutePair) {
        try {
            const response = await http.get(`/api/v3/depth`, {
                params: {
                    symbol: valutePair.toUpperCase(),
                    limit: 100,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching the order book:', error);
            throw error;
        }
    }

    function subscribeToOrderBook(valutePair, callback) {
        const streamName = `${valutePair.toLowerCase()}@depth`;
        const ws = new WebSocket(`${BINANCE_STREAM_BASE_URL}/${streamName}`);

        ws.on('open', () => {
            console.log(`Subscribed to ${valutePair} order book changes.`);
        });

        ws.on('message', (data) => {
            const message = JSON.parse(data);
            callback(message);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error for ${valutePair} order book:`, error);
        });

        return ws; 
    }

    return { getOrderBook, subscribeToOrderBook };
}

export default BinanceApiService;
