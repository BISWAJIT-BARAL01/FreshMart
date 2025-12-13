const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  type: { type: String, enum: ['EVENT', 'PRICE'], required: true },
  name: String, // For generic events
  data: mongoose.Schema.Types.Mixed, // Flexible payload
  
  // Specific fields for Market Prices
  itemId: String,
  price: Number,
  location: String,
  
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);