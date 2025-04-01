const axios = require('axios');
const nodemailer = require('nodemailer');

// Fetch weather data from OpenWeatherMap API
async function getWeatherData(latitude, longitude) {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weather = response.data;
        return {
            temperature: weather.main.temp,
            description: weather.weather[0].description,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
        };
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return null;
    }
}

// Send email with weather data
function sendWeatherReport(email, weatherData) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Hourly Weather Report',
        text: `
            Temperature: ${weatherData.temperature}°C
            Description: ${weatherData.description}
            Humidity: ${weatherData.humidity}%
            Wind Speed: ${weatherData.windSpeed} m/s
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { getWeatherData, sendWeatherReport };
