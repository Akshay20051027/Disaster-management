const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  question: { type: String, required: true },
  option_a: String,
  option_b: String,
  option_c: String,
  option_d: String,
  correct_option: { type: String, enum: ['A','B','C','D'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
