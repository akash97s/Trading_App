const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const port = process.env.PORT || 4000;
const Data = require('./database/test_schema');
const app = express();

// MongoDB connection URI
const mongoURI = 'mongodb+srv://akashselvae7:AkashDev123@cluster1.fix4jxn.mongodb.net/trading_db?retryWrites=true&w=majority&appName=Cluster1';
const apiKey = "a0ba23bb-5ead-4b07-a9ef-456eb040c897";
let lastQueriedCrypto = null; // Variable to track the last queried cryptocurrency

// Use cors middleware
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
});

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.log('MongoDB connection error:', err);
    }
};
connectToMongoDB();

// Example usage with a list of coin names
// coingecko doesnt update fast enough to show update in real-time
const coinSymbols = ["BTC", "ETH", "LTC", "SOL", "DOGE"];
const nameMap = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "LTC": "Litecoin",
    "SOL" : "Solana",
    "DOGE": "Dogecoin"
}

// get the last 20 entries for a specific coin
const getLatestCryptoData = async (crypto_name) => {
    try {
        const data = await Data.find({ name: crypto_name })
            .sort({ _id: -1 })  // Sort by descending _id (most recent entries first)
            .limit(20);         // Limit to the last 20 entries
        console.log('Success: data updated for ', crypto_name);
        return data;
    } catch (error) {
        console.error('Error fetching latest N rows', error);
        throw error;
    }
};

// function to get coin data
async function saveCoinsData() {
    if (!coinSymbols) {
        console.log('Error: coinSymbols list is required');
        return;
    }
    // Define the options for the axios request
    const options = {
        method: 'POST',
        url: "https://api.livecoinwatch.com/coins/map",
        headers: { accept: 'application/json', 'x-api-key': apiKey },
        data: {
            codes: coinSymbols,
            currency: "USD",
            sort: "rank",
            order: "ascending",
            offset: 0,
            limit: 0,
            meta: false
        }
    };

    try {
        const response = await axios.request(options);
        // console.log("Api data: ", response.data)
        // preprocess the necessary data fields
        const processedData = response.data.map(coin => ({
            name: nameMap[coin.code],
            symbol: coin.code,
            price: coin.rate,
            marketCap: coin.cap
        }));
        // console.log("Success: API data processed ", processedData.length );    
        // save to db
        try {
            await Data.insertMany(processedData);
            console.log("Success: API data saved to database")
            // emit the update to the clients
            if (lastQueriedCrypto) {
                const latestData = await getLatestCryptoData(lastQueriedCrypto);
                // Emit the updated last 20 rows to all clients
                io.emit('cryptoUpdate', {
                    name: lastQueriedCrypto,
                    data: latestData
                });
            }
            console.log("Success: cryptoUpate event emitted")
        } catch (error) {
            console.log('Error: saving data to db');
        }
    } catch (error) {
        console.error('Error: fetching API data ', error);
    }
}

// poll API every 5 seconds to update the db with latest market data  
setInterval(() => {
    saveCoinsData();
}, 5000); // 5000 milliseconds = 5 seconds


// Endpoint to get the last 20 entries for selected crypto
app.get('/data/latest_N_Rows', async (req, res) => {
    try {
        const { crypto_name } = req.query; // Get the name from the query parameters
        if (!crypto_name) {
            return res.status(400).json({ message: 'Crypto name query parameter is required' });
        }
        lastQueriedCrypto = crypto_name; // updae last_queried_crypto
        const data = await getLatestCryptoData(crypto_name);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching latest N rows', error });
    }
});


// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});