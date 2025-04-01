const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron');
const { sendWeatherReport, getWeatherData } = require('./utils/weather'); // Import the function to send weather reports and get weather data
const User = require('./models/User'); // Import User model

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

// Connect to Database
connectDB();

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API');
});

// Cron job to send weather reports every 3 hours
cron.schedule('*/3 * * * *', async () => {
    try {
        const users = await User.find(); // Get all users from DB

        // Loop through users and send weather reports
        users.forEach(async (user) => {
            const { latitude, longitude } = user.location;
            const weatherData = await getWeatherData(latitude, longitude); // Fetch weather data

            // Save weather data to the user's record
            user.weatherData.push({ date: new Date(), ...weatherData });
            await user.save();

            // Send weather report email
            sendWeatherReport(user.email, weatherData);
        });

        console.log('Weather reports sent to users every 3 hours.');
    } catch (error) {
        console.error('Error during cron job:', error);
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
