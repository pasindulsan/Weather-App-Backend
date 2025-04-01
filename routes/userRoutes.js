const express = require('express');
const nodemailer = require('nodemailer');
const { getWeatherData } = require('../utils/weather'); // Import your weather API fetching logic
const User = require('../models/User');
const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS,  // Your Gmail app password (set up in Gmail settings)
    },
});

// ✅ Route 1: Add a new user
router.post('/add', async (req, res) => {
    try {
        const { email, latitude, longitude } = req.body;

        // Validate input
        if (!email || !latitude || !longitude) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Get weather data for the user's location
        const weatherData = await getWeatherData(latitude, longitude);

        // Create a new user with weather data
        user = new User({
            email,
            location: { latitude, longitude },
            weatherData: [{ date: new Date(), ...weatherData }],
        });

        await user.save();
        res.status(201).json({ message: 'User added successfully', user });

        // Send weather email
        sendWeatherEmail(email, weatherData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ Route 2: Update user's location
router.put('/update-location/:email', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.location = { latitude, longitude };
        await user.save();

        res.json({ message: 'Location updated successfully', user });

        // Fetch and update weather data for the user
        const newWeatherData = await getWeatherData(latitude, longitude);
        user.weatherData.push({ date: new Date(), ...newWeatherData });
        await user.save();

        // Send updated weather email
        sendWeatherEmail(email, newWeatherData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ Route 3: Fetch user's weather data for a specific day
router.get('/weather/:email/:date', async (req, res) => {
    try {
        const { email, date } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedDate = new Date(date).toISOString().split('T')[0];
        const weatherData = user.weatherData.filter(
            (entry) => entry.date.toISOString().split('T')[0] === formattedDate
        );

        res.json({ email, date: formattedDate, weatherData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Function to send weather email
const sendWeatherEmail = (email, weatherData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Hourly Weather Report',
        text: generateWeatherReportText(weatherData),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Weather email sent:', info.response);
        }
    });
};

// Function to generate weather report text
const generateWeatherReportText = (weatherData) => {
    return `
        Weather Report:
        Temperature: ${weatherData.main.temp}°C
        Humidity: ${weatherData.main.humidity}%
        Weather: ${weatherData.weather[0].description}
        Wind Speed: ${weatherData.wind.speed} m/s
    `;
};

module.exports = router;
