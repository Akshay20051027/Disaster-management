const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', default: null },
  title: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);
