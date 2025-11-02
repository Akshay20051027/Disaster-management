const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: String,
  video_url: String,
  module_order: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Module', ModuleSchema);
