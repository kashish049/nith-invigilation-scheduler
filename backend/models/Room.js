const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isBigHall: { type: Boolean, default: false },
  capacity: { type: Number, required: true }
});

module.exports = mongoose.model('Room', roomSchema);