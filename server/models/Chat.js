const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  messages: [{
    id: String,
    role: { type: String, enum: ['user', 'model'] },
    text: String,
    timestamp: Date
  }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);