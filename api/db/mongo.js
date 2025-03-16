const mongoose = require('mongoose');

const clientOptions = {
    dbName: 'apinode'
}

exports.initClientDbConnection= async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.log('MongoDB connection error:', error.message);
    }
}
