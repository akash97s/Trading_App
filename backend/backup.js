// connect to cryptp api
// get data from api and log
// create websocket connection
// Connect to frontend

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 4000;
const Data = require('./database/test_schema'); // Adjust the path as necessary

// MongoDB connection URI
const mongoURI = 'mongodb+srv://akashselvae7:AkashDev123@cluster1.fix4jxn.mongodb.net/trading_db?retryWrites=true&w=majority&appName=Cluster1';
const apiKey = "CG-tofPV9bchCQwt6pA9XwEjed7";

// Connect to MongoDB using async/await
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.log('MongoDB connection error:', err);
  }
};

connectToMongoDB();

// Middleware
app.use(bodyParser.json());

// Endpoint to get all data from the collection
app.get('/data', async (req, res) => {
  try {
        const data = await Data.find();
        console.log('Data : ', data.length);
        res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

// Endpoint to save a list of users to the collection at once
app.post('/data/insert-many', async (req, res) => {
    try {
        const users = req.body;
        await Data.insertMany(users);
        console.log('Data inserted succesfully');
        res.status(201).json({ message: 'All users successfully saved' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving users', error });
    }
  });

// Endpoint to get the last 5 entries with a specified name from the request query parameters
app.get('/data/latest', async (req, res) => {
    try {
        const { name } = req.query; // Get the name from the query parameters
        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is required' });
        }
        const data = await Data.find({ name })
            .sort({ _id: -1 }) // Sort by descending _id (most recent entries first)
            .limit(5); // Limit to the last 5 entries
            console.log('latest data: ', data.length);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});
   
// Example usage with a list of coin names
const coinNames = ['bitcoin', 'ethereum', 'litecoin', "solana", "dogecoin"];

// Endpoint to get coin data
app.get('/data/getAll', async (req, res) => {
    if (!coinNames) {
        return res.status(400).json({ message: 'coinNames list is required' });
    }
    // Convert the list of coin names to a comma-separated string
    const ids = Array.isArray(coinNames) ? coinNames.join('%2C') : coinNames.split(',').join('%2C');
    // Define the options for the axios request
    const options = {
        method: 'GET',
        url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`,
        headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey }
    };

    try {
        // Make the request using async/await
        const response = await axios.request(options);
        console.log("Api data: ", response)
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching coin data', error: error.message });
  }
});

// Endpoint to get coin data
app.get('/data/getAll', async (req, res) => {
  // async function saveCoinsData(coinNames) {
      if (!coinNames) {
          return res.status(400).json({ message: 'coinNames list is required' });
      }
      // Convert the list of coin names to a comma-separated string
      const ids = Array.isArray(coinNames) ? coinNames.join('%2C') : coinNames.split(',').join('%2C');
      // Define the options for the axios request
      const options = {
          method: 'GET',
          url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`,
          headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey }
      };
  
      try {
          // Make the request using async/await
          const response = await axios.request(options);
          // console.log("Api data: ", response.data)
          // preproess the necessary data fields
          const processedData = response.data.map(coin => ({
              name: coin.name,
              symbol: coin.symbol,
              price: coin.current_price,
              marketCap: coin.market_cap,
              lastUpdated: coin.last_updated
          }));
          console.log("API data processed ", processedData.length );
          
          // save to db
          try {
              await Data.insertMany(processedData);
              // console.log('Data inserted succesfully');
              res.status(201).json({ message: 'Data saved to db successfully' });
          } catch (error) {
              res.status(500).json({ message: 'Error saving data to db', error });
          }
  
          console.log("API data saved to database")
          // res.status(201).json(processedData);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error fetching API coin data', error: error.message });
    }
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// ============================

// create websocket connection
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

// Endpoint to get coin data
// app.get('/data/getAll', async (req, res) => {
async function saveCoinsData() {
    if (!coinSymbols) {
        // return res.status(400).json({ message: 'coinSymbols list is required' });
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
        console.log("Success: API data processed ", processedData.length );    
        // save to db
        try {
            await Data.insertMany(processedData);
            // console.log('Data inserted succesfully');
            // res.status(201).json({ message: 'Data saved to db successfully' });
        } catch (error) {
            console.log('Error: saving data to db');
            // res.status(500).json({ message: 'Error saving data to db', error });
        }
        console.log("Success: API data saved to database")
        // res.status(201).json(processedData);
    } catch (error) {
        console.error('Error: fetching API data ', error);
        // res.status(500).json({ message: 'Error fetching API coin data', error: error.message });
    }
// });
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

        const data = await Data.find({ name: crypto_name  })
            .sort({ _id: -1 })                  // Sort by descending _id (most recent entries first)
            .limit(20);                          // Limit to the last 5 entries
            console.log('Success: latest data ', crypto_name, data.length, lastQueriedCrypto);
            res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching latest N rows', error });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});