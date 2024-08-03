const mongoose = require('mongoose');

// Define the Mongoose schema for your collection
const dataSchema = new mongoose.Schema({
    _id: String,
    name: String,
    symbol: String,
    price: Number,
    marketCap: Number,
}, { collection: 'cryptos_collection' });

// Export the schema as a model
const Data = mongoose.model('Data', dataSchema);
module.exports = Data;