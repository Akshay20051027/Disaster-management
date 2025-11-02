const mongoose = require('mongoose');

const QuizFileSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  file_url: { type: String, required: true },
  uploaded_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizFile', QuizFileSchema);
