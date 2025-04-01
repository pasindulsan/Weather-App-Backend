# Weather App Backend (Node.js)

## 📌 Project Overview
This is a Node.js backend application that stores users’ emails and locations and automatically sends hourly weather reports every 3 hours.

## 🚀 Features
- Store user details (email and location)
- Update user location
- Retrieve user weather data for a specific day
- Fetch weather data using OpenWeatherMap API
- Send weather reports via email every 3 hours using Nodemailer
- Generate AI-based weather descriptions using OpenAI/Gemini API
- Convert coordinates to city names using Google Cloud API
- Secure database storage using MongoDB
- Deployment-ready for Vercel/AWS

## 🛠️ Technologies Used
- **Node.js** (Express.js for API routing)
- **MongoDB** (Database for storing users and weather data)
- **OpenWeatherMap API** (Fetch weather data)
- **Nodemailer** (Send email reports)
- **OpenAI/Gemini API** (Generate AI-based weather reports)
- **Google Cloud API** (Convert coordinates to city names)
- **Node-cron** (Schedule weather reports every 3 hours)

## 📂 Project Structure
```
weather-app-backend/
│── routes/
│   ├── userRoutes.js  # User-related API routes
│── models/
│   ├── User.js        # MongoDB User schema
│── utils/
│   ├── weather.js     # Weather fetching and processing functions
│── db.js              # MongoDB connection setup
│── server.js          # Main server file
│── .env               # Environment variables
│── package.json       # Project dependencies
```

## ⚙️ Installation & Setup
### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-repo/weather-app-backend.git
cd weather-app-backend
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Set up environment variables
Create a `.env` file in the project root and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweathermap_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
```

### 4️⃣ Start the server
```bash
node server.js
```
Or use Nodemon for automatic restarts:
```bash
npx nodemon server.js
```

### 5️⃣ Test API Routes with Postman
- **POST** `/api/users/add` → Add a new user
- **PUT** `/api/users/update-location/:email` → Update user location
- **GET** `/api/users/weather/:email/:date` → Fetch user’s weather data

## ⏰ Scheduling Weather Reports
This application uses `node-cron` to send weather reports **every 3 hours**.
```js
cron.schedule('0 */3 * * *', async () => {
    console.log('Sending weather reports...');
    // Call function to fetch weather data and send emails
});
```
For testing every 3 minutes, use:
```js
cron.schedule('*/3 * * * *', async () => {
    console.log('Running every 3 minutes for testing...');
});
```

## 🚀 Deployment
### Deploy on **Vercel**
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` and follow setup instructions
 or
### Deploy on **AWS**
- Use **EC2** for hosting
- Use **MongoDB Atlas** or **AWS DocumentDB** for storage
- Configure **AWS Lambda** (Optional for cron jobs)

## 🛠️ Future Improvements
- Add **authentication** (JWT-based user authentication)
- Implement **caching** for API responses
- Extend support for more weather APIs

## 📌 Author & Contributions
Author - Pasindu Dulsan

🎉 Happy Coding!

