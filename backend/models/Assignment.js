const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  session: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  invigilators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invigilator' }]
});

module.exports = mongoose.model('Assignment', assignmentSchema);