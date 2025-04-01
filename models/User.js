const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    weatherData: [
        {
            date: { type: Date, default: Date.now },
            temperature: Number,
            condition: String,
        }
    ],
});

module.exports = mongoose.model('User', UserSchema);
