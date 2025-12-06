const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Essential for connecting frontend

const app = express();
const PORT = 3000;
const DB_HOST = process.env.DB_HOST || 'mongodb'; // Use 'mongodb' as the service name in docker-compose

// 1. Middleware
app.use(cors());
app.use(bodyParser.json());

// 2. MongoDB Connection
// Note: We use the service name 'mongodb' as the host here because it's running in a Docker network.
mongoose.connect(`mongodb://${DB_HOST}:27017/appdb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// 3. Data Schema and Model
const DataSchema = new mongoose.Schema({
    username: String,
    password: String,
    timestamp: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', DataSchema);

// 4. API Endpoints
// Endpoint to save data
app.post('/api/data', async (req, res) => {
    try {
        const newData = new Data(req.body);
        await newData.save();
        res.status(201).json({ message: 'Data saved successfully!', data: newData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to fetch all data
app.get('/api/data', async (req, res) => {
    try {
        const allData = await Data.find({});
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
