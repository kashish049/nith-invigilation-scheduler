const mongoose = require('mongoose');

const invigilatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['I1', 'I2', 'I3'], required: true },
  workload: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Invigilator', invigilatorSchema);