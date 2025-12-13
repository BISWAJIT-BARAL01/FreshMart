const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Chat = require('./models/Chat');
const Analytics = require('./models/Analytics');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freshmart';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes

// --- Chat Routes ---
app.get('/api/chat/:userId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.params.userId });
    res.json(chat ? chat.messages : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { userId, messages } = req.body;
    await Chat.findOneAndUpdate(
      { userId },
      { userId, messages, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- Analytics & Price Routes ---
app.post('/api/analytics', async (req, res) => {
  try {
    // Expects body: { type: 'EVENT'|'PRICE', ...data }
    await Analytics.create(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('FreshMart API is running...');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));