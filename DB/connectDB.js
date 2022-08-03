const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect('mongodb://hackerplays:27017');
        console.log('DB is connected');
    } catch (error) {
        console.log(error);
        throw new Error('Error connecting to DB');
    }
}

module.exports = {
    connectDB
}