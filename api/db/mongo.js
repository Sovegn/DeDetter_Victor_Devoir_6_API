const mongoose = require('mongoose');

const clientOptions = {
    dbName: process.env.MONGO_DBNAME || 'apinode'
}

exports.initClientDbConnection = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.URL_MONGO;
        await mongoose.connect(mongoUri, clientOptions);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.log('MongoDB connection error:', error.message);
        process.exit(1);
    }
}